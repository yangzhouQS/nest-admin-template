import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags("system:auth 用户注册管理模块")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "用户注册" })
  @Post("/register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @ApiOperation({ summary: "用户登录" })
  @Post("/login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
