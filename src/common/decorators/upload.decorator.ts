import {
  applyDecorators,
  MethodNotAllowedException,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export function UploadDecorator(fieldName?, options?: MulterOptions) {
  if (!fieldName) {
    fieldName = "file";
  }
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}

/**
 * 文件类型过滤
 * @param types
 */
export function fileFilter(types: string[] | string) {
  if (typeof types === "string") {
    types = [types];
  }
  return (req, file, cb) => {
    const fileType = file.mimetype?.split("/")[1].toLowerCase();
    console.log("fileType = ", fileType);
    if (Array.isArray(types)) {
      types = types.map((type) => type.toLowerCase());
    }
    if (types.includes(fileType)) {
      return cb(null, true);
    } else {
      cb(
        new MethodNotAllowedException(
          "文件类型错误, 允许上传文件类型[ " +
            types.toString() +
            " ] files are allowed",
        ),
        false,
      );
    }
  };
}
