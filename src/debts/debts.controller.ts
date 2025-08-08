import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RbucGuard } from 'src/guard/rbac.guard';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { ApiQuery } from '@nestjs/swagger';
import { DebtDateDto } from './dto/debts.date.dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  @Get('debtor/:id/status')
  getDebtorDebtStatus(@Param('id', ParseIntPipe) id: number) {
    return this.debtsService.getDebtorDebtStatus(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  @ApiQuery({ name: 'period', required: false, type: Number })
  @ApiQuery({ name: 'amount', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    enum: ['period', 'amount', 'date', 'createdAt'],
    required: false,
  })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.debtsService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
  @Get('date')
  @ApiQuery({ name: 'date', required: false, type: Date })
  debtDate(@Query() data: DebtDateDto, @Req() req: Request) {
    const sellerId = req['user'].id;
    return this.debtsService.debtDate(data, sellerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtsService.update(+id, updateDebtDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.debtsService.remove(+id);
  }
}
