import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateDebtDto) {
    try {
      const { debtorId, date, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        return { message: 'Debtor not found' };
      }
      const post = await this.prisma.debts.create({
        data: {
          ...rest,
          date: new Date(date),
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
  async getDebtorDebtStatus(debtorId: number) {
    try {
      const debts = await this.prisma.debts.findMany({
        where: { debtorId },
        include: {
          Payments: true,
        },
      });

      if (!debts.length) {
        throw new NotFoundException('No debts found for this debtor');
      }

      const result = debts.map((debt) => {
        const totalPaid = debt.Payments.reduce((sum, p) => sum + p.amount, 0);
        const tolangan_oyi = debt.Payments.reduce(
          (sum, p) => sum + (p.month || 0),
          0,
        );

        const qolgan_nasiya = debt.amount - totalPaid;
        const qolgan_oyi = debt.period - tolangan_oyi;

        return {
          debtId: debt.id,
          nasiya: debt.amount,
          tolangan: totalPaid,
          qolgan_nasiya,
          muddati: debt.period,
          tolangan_oyi,
          qolgan_oyi,
        };
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || error);
    }
  }

  async findAll(query: {
    period?: string;
    amount?: string;
    sortBy?: 'period' | 'amount' | 'date' | 'createdAt';
    order?: 'asc' | 'desc';
    page?: string;
    limit?: string;
  }) {
    try {
      const {
        period,
        amount,
        sortBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10',
      } = query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const where: Prisma.DebtsWhereInput = {
        ...(period ? { period: Number(period) } : {}),
        ...(amount ? { amount: Number(amount) } : {}),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.debts.findMany({
          where,
          orderBy: {
            [sortBy]: order,
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        this.prisma.debts.count({ where }),
      ]);

      return {
        data: items,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.debts.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Debt not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateDebtDto) {
    try {
      const debs = await this.prisma.debts.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Debts not found' };
      }
      const { debtorId, date, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        throw new NotFoundException(`Debtor not found`);
      }
      const updatedDebt = await this.prisma.debts.update({
        where: { id },
        data: {
          ...rest,
          date: date ? new Date(date) : undefined,
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
      const debs = await this.prisma.debts.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Debts not found' };
      }
      const del = await this.prisma.debts.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
