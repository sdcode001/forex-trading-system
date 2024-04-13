import { Injectable } from '@nestjs/common';
import store from '../redux/store';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { Model } from 'mongoose';


@Injectable()
export class AppService {
  
  private readonly fxRates: Map<string, Map<string, number>> = new Map();

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ){}

  getFXRates(user: User): object {
    const quoteID = this.generateQuoteId();

    //fetching FX conversion rates from redux memory and setting fxRates with quoteId.
    const fetched_data = store.getState().singleObject;
    
    if(!fetched_data){
      return {error: 'Failed to fetch data! Please try after sometime'}
    }

    this.fxRates.set(quoteID, fetched_data.conversion_rates); 

    return { quoteId: quoteID, expiry_at:  fetched_data.expiry_at};
  }

  
  async convertFX(quoteId: string, from_Currency: string, to_Currency: string, amount: number, user: User): Promise<object> {
    const conversion_rates = this.fxRates.get(quoteId);

    if(!conversion_rates){
      return {error: 'Failed to fetch conversion rates for this quoteId! Please try again with new quoteId'};
    }

    try{

       const result = await this.userModel.findById(user._id)
       const balances = result.balances 

       const base_currency:string = 'USD';

       const rateFrom = conversion_rates[`${base_currency}/${from_Currency}`];
       const rateTo = conversion_rates[`${base_currency}/${to_Currency}`];
   
       if (!rateFrom || !rateTo) {
         return {error: 'Conversion rates not available for provided currencies'};
       }
   
       // Calculate converted amount
       const conversionRate = rateTo / rateFrom;
       const converted_amount = amount * conversionRate;
       
       //converting balance from from_currency to to_currency
       if(balances.get(from_Currency) < amount){
         return {error: `Insufficient balance! ${from_Currency}:${balances.get(from_Currency)}`};
       }
   
       balances.set(from_Currency, balances.get(from_Currency)-amount);
   
       if(balances.has(to_Currency)){
         balances.set(to_Currency, balances.get(to_Currency) + converted_amount);
       }
       else{
           balances.set(to_Currency, converted_amount);
       }
   
       try{
         const result = await this.userModel.findByIdAndUpdate(
             {_id: user._id},
             {$set: {balances: Object.fromEntries(balances)}},
             { new: true },
         );
   
         //console.log(result);
         return {convertedAmount: converted_amount, currency: to_Currency};
     
       }catch(err){
           console.log(err);
           return {message: "Failed to convert balance! Please try again"}
       }

    }catch(error){
      return {error: "Balance conversion failed! Please try again"};
    }
    
  }


  // Generate a unique quoteId
  private generateQuoteId(): string {
    return Math.random().toString(36).substr(2, 9);
  }


}
