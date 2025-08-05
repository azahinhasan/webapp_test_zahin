import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMurmurDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
