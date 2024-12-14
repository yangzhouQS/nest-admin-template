import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { PrismaClient } from "@prisma/client";

/**
 * 验证已经存在
 * @param {string} table
 * @param {ValidationOptions} validationOptions
 * @return {(object: Record<string, any>, propertyName: string) => void}
 * @constructor
 */
export function IsExistsRule(
  table: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "IsExistsRule",
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

          return Boolean(result);
        },
      },
    });
  };
}
