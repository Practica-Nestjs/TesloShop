import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeetService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const admingUser = await this.insertUser();
    await this.insertNewProduct(admingUser);

    return `Seed execute`;
  }

  private async deleteTables() {
    await this.productService.deleteAllProduct();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUser() {
    const seedUser = initialData.users;
    const users: User[] = [];
    seedUser.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUser = await this.userRepository.save(seedUser);

    return dbUser[0];
  }

  private async insertNewProduct(user: User) {
    await this.productService.deleteAllProduct();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
