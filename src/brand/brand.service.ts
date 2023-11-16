import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand, Category } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBrandDto): Promise<Brand> {
    try {
      const brand = await this.prisma.brand.findFirst({
        where: {
          name: {
            contains: CreateBrandDto.name,
          },
        },
      });
      if (brand) throw new BadRequestException('Brand name already exists');
      return await this.prisma.brand.create({ data });
    } catch (error) {
      throw new Error('Failed to create brand: ' + error);
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      return await this.prisma.brand.findMany({
        include: { product_model: true,categories:true,products:true },

      });
    } catch (error) {
      throw new Error('Failed to fetch brands: ' + error.message);
    }
  }

  async findOne(id: number): Promise<Brand | null> {
    try {
      return await this.prisma.brand.findUnique({
        where: { id },
        include: { categories: true, product_model: true, products: true },
      });
    } catch (error) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }

  async update(id: number, data: UpdateBrandDto): Promise<Brand> {
    try {
      return await this.prisma.brand.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update brand with ID ${id}: ` + error.message);
    }
  }

  async remove(id: number): Promise<Brand> {
    try {
      return await this.prisma.brand.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete brand with ID ${id}: ` + error.message);
    }
  }
}
