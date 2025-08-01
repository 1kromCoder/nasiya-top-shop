import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePaymentDto) {
    try {
      const { endDate, debtsId, amount, month, ...rest } = data;

      const debt = await this.prisma.debts.findUnique({
        where: { id: debtsId },
      });

      if (!debt) throw new NotFoundException('Debt not found');

      const monthlyAmount = Math.floor(debt.amount / debt.period);

      const paidPayments = await this.prisma.payments.findMany({
        where: { debtsId },
      });

      const totalPaid = paidPayments.reduce((acc, p) => acc + p.amount, 0);
      const paidMonths = paidPayments.reduce(
        (acc, p) => acc + (p.month || 0),
        0,
      );

      const remainingAmount = debt.amount - totalPaid;
      const remainingMonths = debt.period - paidMonths;

      if (remainingAmount <= 0 || remainingMonths <= 0) {
        throw new BadRequestException('Qarz allaqachon to‘liq to‘langan');
      }

      if (amount > remainingAmount) {
        throw new BadRequestException(
          `Your amount exceeds remaining debt. Max allowed: ${remainingAmount}`,
        );
      }

      let paymentMonths: number;

      if (month !== undefined) {
        const expected = month * monthlyAmount;

        if (amount !== expected) {
          throw new BadRequestException(
            `To pay for ${month} month(s), amount must be exactly ${expected}`,
          );
        }

        if (month > remainingMonths) {
          throw new BadRequestException(
            `You can only pay for ${remainingMonths} more month(s)`,
          );
        }

        paymentMonths = month;
      } else {
        const newTotalPaid = totalPaid + amount;
        const newTotalMonths = Math.floor(newTotalPaid / monthlyAmount);
        paymentMonths = newTotalMonths - paidMonths;

        if (paymentMonths > remainingMonths) {
          throw new BadRequestException(
            `You can only pay for ${remainingMonths} more month(s)`,
          );
        }

        if (paymentMonths < 0) paymentMonths = 0;
      }

      const newPayment = await this.prisma.payments.create({
        data: {
          ...rest,
          amount,
          month: paymentMonths,
          endDate: new Date(endDate),
          isActive: true,
          debts: {
            connect: { id: debtsId },
          },
        },
      });

      return {
        message:
          paymentMonths > 0
            ? `${paymentMonths} oy uchun to'lov qabul qilindi`
            : `To'lov qabul qilindi, lekin hali 1 oylik yopilmadi (yig'ilmoqda)`,
        payment: newPayment,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || error);
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.payments.findMany();
      return all;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.payments.findFirst({ where: { id } });
      if (!one) {
        return { message: 'Payment not found' };
      }
      return one;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, data: UpdatePaymentDto) {
    try {
      const pay = await this.prisma.payments.findFirst({ where: { id } });
      if (!pay) {
        return { message: 'Payment not found' };
      }
      const { debtsId, endDate, ...rest } = data;
      const debts = await this.prisma.debts.findFirst({
        where: { id: debtsId },
      });

      if (!debts) {
        throw new NotFoundException(`Debt not found`);
      }

      const updatedDebt = await this.prisma.payments.update({
        where: { id },
        data: {
          ...rest,
          endDate: endDate ? new Date(endDate) : undefined,
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
      const debs = await this.prisma.payments.findFirst({ where: { id } });
      if (!debs) {
        return { message: 'Payment not found' };
      }
      const del = await this.prisma.payments.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new Error(error);
    }
  }
}
