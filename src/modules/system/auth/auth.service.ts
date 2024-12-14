import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
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

  create(createAuthDto: CreateAuthDto) {
    return "This action adds a new auth";
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

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
