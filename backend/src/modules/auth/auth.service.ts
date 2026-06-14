import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const now = new Date().toISOString();

    const user = {
      ...dto,
      password: hashedPassword,
      soberStats: {
        daysSober: 0,
        startDate: now,
      },
      moodLog: [] as any[],
      meetings: [] as any[],
      journalEntries: [] as any[],
      createdAt: now,
      updatedAt: now,
    };

    await this.usersRepo.create(user as any);

    return {
      message: 'User registered successfully',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      accessToken: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
