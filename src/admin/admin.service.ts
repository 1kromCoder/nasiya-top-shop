import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dto/update-admin.dto';
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAdminDto) {
    try {
      const existing = await this.prisma.admin.findFirst({
        where: { phone: data.phone, email: data.email },
      });
      if (existing) {
        return { message: 'Bunday admin mavjud' };
      }
      const hash = bcrypt.hashSync(data.password, 10);
      let post = await this.prisma.admin.create({
        data: {
          ...data,
          password: hash,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.admin.findMany();
      return all;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOne(id: number) {
    try {
      let one = await this.prisma.admin.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Admin not found' };
      }
      return one;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: number, data: UpdateAdminDto) {
    try {
      let edit = await this.prisma.admin.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: number) {
    try {
      let del = await this.prisma.admin.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
