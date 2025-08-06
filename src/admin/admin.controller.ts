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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RbucGuard } from 'src/guard/rbac.guard';
import { Roles } from 'src/auth/decoration/auth.decoration';
import { ApiQuery } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'sortBy',
    enum: ['name', 'email', 'phone', 'createdAt'],
    required: false,
  })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbucGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
