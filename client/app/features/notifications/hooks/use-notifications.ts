"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "../api"
import { initSocket, socketEvents } from "@/app/lib/socket"
import { useAuth } from "@/app/features/auth"
import { useToast } from "@/app/components/ui/use-toast"
import type { NotificationItem } from "../types"

const REFRESH_INTERVAL = 5000

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.getNotifications,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  })
}

export function useNotificationRealtime() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const socket = initSocket()
    socket.connect()

    socket.on("connect", () => {
      socket.emit(socketEvents.USER_ONLINE, user.id)
    })

    socket.on(socketEvents.NOTIFICATION, (notification: NotificationItem) => {
      queryClient.setQueryData(notificationKeys.list(), (current: any) => {
        const existing = current?.notifications ?? []
        return {
          notifications: [notification, ...existing.filter((item: NotificationItem) => item.id !== notification.id)],
          unreadCount: (current?.unreadCount ?? 0) + (notification.read ? 0 : 1),
        }
      })

      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      })
    })

    return () => {
      socket.off(socketEvents.NOTIFICATION)
      socket.disconnect()
    }
  }, [queryClient, toast, user?.id])
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(notificationKeys.list(), (current: any) => {
        if (!current) {
          return current
        }

        const notifications = (current.notifications ?? []).map((item: NotificationItem) =>
          item.id === id ? { ...item, read: true } : item,
        )
        const unreadCount = notifications.filter((item: NotificationItem) => !item.read).length

        return { notifications, unreadCount }
      })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(notificationKeys.list(), (current: any) => {
        if (!current) {
          return current
        }

        return {
          notifications: (current.notifications ?? []).map((item: NotificationItem) => ({ ...item, read: true })),
          unreadCount: 0,
        }
      })
    },
  })
}
