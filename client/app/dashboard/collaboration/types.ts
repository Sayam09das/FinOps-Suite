export type MemberRole = "Owner" | "Editor" | "Viewer"

export interface Member {
  id: string
  name: string
  email: string
  avatar?: string
  role: MemberRole
  joinedAt: string
}

export interface Activity {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  amount?: number
  description: string
  timestamp: string
}

export interface SharedAccount {
  id: string
  name: string
  description: string
  totalBalance: number
  currency: string
  members: Member[]
  activities: Activity[]
  createdAt: string
  color: string
}

/* ───────── Group Expenses ───────── */

export type SplitType = "equal" | "custom" | "percentage"

export interface GroupMember {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ExpenseSplit {
  userId: string
  amount: number
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  paidBy: string
  splitType: SplitType
  splits: ExpenseSplit[]
  tags: string[]
  date: string
  createdAt: string
}

export interface ExpenseGroup {
  id: string
  name: string
  description: string
  color: string
  members: GroupMember[]
  expenses: Expense[]
  createdAt: string
}

export interface SettlementSummary {
  userId: string
  name: string
  paid: number
  owed: number
  balance: number
}

/* ───────── Invite Users ───────── */

export type InviteStatus = "pending" | "accepted" | "expired"

export interface Invite {
  id: string
  email: string
  role: MemberRole
  status: InviteStatus
  sentAt: string
  expiresAt: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: MemberRole
  joinedAt: string
  status: "active" | "inactive"
}

