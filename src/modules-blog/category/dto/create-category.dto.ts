import { IsNotEmpty } from "class-validator";
import { IsNotExistsRule } from "../../../common/rules/is-not-exists.rule";

export class CreateCategoryDto {
  @IsNotEmpty({ message: "栏目名称不能为空" })
  @IsNotExistsRule("category", { message: "栏目名称已存在" })
  title: string;
}
