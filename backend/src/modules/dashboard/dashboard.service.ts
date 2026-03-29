import prisma from "../../config/db";

import { getDashboardDataRepo } from "./dashboard.repository";
import { DashboardData } from "./dashboard.types";

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  return getDashboardDataRepo(userId);
};
