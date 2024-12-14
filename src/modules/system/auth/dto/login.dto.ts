import { IsNotEmpty } from "class-validator";
import { IsNotExistsRule } from "../../../../common/rules/is-not-exists.rule";
import { IsExistsRule } from "../../../../common/rules/is-exists.rule";

export class LoginDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  // @IsNotExistsRule("user", { message: "用户名已存在" })
  @IsExistsRule("user", { message: "账号不存在" })
  name: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
}
