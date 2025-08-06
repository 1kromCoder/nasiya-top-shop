import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhoneService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePhoneDto) {
    try {
      const { debtorId, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        return { message: 'Debtor not found' };
      }
      const post = await this.prisma.phone.create({
        data: {
          ...rest,
          debtor: {
            connect: { id: debtorId },
          },
        },
      });
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    phone?: string;
    debtorId?: number;
  }) {
    try {
      const page =
        isNaN(Number(query.page)) || Number(query.page) <= 0
          ? 1
          : Number(query.page);
      const limit =
        isNaN(Number(query.limit)) || Number(query.limit) <= 0
          ? 10
          : Number(query.limit);
      const sort = query.sort ?? 'desc';

      const where: any = {};
      if (query.phone) {
        where.phone = {
          contains: query.phone,
        };
      }
      if (query.debtorId) {
        where.debtorId = query.debtorId;
      }

      const [items, total] = await this.prisma.$transaction([
        this.prisma.phone.findMany({
          include: { debtor: true },
          where,
          orderBy: {
            id: sort,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.phone.count({ where }),
      ]);

      return {
        data: items,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.phone.findFirst({
        where: { id },
        include: { debtor: true },
      });
      if (!one) {
        return { message: 'Phone not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdatePhoneDto) {
    try {
      const debs = await this.prisma.phone.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Phone not found' };
      }
      const { debtorId, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        throw new NotFoundException(`Debtor not found`);
      }
      const updatedDebt = await this.prisma.phone.update({
        where: { id },
        data: {
          ...rest,
          debtor: {
            connect: { id: debtorId },
          },
        },
      });

      return updatedDebt;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error.message || error);
    }
  }

  async remove(id: number) {
    try {
      const debs = await this.prisma.phone.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Phone not found' };
      }
      const del = await this.prisma.phone.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
