import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Prisma } from '@prisma/client';
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

  async findAll(query: {
    name?: string;
    email?: string;
    phone?: string;
    sortBy?: 'name' | 'email' | 'phone' | 'createdAt';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name,
        email,
        phone,
        sortBy = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: Prisma.AdminWhereInput = {
        ...(name
          ? { name: { contains: name, mode: Prisma.QueryMode.insensitive } }
          : {}),
        ...(email
          ? { email: { contains: email, mode: Prisma.QueryMode.insensitive } }
          : {}),
        ...(phone ? { phone: { contains: phone } } : {}),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.admin.findMany({
          where,
          orderBy: {
            [sortBy]: order,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.admin.count({ where }),
      ]);

      return {
        data: items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
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
      const one = await this.prisma.admin.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException('Admin not found');
      }
      if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
      }
      const edit = await this.prisma.admin.update({ where: { id }, data });

      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.admin.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException('Admin not found');
      }
      const del = await this.prisma.admin.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
