/*
import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../../../shared/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // 解析用户提交的 Bearer Token header数据
      // jwtFromRequest: (req) => req.cookies["access_token"],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate({ sub: id }) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
*/
