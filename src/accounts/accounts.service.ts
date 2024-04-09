import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'models/user.schema';
import { Model } from 'mongoose';



@Injectable()
export class AccountsService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ){}

    async topUpAccount(currency: string, amount: number, user: User): Promise<object> {
        //topup the balance
        if(user.balances.has(currency)){
            user.balances.set(currency, user.balances.get(currency) + amount);
        }
        else{
            user.balances.set(currency, amount);
        }
        
        //update balances in database
        try{
            const result = await this.userModel.findByIdAndUpdate(
                {_id: user._id},
                {$set: {balances: Object.fromEntries(user.balances)}},
                { new: true },
            );

            //console.log(result);
            return {message: `Balance topup successfull - ${currency}:${result.balances.get(currency)}`} 
        
        }catch(err){
            console.log(err);
            return {message: "Failed to topup balance! Please try again"}
        }
    }

    async getAccountBalance(user: User): Promise<object> {
        try{
            const foundUser = await this.userModel.findById(user._id);
            return { balances: foundUser.balances };
         }catch(err){
             console.log(err);
             return { balances: new Map<string, number>()};
         }
         
    }
}
