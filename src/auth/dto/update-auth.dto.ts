import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login-auth.dto';

export class UpdateAuthDto extends PartialType(LoginDto) {}
