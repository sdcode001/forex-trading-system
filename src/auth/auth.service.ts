import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<object> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
      const result = await this.userModel.findOne({ email });
      if(result){
        return {meassage: 'User already exists! Please Login'}
      }

      try{
        const user = await this.userModel.create({
          name,
          email,
          password: hashedPassword,
          balances: {}
        });

        const jwt_token = this.jwtService.sign({ id: user._id });

        return { token : jwt_token};

      }catch(err){
        throw err;
      }

    }catch(error){
      return {error: 'Failed to signup User! Please try again'};
    }
    
  }

  async login(loginDto: LoginDto): Promise<object> {
    const { email, password } = loginDto;

    try{
        const user = await this.userModel.findOne({ email });

        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordMatched = await bcrypt.compare(password, user.password);
    
        if (!isPasswordMatched) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const jwt_token = this.jwtService.sign({ id: user._id });

        return { token : jwt_token};
  
    }catch(error){
      return {error: 'Failed to login User! Please try again'};
    }
    
  }
}