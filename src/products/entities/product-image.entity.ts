import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'Products_Images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
