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

  // async login(data: LoginDto) {
  //   const { name, password } = data;
  //   if (!data.name || !data.password) {
  //     throw new UnauthorizedException('Email or password is missing');
  //   }
  //   const seller = await this.prisma.seller.findFirst({
  //     where: { name },
  //   });
  //   const admin = await this.prisma.admin.findFirst({ where: { name } });

  //   const user = seller || admin;
  //   const role = seller ? 'seller' : admin ? 'admin' : null;

  //   if (!user) {
  //     throw new NotFoundException('Bunday foydalanuvchi topilmadi');
  //   }
  //   const match = bcrypt.compareSync(password, user.password);

  //   if (!match) {
  //     throw new UnauthorizedException('Wrong password');
  //   }

  //   const token = this.jwt.sign({
  //     id: user.id,
  //     role,
  //   });

  //   return { token: token };
  // }
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
      });
      return { role, ...seller };
    }

    throw new UnauthorizedException('Noto‘g‘ri foydalanuvchi turi');
  }
}
