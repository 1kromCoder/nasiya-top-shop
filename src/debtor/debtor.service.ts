import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateDebtorDto) {
    try {
      const { sellerId } = data;

      const seller = await this.prisma.seller.findFirst({
        where: { id: sellerId },
      });

      if (!seller) {
        return { message: 'Seller not found' };
      }

      const post = await this.prisma.debtor.create({
        data,
      });
      return post;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findAll(query: {
    name?: string;
    address?: string;
    sellerId?: string;
    sortBy?: 'name' | 'address' | 'createdAt';
    order?: 'asc' | 'desc';
    page?: string;
    limit?: string;
  }) {
    try {
      const {
        name,
        address,
        sellerId,
        sortBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10',
      } = query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const where: Prisma.DebtorWhereInput = {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(address && { address: { contains: address, mode: 'insensitive' } }),
        ...(sellerId && { sellerId: Number(sellerId) }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.debtor.findMany({
          include: {
            Seller: true,
            Debts: { include: { Payments: true } },
            Phones: true
          },
          where,
          orderBy: { [sortBy]: order },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        this.prisma.debtor.count({ where }),
      ]);
      
      const enricher = items.map(item => {
        const totalDebt = item.Debts.reduce((acc, debt) => {
          const activePaymentsSum = debt.Payments.reduce((acc, pay) => acc + pay.amount, 0)
          return acc + activePaymentsSum
        }, 0 )
        return {...item, totalDebt}
      })
      return {
        data: enricher,
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
      const one = await this.prisma.debtor.findFirst({
        where: { id },
        include: {
          Seller: true,
        },
      });
      if (!one) {
        return { message: 'Debtor not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateDebtorDto) {
    try {
      const one = await this.prisma.debtor.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Debtor not found' };
      }
      const { sellerId } = data;

      const seller = await this.prisma.seller.findFirst({
        where: { id: sellerId },
      });

      if (!seller) {
        throw new NotFoundException(`Seller not found`);
      }
      const edit = await this.prisma.debtor.update({ where: { id }, data });
      return edit;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prisma.debtor.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Debtor not found' };
      }
      const del = await this.prisma.debtor.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
