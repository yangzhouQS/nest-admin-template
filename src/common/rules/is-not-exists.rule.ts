// 两次输入密码是否一致

// 表字段是否唯一
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { PrismaClient } from "@prisma/client";

/**
 * 判断不存在时返回为真: true
 * @param table
 * @param validationOptions
 * @constructor
 */
export function IsNotExistsRule(
  table: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "isNotExistsRule",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient();
          const result = await prisma[table].findFirst({
            where: {
              [args.property]: value,
            },
          });

          return !Boolean(result);
        },
      },
    });
  };
}
