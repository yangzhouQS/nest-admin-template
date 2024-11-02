import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty({ message: '模块编码不能为空' })
  code: string;

  @IsNotEmpty({ message: '模块名称不能为空' })
  name: string;

  @IsString({ message: '模块图标不能为空' })
  icon?: any;

  application_type?: string;

  @IsString({ message: '模块类型不能为空' })
  module_type: string;

  @IsString({ message: '模块路径不能为空' })
  url: string;

  @IsBoolean({ message: '是否开启权限控制不能为空' })
  access_control: boolean;

  // 模块编码
  permissionEntries?: any[];

  is_shortcut?: boolean;
  is_new_window?: boolean;
}
