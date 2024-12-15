import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export function UploadDecorator(fieldName?, options?: MulterOptions) {
  if (!fieldName) {
    fieldName = "file";
  }
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}
