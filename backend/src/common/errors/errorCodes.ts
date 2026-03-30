export const ErrorCodes = {
  // General
  VALIDATION_ERROR: 'VALIDATION_001' as const,
  NOT_FOUND: 'GENERAL_001' as const,
  INTERNAL_SERVER_ERROR: 'GENERAL_002' as const,
  UNAUTHORIZED: 'GENERAL_003' as const,
  FORBIDDEN: 'GENERAL_004' as const,

  // Auth
  INVALID_CREDENTIALS: 'AUTH_001' as const,
  DUPLICATE_EMAIL: 'AUTH_002' as const,
  INVALID_TOKEN: 'AUTH_003' as const,
  TOKEN_EXPIRED: 'AUTH_004' as const,
  ACCOUNT_INACTIVE: 'AUTH_005' as const,

  // User
  USER_NOT_FOUND: 'USER_001' as const,
  DUPLICATE_USER: 'USER_002' as const,

  // Transactions
  TRANSACTION_NOT_FOUND: 'TRANSACTION_001' as const,
  INVALID_TRANSACTION: 'TRANSACTION_002' as const,

  // Budgets
  BUDGET_NOT_FOUND: 'BUDGET_001' as const,
  BUDGET_LIMIT_EXCEEDED: 'BUDGET_002' as const,

  // Database
  DUPLICATE_ENTRY: 'DB_001' as const,
  DATABASE_CONNECTION_ERROR: 'DB_002' as const,

  // Uploads
  FILE_TOO_LARGE: 'UPLOAD_001' as const,
  INVALID_FILE_TYPE: 'UPLOAD_002' as const,
  UPLOAD_FAILED: 'UPLOAD_003' as const,
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

