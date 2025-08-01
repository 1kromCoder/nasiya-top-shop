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
    if (!data.name || !data.password) {
      throw new UnauthorizedException('Email or password is missing');
    }
    const seller = await this.prisma.seller.findFirst({
      where: { name },
    });
    const admin = await this.prisma.admin.findFirst({ where: { name } });

    const user = seller || admin;
    const role = seller ? 'seller' : admin ? 'admin' : null;

    if (!user) {
      throw new NotFoundException('Bunday foydalanuvchi topilmadi');
    }
    const match = bcrypt.compareSync(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Wrong password');
    }

    const token = this.jwt.sign({
      id: user.id,
      role,
    });

    return { token: token };
  }
}
