import { PartialType } from '@nestjs/mapped-types';
import { CreatePlatformLogDto } from './create-platform-log.dto';

export class UpdatePlatformLogDto extends PartialType(CreatePlatformLogDto) {}
