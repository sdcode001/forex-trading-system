import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import store from '../../redux/store';
import { setObject } from '../../redux/actions';


@Injectable()
export class DataFetcherService {
   
    @Cron(CronExpression.EVERY_30_SECONDS)
    fetchData() {
      const base_currency = 'USD'  
      const api_url = `https://v6.exchangerate-api.com/v6/3612f15bfefc250299334267/latest/${base_currency}`;
      this.makeApiCall(api_url).subscribe(
        data => {
          //processing data
          const conversionRates = data.conversion_rates;
          const processed_rates: {[key: string]: any} = {}
          Object.entries(conversionRates).forEach(([currencyCode, rate]) => {
             processed_rates[`${base_currency}/${currencyCode}`] = rate
          });
          
          //save the processed rates to local memory using Redux.js.
           const expiry_timestamp:string = new Date(new Date().getTime() + 30 * 1000).toTimeString();

           store.dispatch(setObject(
            {
              expiry_at: expiry_timestamp,
              conversion_rates: processed_rates
            }
           ));

           console.log(store.getState().singleObject);
        },
        error => {
          this.handleError(error);
        }
      );
    }

  

  private makeApiCall(endpoint: string): Observable<any> {
    return from(axios.get(endpoint)).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        throw new Error(`Error: ${error.message}`);
      })
    );
  }

  
  private handleError(error: Error) {
    console.log(error.message)
  }
}

