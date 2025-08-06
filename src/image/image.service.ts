import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateImageDto) {
    try {
      const { debtorId, debtsId, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        return { message: 'Debtor not found' };
      }
      const debts = await this.prisma.debts.findFirst({
        where: { id: debtsId },
      });

      if (!debts) {
        return { message: 'Debt not found' };
      }
      const post = await this.prisma.image.create({
        data: {
          ...rest,
          debtor: {
            connect: { id: debtorId },
          },
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
      const debtsId = query.debtsId;
      const debtorId = query.debtorId;

      const where: any = {};
      if (debtsId) where.debtsId = debtsId;
      if (debtorId) where.debtorId = debtorId;

      const [items, total] = await this.prisma.$transaction([
        this.prisma.image.findMany({
          include: {
            debts: true,
            debtor: true,
          },
          where,
          orderBy: {
            id: sort,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.image.count({ where }),
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
      const one = await this.prisma.image.findFirst({
        where: { id },
        include: {
          debts: true,
          debtor: true,
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

  async update(id: number, data: UpdateImageDto) {
    try {
      const debs = await this.prisma.image.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Image not found' };
      }
      const { debtorId, debtsId, ...rest } = data;

      const debtor = await this.prisma.debtor.findFirst({
        where: { id: debtorId },
      });

      if (!debtor) {
        throw new NotFoundException(`Debtor not found`);
      }
      const debts = await this.prisma.debts.findFirst({
        where: { id: debtsId },
      });

      if (!debts) {
        return { message: 'Debt not found' };
      }
      const updatedDebt = await this.prisma.image.update({
        where: { id },
        data: {
          ...rest,
          debtor: {
            connect: { id: debtorId },
          },
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
      const debs = await this.prisma.image.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Image not found' };
      }
      const del = await this.prisma.image.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
