import type { ExpenseGroup, SettlementSummary } from "./types"

const currentUserId = "u-you"

export const demoExpenseGroups: ExpenseGroup[] = [
  {
    id: "eg-1",
    name: "Trip to Goa",
    description: "Weekend getaway with friends",
    color: "#3b82f6",
    createdAt: "2024-11-01T08:00:00Z",
    members: [
      { id: currentUserId, name: "You", email: "you@example.com" },
      { id: "u-rahul", name: "Rahul", email: "rahul@example.com" },
      { id: "u-priya", name: "Priya", email: "priya@example.com" },
      { id: "u-ankit", name: "Ankit", email: "ankit@example.com" },
    ],
    expenses: [
      {
        id: "ex-1",
        description: "Hotel booking — 2 nights",
        amount: 12000,
        currency: "INR",
        paidBy: "u-rahul",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 3000 },
          { userId: "u-rahul", amount: 3000 },
          { userId: "u-priya", amount: 3000 },
          { userId: "u-ankit", amount: 3000 },
        ],
        tags: ["#trip", "#accommodation"],
        date: "2024-11-15",
        createdAt: "2024-11-15T10:00:00Z",
      },
      {
        id: "ex-2",
        description: "Dinner at beach shack",
        amount: 6000,
        currency: "INR",
        paidBy: currentUserId,
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 1500 },
          { userId: "u-rahul", amount: 1500 },
          { userId: "u-priya", amount: 1500 },
          { userId: "u-ankit", amount: 1500 },
        ],
        tags: ["#trip", "#food"],
        date: "2024-11-15",
        createdAt: "2024-11-15T21:00:00Z",
      },
      {
        id: "ex-3",
        description: "Scooter rental",
        amount: 3000,
        currency: "INR",
        paidBy: "u-ankit",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 750 },
          { userId: "u-rahul", amount: 750 },
          { userId: "u-priya", amount: 750 },
          { userId: "u-ankit", amount: 750 },
        ],
        tags: ["#trip", "#transport"],
        date: "2024-11-16",
        createdAt: "2024-11-16T09:00:00Z",
      },
      {
        id: "ex-4",
        description: "Water sports & activities",
        amount: 9000,
        currency: "INR",
        paidBy: "u-priya",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 2250 },
          { userId: "u-rahul", amount: 2250 },
          { userId: "u-priya", amount: 2250 },
          { userId: "u-ankit", amount: 2250 },
        ],
        tags: ["#trip", "#activities"],
        date: "2024-11-16",
        createdAt: "2024-11-16T14:00:00Z",
      },
    ],
  },
  {
    id: "eg-2",
    name: "Flat Expenses",
    description: "Monthly household bills",
    color: "#10b981",
    createdAt: "2024-08-01T06:00:00Z",
    members: [
      { id: currentUserId, name: "You", email: "you@example.com" },
      { id: "u-rm1", name: "Roommate A", email: "rm1@example.com" },
      { id: "u-rm2", name: "Roommate B", email: "rm2@example.com" },
    ],
    expenses: [
      {
        id: "ex-5",
        description: "Rent — December",
        amount: 15000,
        currency: "INR",
        paidBy: currentUserId,
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 5000 },
          { userId: "u-rm1", amount: 5000 },
          { userId: "u-rm2", amount: 5000 },
        ],
        tags: ["#rent", "#monthly"],
        date: "2024-12-01",
        createdAt: "2024-12-01T08:00:00Z",
      },
      {
        id: "ex-6",
        description: "Groceries — BigBasket",
        amount: 4500,
        currency: "INR",
        paidBy: "u-rm1",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 1500 },
          { userId: "u-rm1", amount: 1500 },
          { userId: "u-rm2", amount: 1500 },
        ],
        tags: ["#groceries"],
        date: "2024-12-03",
        createdAt: "2024-12-03T18:00:00Z",
      },
      {
        id: "ex-7",
        description: "Electricity bill",
        amount: 3000,
        currency: "INR",
        paidBy: "u-rm2",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 1000 },
          { userId: "u-rm1", amount: 1000 },
          { userId: "u-rm2", amount: 1000 },
        ],
        tags: ["#utilities", "#monthly"],
        date: "2024-12-05",
        createdAt: "2024-12-05T10:00:00Z",
      },
      {
        id: "ex-8",
        description: "Internet — JioFiber",
        amount: 1500,
        currency: "INR",
        paidBy: currentUserId,
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 500 },
          { userId: "u-rm1", amount: 500 },
          { userId: "u-rm2", amount: 500 },
        ],
        tags: ["#utilities", "#internet"],
        date: "2024-12-01",
        createdAt: "2024-12-01T09:00:00Z",
      },
    ],
  },
  {
    id: "eg-3",
    name: "Office Team",
    description: "Team outings & supplies",
    color: "#f59e0b",
    createdAt: "2024-10-10T12:00:00Z",
    members: [
      { id: currentUserId, name: "You", email: "you@example.com" },
      { id: "u-ca", name: "Colleague A", email: "ca@example.com" },
      { id: "u-cb", name: "Colleague B", email: "cb@example.com" },
      { id: "u-cc", name: "Colleague C", email: "cc@example.com" },
      { id: "u-mgr", name: "Manager", email: "mgr@example.com" },
    ],
    expenses: [
      {
        id: "ex-9",
        description: "Team lunch — Friday",
        amount: 10000,
        currency: "INR",
        paidBy: "u-mgr",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 2000 },
          { userId: "u-ca", amount: 2000 },
          { userId: "u-cb", amount: 2000 },
          { userId: "u-cc", amount: 2000 },
          { userId: "u-mgr", amount: 2000 },
        ],
        tags: ["#food", "#team"],
        date: "2024-12-06",
        createdAt: "2024-12-06T13:00:00Z",
      },
      {
        id: "ex-10",
        description: "Birthday cake",
        amount: 2000,
        currency: "INR",
        paidBy: "u-ca",
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 400 },
          { userId: "u-ca", amount: 400 },
          { userId: "u-cb", amount: 400 },
          { userId: "u-cc", amount: 400 },
          { userId: "u-mgr", amount: 400 },
        ],
        tags: ["#celebration"],
        date: "2024-12-04",
        createdAt: "2024-12-04T15:00:00Z",
      },
      {
        id: "ex-11",
        description: "Stationery supplies",
        amount: 1000,
        currency: "INR",
        paidBy: currentUserId,
        splitType: "equal",
        splits: [
          { userId: currentUserId, amount: 200 },
          { userId: "u-ca", amount: 200 },
          { userId: "u-cb", amount: 200 },
          { userId: "u-cc", amount: 200 },
          { userId: "u-mgr", amount: 200 },
        ],
        tags: ["#office", "#supplies"],
        date: "2024-12-02",
        createdAt: "2024-12-02T11:00:00Z",
      },
    ],
  },
]

export function getSettlementForGroup(
  group: ExpenseGroup,
  currentUserId: string
): { summaries: SettlementSummary[]; youOwe: number; youAreOwed: number } {
  const summaries: SettlementSummary[] = group.members.map((m) => ({
    userId: m.id,
    name: m.name,
    paid: 0,
    owed: 0,
    balance: 0,
  }))

  for (const expense of group.expenses) {
    const payer = summaries.find((s) => s.userId === expense.paidBy)
    if (payer) payer.paid += expense.amount

    for (const split of expense.splits) {
      const debtor = summaries.find((s) => s.userId === split.userId)
      if (debtor) debtor.owed += split.amount
    }
  }

  for (const s of summaries) {
    s.balance = s.paid - s.owed
  }

  const you = summaries.find((s) => s.userId === currentUserId)
  const youOwe = you ? Math.max(0, -you.balance) : 0
  const youAreOwed = you ? Math.max(0, you.balance) : 0

  return { summaries, youOwe, youAreOwed }
}

