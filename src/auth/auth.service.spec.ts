import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User } from '../../models/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModelMock: Partial<Model<User>>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    
    jwtServiceMock = {
      sign: jest.fn(),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      const createdUser = {
        _id: 'someUserId',
        ...signUpDto,
        password: hashedPassword,
        balances: {},
      };

      userModelMock.findOne = jest.fn().mockResolvedValueOnce(null);
      userModelMock.create = jest.fn().mockResolvedValueOnce(createdUser);
      jwtServiceMock.sign = jest.fn().mockReturnValueOnce('someJwtToken');

      const result = await service.signUp(signUpDto);

      expect(userModelMock.findOne).toHaveBeenCalledWith({ email: signUpDto.email });
      expect(userModelMock.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
        balances: {},
      });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ id: createdUser._id });
      expect(result).toEqual({ token: 'someJwtToken' });
    });

    it('should return error if user already exists', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      userModelMock.findOne = jest.fn().mockResolvedValueOnce({ email: signUpDto.email });

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ message: 'User already exists! Please Login' });
    });

    it('should return error if signUp process fails', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      userModelMock.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ error: 'Failed to signup User! Please try again' });
    });
  });

  describe('login', () => {
    it('should log in a user with valid credentials', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        _id: 'someUserId',
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
      };

      userModelMock.findOne = jest.fn().mockResolvedValueOnce(user);
      jwtServiceMock.sign = jest.fn().mockReturnValueOnce('someJwtToken');

      const result = await service.login(loginDto);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ id: user._id });
      expect(result).toEqual({ token: 'someJwtToken' });
    });

    it('should throw UnauthorizedException if email is not found', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      userModelMock.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        _id: 'someUserId',
        email: loginDto.email,
        password: await bcrypt.hash('wrongpassword', 10),
      };

      userModelMock.findOne = jest.fn().mockResolvedValueOnce(user);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return error if login process fails', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      userModelMock.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      const result = await service.login(loginDto);

      expect(result).toEqual({ error: 'Failed to login User! Please try again' });
    });
  });
});
