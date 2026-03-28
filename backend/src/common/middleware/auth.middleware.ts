import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../config/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // 🔥 Fetch real user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
