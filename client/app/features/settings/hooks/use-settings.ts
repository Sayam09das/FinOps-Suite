"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { settingsApi } from "../api"
import type { UpdateUserSettingsInput } from "../types"
import { AUTH } from "@/app/lib/constants/auth"

export const settingsKeys = {
  all: ["settings"] as const,
  me: () => [...settingsKeys.all, "me"] as const,
}

export function useUserSettings() {
  return useQuery({
    queryKey: settingsKeys.me(),
    queryFn: settingsApi.getSettings,
    staleTime: 0,
    refetchInterval: 5000,
  })
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserSettingsInput) => settingsApi.updateSettings(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(settingsKeys.me(), updated)
      queryClient.setQueryData(["auth", "me"], updated)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH.LOCAL_STORAGE_USER, JSON.stringify(updated))
      }
    },
  })
}
