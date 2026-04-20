"use client"

import { io, Socket } from "socket.io-client"
import { API } from "../constants"

export const initSocket = (): Socket => {
  const socket = io(API.BASE_URL, {
    path: "/socket.io/",
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  })
  
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
  })
  
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
  })
  
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error)
  })
  
  return socket
}

export const socketEvents = {
  NOTIFICATION: "notification" as const,
  NEW_TRANSACTION: "newTransaction" as const,
  BUDGET_UPDATE: "budgetUpdate" as const,
  APPROVAL_REQUEST: "approvalRequest" as const,
  DASHBOARD_REFRESH: "dashboardRefresh" as const,
  ANALYTICS_UPDATE: "analyticsUpdate" as const,
  USER_ONLINE: "userOnline" as const,
  USER_OFFLINE: "userOffline" as const,
  BUDGET_THRESHOLD: "budgetThreshold" as const,
} as const

export type SocketEvent = typeof socketEvents[keyof typeof socketEvents]

