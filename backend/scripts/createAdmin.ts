#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@finops.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`Seed user created/updated: ${admin.email}`);
    console.log('Note: the current Prisma schema has no role field, so this script creates a privileged seed user placeholder only.');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
