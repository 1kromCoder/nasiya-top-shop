import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageDebtsDto } from './dto/create-images-debt.dto';
import { UpdateImagesDebtDto } from './dto/update-images-debt.dto';

@Injectable()
export class ImagesDebtsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateImageDebtsDto) {
    try {
      const { debtsId, ...rest } = data;

      const debtor = await this.prisma.debts.findFirst({
        where: { id: debtsId },
      });

      if (!debtor) {
        return { message: 'Debt not found' };
      }
      const post = await this.prisma.imageDebts.create({
        data: {
          ...rest,
          debts: {
            connect: { id: debtsId },
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
    debtsId?: number;
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
      const debt = query.debtsId;
      const where: any = {};
      if (debt) where.debt = debt;

      const [items, total] = await this.prisma.$transaction([
        this.prisma.imageDebts.findMany({
          include: {
            debts: true,
          },
          where,
          orderBy: {
            id: sort,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.imageDebts.count({ where }),
      ]);

      return {
        total,
        page,
        limit,
        data: items,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.imageDebts.findFirst({
        where: { id },
        include: {
          debts: true,
        },
      });
      if (!one) {
        return { message: 'Image not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateImagesDebtDto) {
    try {
      const debs = await this.prisma.imageDebts.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Image not found' };
      }
      const { debtsId, ...rest } = data;

      const debtor = await this.prisma.debts.findFirst({
        where: { id: debtsId },
      });

      if (!debtor) {
        throw new NotFoundException(`Debt not found`);
      }
      const updatedDebt = await this.prisma.imageDebts.update({
        where: { id },
        data: {
          ...rest,
          debts: {
            connect: { id: debtsId },
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
      const debs = await this.prisma.imageDebts.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Image not found' };
      }
      const del = await this.prisma.imageDebts.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
