/// <reference types="@clerk/express/env" />

import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      clerkId: string;
      email: string;
      role: 'USER' | 'ADMIN';
      createdAt: Date;
    };
  }
}

export {};
