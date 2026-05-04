"use client"

import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import type { UpdateUserSettingsInput, UserSettings } from "./types"

export const settingsApi = {
  getSettings: () => api.get<UserSettings>(ENDPOINTS.USER.ME),
  updateSettings: (data: UpdateUserSettingsInput) =>
    api.patch<UserSettings>(ENDPOINTS.USER.UPDATE_ME, data),
}
