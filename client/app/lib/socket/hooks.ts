"use client"

import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
import { initSocket, socketEvents } from "./index"
import { useToast } from "../../components/ui/use-toast"
import type { QueryObserver } from "@tanstack/react-query"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const newSocket = initSocket()
    setSocket(newSocket)

    // Notification handler
    newSocket.on(socketEvents.NOTIFICATION, (data) => {
      toast({
        title: "New notification",
        description: data.message,
        duration: 5000,
      })
      // Invalidate relevant queries
      // queryClient.invalidateQueries({ predicate: (query: QueryObserver) => 
        //   query.queryKey.includes("notifications")
      // })
    })

    newSocket.on(socketEvents.BUDGET_THRESHOLD, (data) => {
      toast({
        variant: "destructive",
        title: "Budget alert",
        description: `Budget \${data.name} has reached ${data.threshold}%`,
      })
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const sendEvent = (event: string, data?: any) => {
    socket?.emit(event, data)
  }

  return { socket, sendEvent }
}

export function useRealtimeBudget(budgetId: string) {
  const [data, setData] = useState<any>(null)
  const socket = useSocket().socket

  useEffect(() => {
    if (!socket) return

    socket.on("budgetUpdate", (update) => {
      if (update.id === budgetId) {
        setData(update)
      }
    })

    return () => {
      socket.off("budgetUpdate")
    }
  }, [socket, budgetId])

  return data
}

