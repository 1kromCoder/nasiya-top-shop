import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    try {
      const all = await this.prisma.debtor.findMany();
      return all;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.debtor.findFirst({ where: { id } });
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
