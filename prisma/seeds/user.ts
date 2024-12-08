import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { createMock } from '../helper';

export const user = async () => {
  createMock(20, async (prisma: PrismaClient) => {
    await prisma.user.create({
      data: {
        email: Random.email(),
        password: Random.string(6),
        name: Random.cname(),
        github: Random.string(6),
        avatar: Random.image('300x300'),
        douyin: Random.url(),
        weibo: Random.url(),
        weixnId: Random.url(),
      },
    });
  });
};
