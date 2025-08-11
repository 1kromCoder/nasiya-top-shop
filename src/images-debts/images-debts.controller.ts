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
import { ImagesDebtsService } from './images-debts.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RbucGuard } from 'src/guard/rbac.guard';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { CreateImageDebtsDto } from './dto/create-images-debt.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateImagesDebtDto } from './dto/update-images-debt.dto';

@Controller('images-debts')
export class ImagesDebtsController {
  constructor(private readonly imageService: ImagesDebtsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  create(@Body() createImageDto: CreateImageDebtsDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'debtsId', required: false, type: Number })
  @ApiQuery({ name: 'debtorId', required: false, type: Number })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('debtsId') debtsId?: number,
    @Query('debtorId') debtorId?: number,
  ) {
    return this.imageService.findAll({
      page: Number(page),
      limit: Number(limit),
      sort,
      debtsId: debtsId ? Number(debtsId) : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImagesDebtDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
