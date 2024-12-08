import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';

const prisma = new PrismaClient();

export const category = async () => {
  for (let i = 0; i < 100; i++) {
    await prisma.category.create({
      data: {
        title: Random.ctitle(6, 30),
      },
    });
  }
};
