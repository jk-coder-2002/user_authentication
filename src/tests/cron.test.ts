import prisma from '../prisma/client';
import { activateInactiveUsers } from '../cron/activation.cron';

describe('Cron activation', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should activate inactive users older than 15 minutes', async () => {
    const createdAt = new Date(Date.now() - 1000 * 60 * 20);
    const user = await prisma.user.create({
      data: {
        fullname: 'Cron User',
        email: 'cron@example.com',
        password: 'hashed-password',
        gender: 'male',
        mobile: '0987654321',
        status: 'inactive',
        createdAt,
        updatedAt: createdAt
      }
    });

    const count = await activateInactiveUsers();
    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

    expect(count).toBe(1);
    expect(updatedUser?.status).toBe('active');
  });
});
