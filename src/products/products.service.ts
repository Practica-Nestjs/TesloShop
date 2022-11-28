import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { validate as isUUID } from 'uuid';

import { Product, ProductImage } from './entities/';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handlerDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((img) => img.url),
    }));
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map((img) => img.url),
    };
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
        images: [],
      });
      this.validationProduct(product);
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
      const queryBilder = this.productRepository.createQueryBuilder('prod');
      return await queryBilder
        .where('title=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
  }

  private async findOne(term: string) {
    const product: Product = await this.typeGetProduct(term);
    if (!product)
      throw new NotFoundException(`Not Found Product with term ${term}`);
    return product;
  }

  private validationProduct(product: Product) {
    if (!product) throw new Error();
    return true;
  }

  private handlerDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    // else throw new NotFoundException(`Product not found in database`);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
