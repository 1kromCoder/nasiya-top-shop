import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
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

  async findAll(query: {
    name?: string;
    email?: string;
    phone?: string;
    balance?: string;
    sortBy?: 'name' | 'email' | 'balance' | 'createdAt';
    order?: 'asc' | 'desc';
    page?: string;
    limit?: string;
  }) {
    try {
      const {
        name,
        email,
        phone,
        balance,
        sortBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10',
      } = query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const where: Prisma.SellerWhereInput = {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
        ...(phone && { phone: { contains: phone } }),
        ...(balance && { balance: Number(balance) }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.seller.findMany({
          include: { Debtor: { include: { Debts: true } } },
          where,
          orderBy: { [sortBy]: order },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        this.prisma.seller.count({ where }),
      ]);

      return {
        data: items,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.seller.findFirst({
        where: { id },
        include: { Debtor: { include: { Debts: true } } },
      });
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
      if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
      }
      const edit = await this.prisma.seller.update({
        where: { id },
        data,
      });
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
