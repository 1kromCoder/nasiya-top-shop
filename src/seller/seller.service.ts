import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSellerDto) {
    try {
      const existing = await this.prisma.seller.findFirst({
        where: { phone: data.phone, email: data.email },
      });
      if (existing) {
        return { message: 'Bunday seller mavjud' };
      }
      const hash = bcrypt.hashSync(data.password, 10);
      let post = await this.prisma.seller.create({
        data: {
          ...data,
          password: hash,
        },
      });
      return post;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.seller.findMany();
      return all;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.seller.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Seller not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateSellerDto) {
    try {
      const one = await this.prisma.seller.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Seller not found' };
      }
      const edit = await this.prisma.seller.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.seller.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Seller not found' };
      }
      const del = await this.prisma.seller.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
