import {
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import type { UserRole } from "@smart-campaign/types";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async validateUserById(userId: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    };
  }
}
