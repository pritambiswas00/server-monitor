import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {

     @IsString({ message: "Please provide valid name"  })
     name: string;

     @IsString({ message: "Please provide valid email" })
     @IsEmail({ allow_display_name: true })
     email: string;
}
