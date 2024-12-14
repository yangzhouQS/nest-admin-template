import { HttpException, HttpStatus, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { map } from "lodash";

export default class Validate extends ValidationPipe {
  /*constructor() {
    super({ transform: true });
  }*/

  /*
  * [
      ValidationError {
        target: RegisterDto { name: 'admin', password: '888' },
        value: 'admin',
        property: 'name',
        children: [],
        constraints: { isNotExistsRule: '用户已存在,禁止注册' }
      }
    ]
  * */
  protected flattenValidationErrors(errors: ValidationError[]): string[] {
    const errorMessage = map(errors, (error) => {
      return {
        field: error.property,
        message: Object.values(error.constraints), // error.constraints[Object.keys(error.constraints)[0]],
      };
    });
    throw new HttpException(
      {
        code: 422,
        message: errorMessage,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
