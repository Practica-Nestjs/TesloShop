import { PartialType } from '@nestjs/mapped-types';
import { CreateSeetDto } from './create-seet.dto';

export class UpdateSeetDto extends PartialType(CreateSeetDto) {}
