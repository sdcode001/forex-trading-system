import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AccountsService } from './accounts.service';
import { User } from '../../models/user.schema';
import { Model } from 'mongoose';


describe('AccountsService', () => {
  let service: AccountsService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findByIdAndUpdate: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('topUpAccount', () => {
    it('should top up the balance successfully', async () => {
      const currency = 'USD';
      const amount = 100;
      const user = new User();
      user._id = 'someUserId';
      user.balances = new Map<string, number>();

      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce({ balances: user.balances });

      const result = await service.topUpAccount(currency, amount, user);

      expect(result).toEqual({ message: `Balance topup successfull - ${currency}:${amount}` });
    });

    it('should handle failed balance top-up', async () => {
      const currency = 'USD';
      const amount = 100;
      const user = new User();
      user._id = 'someUserId';
      user.balances = new Map<string, number>();

      jest.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Failed to update balance'));

      const result = await service.topUpAccount(currency, amount, user);

      expect(result).toEqual({ message: 'Failed to topup balance! Please try again' });
    });
  });

  describe('getAccountBalance', () => {
    it('should get account balance successfully', async () => {
      const user = new User();
      user._id = 'someUserId';
      user.balances = new Map<string, number>();
      user.balances.set('USD', 100);

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);

      const result = await service.getAccountBalance(user);

      expect(result).toEqual({ balances: user.balances });
    });

    it('should handle error when getting account balance', async () => {
      const user = new User();
      user._id = 'someUserId';

      jest.spyOn(userModel, 'findById').mockRejectedValueOnce(new Error('Failed to find user'));

      const result = await service.getAccountBalance(user);

      expect(result).toEqual({ balances: new Map<string, number>() });
    });
  });
});
