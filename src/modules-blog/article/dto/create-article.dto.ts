import { IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto {
  @ApiProperty({
    name: "title",
    description: "文章标题",
    example: {
      title: "文章标题",
    },
    type: String,
  })
  @IsNotEmpty({ message: "文章标题不能为空" })
  @MaxLength(100, { message: "文章标题不能超过20个字符" })
  title: string;

  @ApiProperty({
    name: "content",
    description: "文章内容",
    example: {
      content: "文章内容",
    },
    type: String,
  })
  @IsNotEmpty({ message: "文章内容不能为空" })
  content: string;

  @ApiProperty({
    name: "thumb",
    description: "文章缩略图",
    example: {
      thumb: "/uploads/20190826/4c3f57e7d1a0b182180111162834.png",
    },
    type: String,
  })
  thumb: string;

  @ApiProperty({
    name: "categoryId",
    description: "栏目id",
    example: {
      categoryId: 1,
    },
    type: Number,
  })
  @IsNotEmpty({ message: "请选择栏目id" })
  categoryId: number;
}
