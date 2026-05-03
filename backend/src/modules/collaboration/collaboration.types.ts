export type MemberRole = "Owner" | "Editor" | "Viewer"

export interface CreateInviteDTO {
  email: string
  role: Exclude<MemberRole, "Owner">
}

export interface UpdateMemberRoleDTO {
  role: MemberRole
}

export interface CreateSharedAccountDTO {
  name: string
  description: string
  color?: string
  currency?: string
}

export interface CreateExpenseGroupDTO {
  name: string
  description: string
  color?: string
}
