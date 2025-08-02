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
import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { RbucGuard } from 'src/guard/rbac.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  create(@Body() createPhoneDto: CreatePhoneDto) {
    return this.phoneService.create(createPhoneDto);
  }

  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'debtorId', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('phone') phone?: string,
    @Query('debtorId') debtorId?: number,
  ) {
    return this.phoneService.findAll({
      page,
      limit,
      sort,
      phone,
      debtorId: debtorId ? Number(debtorId) : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findOne(@Param('id') id: string) {
    return this.phoneService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updatePhoneDto: UpdatePhoneDto) {
    return this.phoneService.update(+id, updatePhoneDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  remove(@Param('id') id: string) {
    return this.phoneService.remove(+id);
  }
}
