export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational = true;

  constructor(errorCode: string, statusCode: number, message?: string) {
    super(message || errorCode);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = 'AppError';

    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toJSON(): {
    message: string;
    errorCode: string;
    statusCode: number;
    stack?: string;
  } {
    const isDev = process.env.NODE_ENV === 'development';

    return {
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      ...(isDev && { stack: this.stack }),
    };
  }
}
