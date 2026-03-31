#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function backfillData(): Promise<void> {
  console.log('Starting data backfill...');

  const categories = ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Salary'];
  const users: Array<{ id: string; email: string }> = [];

  // Backfill users
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 12),
      },
    });

    users.push({ id: user.id, email: user.email });
  }

  console.log('Users backfilled.');

  // Backfill transactions
  for (let i = 0; i < 250; i++) {
    const user = users[i % users.length];
    const type = faker.helpers.arrayElement(['income', 'expense'] as const);

    await prisma.transaction.create({
      data: {
        amount: faker.number.int({ min: 10, max: 1000 }),
        type,
        category: faker.helpers.arrayElement(categories),
        note: faker.finance.transactionDescription(),
        userId: user.id,
        date: faker.date.past(),
      },
    });
  }

  console.log('Transactions backfilled.');

  // Backfill budgets
  for (const user of users) {
    for (const category of categories.filter((item) => item !== 'Salary')) {
      await prisma.budget.create({
        data: {
          userId: user.id,
          category,
          amount: faker.number.int({ min: 200, max: 3000 }),
          month: new Date().toISOString().slice(0, 7),
        },
      });
    }
  }

  console.log('Budgets backfilled.');
}

void backfillData()
  .catch((error) => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
