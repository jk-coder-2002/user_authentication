import request from 'supertest';
import app from '../app';
import prisma from '../prisma/client';

describe('Auth routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should signup successfully', async () => {
    const payload = {
      fullname: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      gender: 'female',
      mobile: '1234567890'
    };

    const response = await request(app).post('/api/auth/signup').send(payload);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accesssToken');
    expect(response.body.data.user).toMatchObject({ fullname: 'Jane Doe', email: 'jane@example.com' });
    expect(response.body.data.user).not.toHaveProperty('password');
  });

  it('should fail validation for signup', async () => {
    const response = await request(app).post('/api/auth/signup').send({ email: 'bad', password: '123', confirmPassword: '123' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('should reject duplicate email signup', async () => {
    const payload = {
      fullname: 'John Doe',
      email: 'duplicate@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      gender: 'male',
      mobile: '1234567890'
    };

    await request(app).post('/api/auth/signup').send(payload);
    const response = await request(app).post('/api/auth/signup').send(payload);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain('duplicate email');
  });

  it('should login successfully', async () => {
    const email = 'login@example.com';
    const payload = {
      fullname: 'Login User',
      email,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      gender: 'non-binary',
      mobile: '1234567890'
    };

    await request(app).post('/api/auth/signup').send(payload);
    const response = await request(app).post('/api/auth/login').send({ email, password: payload.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accesssToken');
    expect(response.body.data.user.email).toBe(email);
  });

  it('should return invalid credentials for login', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'missing@example.com', password: 'wrong' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain('invalid email or password');
  });
});
