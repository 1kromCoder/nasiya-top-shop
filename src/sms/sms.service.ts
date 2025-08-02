import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSmDto) {
    try {
      const { exampleId, debtorId, date, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        return { message: 'Debtor not found' };
      }
      const example = await this.prisma.example.findFirst({
        where: { id: exampleId },
      });

      if (!example) {
        return { message: 'Example not found' };
      }

      const post = await this.prisma.sms.create({
        data: {
          ...rest,
          date: new Date(date),
          debtor: {
            connect: { id: debtorId },
          },
          example: {
            connect: { id: exampleId },
          },
        },
      });
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(query: any) {
    try {
      const {
        exampleId,
        debtorId,
        page = 1,
        limit = 10,
        sort = 'desc',
      } = query;

      const where: Prisma.SmsWhereInput = {
        ...(exampleId && !isNaN(Number(exampleId))
          ? { exampleId: Number(exampleId) }
          : {}),
        ...(debtorId && !isNaN(Number(debtorId))
          ? { debtorId: Number(debtorId) }
          : {}),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.sms.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { date: sort === 'asc' ? 'asc' : 'desc' },
        }),
        this.prisma.sms.count({ where }),
      ]);

      return {
        data: items,
        total,
        page: Number(page),
        limit: Number(limit),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.sms.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Sms not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateSmDto) {
    try {
      const sms = await this.prisma.sms.findFirst({ where: { id } });
      if (!sms) {
        return { message: 'Sms not found' };
      }
      const { debtorId, exampleId, date, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        throw new NotFoundException(`Debtor not found`);
      }
      const example = await this.prisma.example.findFirst({
        where: { id: exampleId },
      });

      if (!example) {
        throw new NotFoundException(`Example not found`);
      }

      const updatedDebt = await this.prisma.sms.update({
        where: { id },
        data: {
          ...rest,
          date: date ? new Date(date) : undefined,
          debtor: {
            connect: { id: debtorId },
          },
          example: {
            connect: { id: exampleId },
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
      const sms = await this.prisma.sms.findFirst({ where: { id } });
      if (!sms) {
        return { message: 'Sms not found' };
      }
      const del = await this.prisma.sms.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
