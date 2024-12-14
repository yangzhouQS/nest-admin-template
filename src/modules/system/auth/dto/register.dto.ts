import { IsNotEmpty } from "class-validator";
import { IsNotExistsRule } from "../../../../common/rules/is-not-exists.rule";
import { IsConfirm } from "../../../../common/rules/is-confirm";

export class RegisterDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  @IsNotExistsRule("user", { message: "用户名已存在" })
  name: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;

  @IsConfirm({ message: "两次密码不一致" })
  @IsNotEmpty({ message: "确认密码不能为空" })
  password_confirm: string;
}
