import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RbucGuard } from 'src/guard/rbac.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  create(@Body() createDebtorDto: CreateDebtorDto) {
    return this.debtorService.create(createDebtorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'address', required: false, type: String })
  @ApiQuery({ name: 'sellerId', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    enum: ['name', 'address', 'createdAt'],
    required: false,
  })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.debtorService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findOne(@Param('id') id: string) {
    return this.debtorService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.update(+id, updateDebtorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.debtorService.remove(+id);
  }
}
