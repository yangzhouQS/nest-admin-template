import { Injectable } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({ data: createArticleDto });
  }

  async findAll(page = 1) {
    const row = 10;
    const articles = await this.prisma.article.findMany({
      skip: (page - 1) * row,
      take: row,
    });

    const total = await this.prisma.article.count();
    return {
      meta: {
        pageSize: row,
        currentPage: page,
        total,
        totalPage: Math.ceil(total / row),
      },
      data: articles,
      total: articles.length,
    };
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
