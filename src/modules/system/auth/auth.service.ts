import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "../../../shared/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { hash, verify } from "argon2";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  public async register(body: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        password: await hash(body.password),
      },
    });
    return await this.token(user);
  }

  private async token(user: any) {
    const payload = { name: user.name, sub: user.id };
    return {
      token: await this.jwt.signAsync(payload),
    };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        name: body.name,
      },
    });

    if (!(await verify(user.password, body.password))) {
      throw new BadRequestException("密码输入错误");
    }

    return await this.token(user);
  }
}
