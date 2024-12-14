import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  host: "localhost",
  port: 3001,
  username: "root",
  password: "root",
  database: "nest-blog",
}));
