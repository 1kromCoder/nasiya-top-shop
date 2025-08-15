import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RbucGuard } from 'src/guard/rbac.guard';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin', 'seller')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
