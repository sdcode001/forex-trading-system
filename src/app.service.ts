import { Injectable } from '@nestjs/common';
import store from '../redux/store';

@Injectable()
export class AppService {
  
  private readonly fxRates: Map<string, Map<string, number>> = new Map();

  getFXRates(): object {
    const quoteID = this.generateQuoteId();

    //fetching FX conversion rates from redux memory and setting fxRates with quoteId.
    const fetched_data = store.getState().singleObject;
    if(!fetched_data){
      return {error: 'Failed to fetch data! Please try after sometime'}
    }
    this.fxRates.set(quoteID, fetched_data.conversion_rates); 
    return { quoteId: quoteID, expiry_at:  fetched_data.expiry_at};
  }

  
  convertFX(quoteId: string, from_Currency: string, to_Currency: string, amount: number): object {
    const conversion_rates = this.fxRates.get(quoteId);
    
    if(!conversion_rates){
       return {error: 'Failed to fetch conversion rates for this quoteId! Please try again'};
    }

    const base_currency:string = 'USD';

    const rateFrom = conversion_rates[`${base_currency}/${from_Currency}`];
    const rateTo = conversion_rates[`${base_currency}/${to_Currency}`];

    if (!rateFrom || !rateTo) {
      return {error: 'Conversion rates not available for provided currencies'};
    }

    // Calculate converted amount
    const conversionRate = rateTo / rateFrom;
    const converted_amount = amount * conversionRate;

    return {convertedAmount: converted_amount, currency: to_Currency};
  }


  // Generate a unique quoteId
  private generateQuoteId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

}
