import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';

const prisma = new PrismaClient();

export const article = async () => {
  for (let i = 0; i < 100; i++) {
    await prisma.article.create({
      data: {
        title: Random.ctitle(5, 50),
        content: Random.cparagraph(1, 300),
        thumb: Random.image('400x400'),
      },
    });
  }
};
