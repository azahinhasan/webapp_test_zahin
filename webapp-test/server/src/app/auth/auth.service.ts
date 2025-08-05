import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signup(email: string, password: string) {
    try {
      const exists = await this.userRepo.findOne({ where: { email } });
      if (exists) throw new ConflictException("Email already taken");

      const passwordHash = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({ email, name: email, isActive: true });
      (user as any).passwordHash = passwordHash;
      await this.userRepo.save(user);

      
      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException("Invalid credentials");

      const isMatch = await bcrypt.compare(
        password,
        (user as any).passwordHash
      );
      if (!isMatch) throw new UnauthorizedException("Invalid credentials");

      const payload = {
        sub: user.id,
        email: user.email
      };
      const jwtToken = await this.jwtService.signAsync(payload);

      return { accessToken: jwtToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
}
