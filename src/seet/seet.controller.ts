import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeetService } from './seet.service';
import { CreateSeetDto } from './dto/create-seet.dto';
import { UpdateSeetDto } from './dto/update-seet.dto';

@Controller('seet')
export class SeetController {
  constructor(private readonly seetService: SeetService) {}

  @Post()
  create(@Body() createSeetDto: CreateSeetDto) {
    return this.seetService.create(createSeetDto);
  }

  @Get()
  findAll() {
    return this.seetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeetDto: UpdateSeetDto) {
    return this.seetService.update(+id, updateSeetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seetService.remove(+id);
  }
}
