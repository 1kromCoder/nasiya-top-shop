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

  async findAll() {
    try {
      const all = await this.prisma.phone.findMany();
      return all;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.phone.findFirst({ where: { id } });
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
