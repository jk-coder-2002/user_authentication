import { AppError } from '../utils/app-error';
import { signJwt } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';
import { userRepository } from '../repositories/user.repository';
import { UserStatus } from '../utils/enum';

type SignupPayload = {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    mobile: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

const sanitizeUser = ({ password, ...user }: { password: string } & Record<string, unknown>) => user;

const signup = async (payload: SignupPayload) => {
    console.log('Signup payload:', payload);
    const existing = await userRepository.findByEmail(payload.email);
    console.log('Existing user:', existing);
    if (existing) {
        throw new AppError('Email already registered', 409, ['duplicate email']);
    }

    const hashedPassword = await hashPassword(payload.password);

    console.log('Hashed password:', hashedPassword);
    const user = await userRepository.createUser({
        fullname: payload.fullname,
        email: payload.email,
        password: hashedPassword,
        gender: payload.gender,
        mobile: payload.mobile,
        status: UserStatus.INACTIVE
    });

    const token = await signJwt({ userId: user.id });
    return { accesssToken: token, user: sanitizeUser(user) };
};

const login = async (payload: LoginPayload) => {
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
        throw new AppError('Invalid credentials', 401, ['invalid email or password']);
    }

    const validPassword = await comparePassword(payload.password, user.password);
    if (!validPassword) {
        throw new AppError('Invalid credentials', 401, ['invalid email or password']);
    }

    const token = await signJwt({ userId: user.id });
    return { accesssToken: token, user: sanitizeUser(user) };
};

export const authService = {
    signup,
    login
};
