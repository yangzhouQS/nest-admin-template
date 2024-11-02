import { RequestMethod } from '@nestjs/common';
import { BaseRouteName } from '../types/base-route-name.type';

export interface BaseRoute {
  name: BaseRouteName;
  path: string;
  method: RequestMethod;
  enable: boolean;
  override: boolean;
  withParams: boolean;
}
