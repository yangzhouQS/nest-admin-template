import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function isConfirm(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isConfirm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(
          value: any,
          args: ValidationArguments,
        ): Promise<boolean> {
          // console.log('value = ', value);
          // console.log(args);
          return Boolean(value === args.object[`${args.property}Confirm`]);
        },
      },
      async: true,
    });
  };
}
