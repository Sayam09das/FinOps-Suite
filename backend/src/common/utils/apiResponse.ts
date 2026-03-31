import { Response } from 'express';

interface ApiResponseData {
  success: boolean;
  data?: any;
  message?: string;
  meta?: any;
}

export class ApiResponse {
  static success(
    data: any, 
    res: Response, 
    status = 200, 
    message = 'Success',
    meta?: any
  ) {
    const response: ApiResponseData = {
      success: true,
      data,
      message,
    };
    if (meta) response.meta = meta;
    return res.status(status).json(response);
  }

  static error(
    message: string,
    res: Response,
    status = 400
  ) {
    const response: ApiResponseData = {
      success: false,
      message,
    };
    return res.status(status).json(response);
  }
}

