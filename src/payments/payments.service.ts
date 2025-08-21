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
      const { endDate, debtsId, amount, month, months, ...rest } = data;

      const debt = await this.prisma.debts.findUnique({
        where: { id: debtsId },
      });
      console.log(debt);
      if (!debt) throw new NotFoundException('Debt not found');
      if (amount) {
        if (debt.amount < amount) {
          throw new BadRequestException(
            `Kiritilgan summa qarzdan oshib ketdi. Maksimal: ${debt.amount}`,
          );
        }
      }
      const monthlyAmount = Math.floor(debt.amount / debt.period);

      const paidPayments = await this.prisma.payments.findMany({
        where: { debtsId },
      });

      const remainingAmount = debt.amount;
      const remainingMonths = debt.period;

      if (remainingAmount <= 0) {
        throw new BadRequestException('Qarz allaqachon to‘liq to‘langan');
      }

      let paymentAmount = 0;
      let paymentMonths = 0;

      if (month === 1 && !amount && !months) {
        if (remainingMonths < 1) {
          throw new BadRequestException('1 oylik to‘lash imkoniyati yo‘q');
        }
        paymentAmount = monthlyAmount;
        paymentMonths = 1;
      } else if (amount && !months && !month) {
        if (amount > remainingAmount) {
          throw new BadRequestException(
            `Kiritilgan summa qarzdan oshib ketdi. Maksimal: ${remainingAmount}`,
          );
        }
        paymentAmount = amount;
        paymentMonths = Math.floor(amount / monthlyAmount);
      }

      else if (Array.isArray(months) && months.length > 0) {
        const totalForMonths = months.length * monthlyAmount;
        if (totalForMonths > remainingAmount) {
          throw new BadRequestException(
            `Belgilangan oylarga summa qarzdan oshib ketdi. Maksimal: ${remainingAmount}`,
          );
        }
        paymentAmount = totalForMonths;
        paymentMonths = months.length;
      } else {
        throw new BadRequestException(
          'To‘lov usuli noto‘g‘ri. 1-usul: month=1, 2-usul: amount, 3-usul: months[]',
        );
      }

      const newPayment = await this.prisma.payments.create({
        data: {
          ...rest,
          amount: paymentAmount,
          month: paymentMonths,
          endDate: endDate ? new Date(endDate) : undefined,
          isActive: true,
          debts: {
            connect: { id: debtsId },
          },
        },
      });

      await this.prisma.debts.update({
        where: { id: debtsId },
        data: {
          period: {
            decrement: paymentMonths,
          },
          amount: {
            decrement: paymentAmount,
          },
        },
      });

      return {
        message: `${paymentMonths} oy uchun to‘lov qabul qilindi`,
        payment: newPayment,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || error);
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.payments.findMany({
        include: {
          debts: {
            include: { debtor: { include: { Phones: true } } },
          },
        },
      });
      return all;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.payments.findFirst({
        where: { id },
        include: {
          debts: {
            include: { debtor: { include: { Phones: true } } },
          },
        },
      });
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
