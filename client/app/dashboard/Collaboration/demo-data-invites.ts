import type { Invite, TeamMember } from "./types"

export const demoInvites: Invite[] = [
  {
    id: "inv-1",
    email: "vikram@example.com",
    role: "Editor",
    status: "pending",
    sentAt: "2024-12-05T10:00:00Z",
    expiresAt: "2024-12-12T10:00:00Z",
  },
  {
    id: "inv-2",
    email: "sneha@example.com",
    role: "Viewer",
    status: "pending",
    sentAt: "2024-12-04T14:30:00Z",
    expiresAt: "2024-12-11T14:30:00Z",
  },
  {
    id: "inv-3",
    email: "arjun@example.com",
    role: "Editor",
    status: "accepted",
    sentAt: "2024-11-28T09:00:00Z",
    expiresAt: "2024-12-05T09:00:00Z",
  },
  {
    id: "inv-4",
    email: "deepa@example.com",
    role: "Viewer",
    status: "expired",
    sentAt: "2024-11-15T11:00:00Z",
    expiresAt: "2024-11-22T11:00:00Z",
  },
]

export const demoTeamMembers: TeamMember[] = [
  {
    id: "u-1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Owner",
    joinedAt: "2024-09-15T10:00:00Z",
    status: "active",
  },
  {
    id: "u-2",
    name: "Ankit Verma",
    email: "ankit@example.com",
    role: "Editor",
    joinedAt: "2024-09-16T08:30:00Z",
    status: "active",
  },
  {
    id: "u-3",
    name: "Priya Patel",
    email: "priya@example.com",
    role: "Viewer",
    joinedAt: "2024-09-20T14:00:00Z",
    status: "active",
  },
  {
    id: "u-4",
    name: "You",
    email: "you@example.com",
    role: "Editor",
    joinedAt: "2024-09-17T09:00:00Z",
    status: "active",
  },
  {
    id: "u-5",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    role: "Editor",
    joinedAt: "2024-11-28T09:00:00Z",
    status: "active",
  },
  {
    id: "u-6",
    name: "Kavita Rao",
    email: "kavita@example.com",
    role: "Viewer",
    joinedAt: "2024-10-10T12:00:00Z",
    status: "inactive",
  },
]

