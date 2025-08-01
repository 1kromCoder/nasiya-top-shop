import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateExampleDto) {
    try {
      const post = await this.prisma.example.create({
        data,
      });
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.example.findMany();
      return all;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.example.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Example not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdateExampleDto) {
    try {
      const example = await this.prisma.example.findFirst({ where: { id } });
      if (!example) {
        return { message: 'Example not found' };
      }

      const updatedDebt = await this.prisma.example.update({
        where: { id },
        data,
      });

      return updatedDebt;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error.message || error);
    }
  }

  async remove(id: number) {
    try {
      const example = await this.prisma.example.findFirst({ where: { id } });
      if (!example) {
        return { message: 'Example not found' };
      }
      const del = await this.prisma.example.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
