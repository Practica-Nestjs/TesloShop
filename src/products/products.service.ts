import { Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { validate as isUUID } from 'uuid';

import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handlerDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product;
    product = await this.typeGetProduct(term);
    if (!product)
      throw new NotFoundException(`Not Found Product with term ${term}`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({ id: id, ...updateProductDto });
      this.validationProduct(product, id);
      return this.productRepository.save(product);
    } catch (error) {
      this.handlerDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
    return product;
  }


  private async typeGetProduct(term: string) {
    if (isUUID(term))
      return await this.productRepository.findOneBy({ id: term });
    else {
      const queryBilder = this.productRepository.createQueryBuilder();
      return await queryBilder.where('title=:title or slug=:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }
  }


  private validationProduct(product: Product, id: string) {
    if (!product) throw false;
    return true;
  }
  
  private handlerDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    else
      throw new NotFoundException(`Product not found in database`);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
