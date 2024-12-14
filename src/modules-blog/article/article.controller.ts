import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  Put,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("blog:article文章管理")
@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "创建文章" })
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @ApiOperation({ summary: "获取文章列表" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @Get()
  findAll(@Query("page", new DefaultValuePipe(1)) page: number) {
    return this.articleService.findAll(page);
  }

  @ApiOperation({ summary: "根据id获取文章" })
  @ApiParam({ name: "id", description: "文章id", example: "1" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  @ApiOperation({ summary: "根据id更新文章" })
  @Put(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @ApiOperation({ summary: "根据id删除文章" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(+id);
  }
}
