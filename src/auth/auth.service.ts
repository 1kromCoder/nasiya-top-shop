import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { name, password } = data;

    if (!name || !password) {
      throw new UnauthorizedException('Name or password is missing');
    }

    const [seller, admin] = await Promise.all([
      this.prisma.seller.findFirst({ where: { name } }),
      this.prisma.admin.findFirst({ where: { name } }),
    ]);

    const isAdminValid = admin && bcrypt.compareSync(password, admin.password);
    const isSellerValid =
      seller && bcrypt.compareSync(password, seller.password);

    if (!isSellerValid && !isAdminValid) {
      throw new UnauthorizedException('Name yoki password noto‘g‘ri');
    }

    const user = isSellerValid ? seller : admin;
    const role = isSellerValid ? 'seller' : 'admin';
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    const token = this.jwt.sign({
      id: user.id,
      role,
    });

    return { token };
  }

  async getMe(user: any) {
    const { userId, role } = user;

    if (role === 'admin') {
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId },
      });
      return { role, ...admin };
    }

    if (role === 'seller') {
      const seller = await this.prisma.seller.findUnique({
        where: { id: userId },
        include: { Debtor: { include: { Debts: true } } },
      });
      const overdueDebts = await this.prisma.debts.findMany({
        where: {
          Payments: {
            some: {
              isActive: true,
              endDate: { lt: new Date() },
            },
          },
        },
      });
      return { role, ...seller, overdueDebts };
    }

    throw new UnauthorizedException('Noto‘g‘ri foydalanuvchi turi!');
  }
}
