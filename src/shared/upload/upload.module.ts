import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        return {
          storage: diskStorage({
            // 文件存储位置
            destination: "./uploads",
            // 文件重命名
            filename: (req, file, cb) => {
              const path =
                Date.now().toString() +
                "_" +
                Math.random().toString(36) +
                extname(file.originalname);

              cb(null, path);
            },
          }),
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
