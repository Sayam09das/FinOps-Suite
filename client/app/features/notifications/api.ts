"use client"

import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import type { NotificationsResponse } from "./types"

export const notificationsApi = {
  getNotifications: () => api.get<NotificationsResponse>(ENDPOINTS.NOTIFICATIONS.LIST),
  markAsRead: (id: string) => api.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
  markAllAsRead: () => api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
}
