import type { ExpenseGroup, SettlementSummary } from "./types"

export function getSettlementForGroup(
  group: ExpenseGroup,
  currentUserId: string,
): { summaries: SettlementSummary[]; youOwe: number; youAreOwed: number } {
  const summaries: SettlementSummary[] = group.members.map((member) => ({
    userId: member.id,
    name: member.name,
    paid: 0,
    owed: 0,
    balance: 0,
  }))

  for (const expense of group.expenses) {
    const payer = summaries.find((summary) => summary.userId === expense.paidBy)
    if (payer) {
      payer.paid += expense.amount
    }

    for (const split of expense.splits) {
      const debtor = summaries.find((summary) => summary.userId === split.userId)
      if (debtor) {
        debtor.owed += split.amount
      }
    }
  }

  for (const summary of summaries) {
    summary.balance = summary.paid - summary.owed
  }

  const currentUser = summaries.find((summary) => summary.userId === currentUserId)
  const youOwe = currentUser ? Math.max(0, -currentUser.balance) : 0
  const youAreOwed = currentUser ? Math.max(0, currentUser.balance) : 0

  return { summaries, youOwe, youAreOwed }
}
