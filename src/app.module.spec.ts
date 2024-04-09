import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import store from '../redux/store';



describe('AppService', () => {
    let service: AppService;
  
    // Mock Redux store state
    const mockReduxState = {
      singleObject: {
        conversion_rates: {
          'USD/EUR': 0.85,
          'USD/GBP': 0.75,
          // Add more conversion rates as needed
        },
        expiry_at: Date.now() + 3600000, // Expiry time 1 hour from now
      },
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [AppService],
      }).compile();
  
      service = module.get<AppService>(AppService);
  
      // Mock Redux store getState method
      store.getState = jest.fn().mockReturnValue(mockReduxState);
    });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFXRates', () => {
    it('should return error if data is not available in the Redux store', () => {
      // Mock Redux store getState method to return null
      store.getState = jest.fn().mockReturnValueOnce(null);

      const result = service.getFXRates();

      expect(result).toEqual({ error: 'Failed to fetch data! Please try after sometime' });
    });

    it('should return quoteId and expiry_at if data is available in the Redux store', () => {
      // Mock Redux store getState method to return data
      store.getState = jest.fn().mockReturnValueOnce({
        singleObject: {
          conversion_rates: {
            'USD/EUR': 0.85,
            'USD/GBP': 0.75,
            // Add more conversion rates as needed
          },
          expiry_at: Date.now() + 3600000, // Expiry time 1 hour from now
        },
      });

      const result = service.getFXRates();

      expect(result).toHaveProperty('quoteId');
      expect(result).toHaveProperty('expiry_at');
    });
  });

  describe('convertFX', () => {
    it('should return error if conversion rates are not available for the quoteId', () => {
      const quoteId = 'invalidQuoteId';

      const result = service.convertFX(quoteId, 'USD', 'EUR', 100);

      expect(result).toEqual({ error: 'Failed to fetch conversion rates for this quoteId! Please try again' });
    });

    it('should return error if conversion rates are not available for provided currencies', () => {
      // Mock conversion rates for quoteId
      service['fxRates'].set('validQuoteId', new Map([
        ['USD/EUR', 0.85],
        ['USD/GBP', 0.75],
      ]));

      const result = service.convertFX('validQuoteId', 'USD', 'XYZ', 100);

      expect(result).toEqual({ error: 'Conversion rates not available for provided currencies' });
    });

    it('should return converted amount and currency if conversion rates are available', () => {
      // Mock conversion rates for quoteId
      service['fxRates'].set('validQuoteId', new Map([
        ['USD/EUR', 0.85],
        ['USD/GBP', 0.75],
      ]));

      const result = service.convertFX('validQuoteId', 'USD', 'EUR', 100);

      expect(result).toEqual({ convertedAmount: 85, currency: 'EUR' });
    });
  });
});
