import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty({ message: "文章标题不能为空" })
  @MaxLength(100, { message: "文章标题不能超过20个字符" })
  title: string;

  @IsNotEmpty({ message: "文章内容不能为空" })
  content: string;

  thumb: string;

  @IsNotEmpty({ message: "请选择栏目id" })
  categoryId: number;
}
