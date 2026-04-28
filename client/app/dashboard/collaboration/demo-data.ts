import type { SharedAccount } from "./types"

export const demoSharedAccounts: SharedAccount[] = [
  {
    id: "sa-1",
    name: "Trip Fund",
    description: "Goa trip with college friends — Dec 2024",
    totalBalance: 84500,
    currency: "INR",
    color: "#3b82f6",
    createdAt: "2024-09-15T10:00:00Z",
    members: [
      { id: "u-1", name: "Rahul Sharma", email: "rahul@example.com", role: "Owner", joinedAt: "2024-09-15T10:00:00Z" },
      { id: "u-2", name: "Ankit Verma", email: "ankit@example.com", role: "Editor", joinedAt: "2024-09-16T08:30:00Z" },
      { id: "u-3", name: "Priya Patel", email: "priya@example.com", role: "Viewer", joinedAt: "2024-09-20T14:00:00Z" },
      { id: "u-4", name: "You", email: "you@example.com", role: "Editor", joinedAt: "2024-09-17T09:00:00Z" },
    ],
    activities: [
      { id: "act-1", userId: "u-1", userName: "Rahul Sharma", action: "added", amount: 25000, description: "added ₹25,000 to the pool", timestamp: "2024-11-28T10:30:00Z" },
      { id: "act-2", userId: "u-2", userName: "Ankit Verma", action: "updated", description: "updated transaction: Hotel booking", timestamp: "2024-11-27T16:45:00Z" },
      { id: "act-3", userId: "u-4", userName: "You", action: "added", amount: 15000, description: "added ₹15,000 to the pool", timestamp: "2024-11-26T09:15:00Z" },
      { id: "act-4", userId: "u-3", userName: "Priya Patel", action: "joined", description: "joined the account", timestamp: "2024-09-20T14:00:00Z" },
      { id: "act-5", userId: "u-2", userName: "Ankit Verma", action: "added", amount: 20000, description: "added ₹20,000 to the pool", timestamp: "2024-11-25T11:00:00Z" },
      { id: "act-6", userId: "u-1", userName: "Rahul Sharma", action: "created", description: "created the account", timestamp: "2024-09-15T10:00:00Z" },
    ],
  },
  {
    id: "sa-2",
    name: "Family Wallet",
    description: "Monthly household expenses & groceries",
    totalBalance: 42000,
    currency: "INR",
    color: "#10b981",
    createdAt: "2024-08-01T06:00:00Z",
    members: [
      { id: "u-5", name: "Dad", email: "dad@example.com", role: "Owner", joinedAt: "2024-08-01T06:00:00Z" },
      { id: "u-6", name: "Mom", email: "mom@example.com", role: "Editor", joinedAt: "2024-08-01T06:30:00Z" },
      { id: "u-7", name: "Sister", email: "sister@example.com", role: "Viewer", joinedAt: "2024-08-02T10:00:00Z" },
      { id: "u-4", name: "You", email: "you@example.com", role: "Editor", joinedAt: "2024-08-01T07:00:00Z" },
    ],
    activities: [
      { id: "act-7", userId: "u-5", userName: "Dad", action: "added", amount: 30000, description: "added ₹30,000 for monthly expenses", timestamp: "2024-12-01T08:00:00Z" },
      { id: "act-8", userId: "u-6", userName: "Mom", action: "updated", description: "updated grocery transaction", timestamp: "2024-12-02T14:30:00Z" },
      { id: "act-9", userId: "u-4", userName: "You", action: "added", amount: 12000, description: "added ₹12,000 contribution", timestamp: "2024-12-01T09:00:00Z" },
      { id: "act-10", userId: "u-7", userName: "Sister", action: "joined", description: "joined the account", timestamp: "2024-08-02T10:00:00Z" },
    ],
  },
  {
    id: "sa-3",
    name: "Office Lunch Pool",
    description: "Team lunch & snack fund",
    totalBalance: 12800,
    currency: "INR",
    color: "#f59e0b",
    createdAt: "2024-10-10T12:00:00Z",
    members: [
      { id: "u-8", name: "Team Lead", email: "lead@example.com", role: "Owner", joinedAt: "2024-10-10T12:00:00Z" },
      { id: "u-9", name: "Colleague A", email: "colleagueA@example.com", role: "Editor", joinedAt: "2024-10-11T09:00:00Z" },
      { id: "u-10", name: "Colleague B", email: "colleagueB@example.com", role: "Viewer", joinedAt: "2024-10-12T10:00:00Z" },
      { id: "u-4", name: "You", email: "you@example.com", role: "Viewer", joinedAt: "2024-10-15T11:00:00Z" },
    ],
    activities: [
      { id: "act-11", userId: "u-8", userName: "Team Lead", action: "added", amount: 5000, description: "added ₹5,000 initial fund", timestamp: "2024-12-05T12:00:00Z" },
      { id: "act-12", userId: "u-9", userName: "Colleague A", action: "added", amount: 3000, description: "added ₹3,000", timestamp: "2024-12-04T13:00:00Z" },
      { id: "act-13", userId: "u-4", userName: "You", action: "added", amount: 2000, description: "added ₹2,000", timestamp: "2024-12-03T12:30:00Z" },
    ],
  },
]

