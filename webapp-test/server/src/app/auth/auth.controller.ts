import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @Post("login")
  async login(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(dto.email, dto.password);
    return result;
  }

  @Get("csrf-token")
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = (req as any).csrfToken();
    res.cookie("csrf-token", token);
    res.json({ csrfToken: token });
  }
}
