![Alt text](https://github.com/sdcode001/forex-trading-system/assets/92887905/d90b091d-e858-4407-a61e-0829c0e80864)

# Forex-Trading-System

## Description
APIs that allow users to top up their account, fetch live FX conversion rates, perform FX conversions, and check their account balances 

## Features Implemented and project details.
1. Implemented a data fetching service, which runs in the background and periodically after 30 seconds fetches FX conversion rates from (https://app.exchangerate-api.com/) and stores them in memory.

2. Implemented caching of FX conversion rates in memory for future reference using Redux.

3. Implemented user Authentication and Authorization using the passport library for signup(name, email, password) and login(email, password) with JWT token.

4. Implemented protected routes for ***/accounts/topup*** and ***/accounts/balance*** these endpoints. Authorized users with JWT token can only access these endpoints.

5. Used MongoDB as a database to store user details.

6. Implemented the APIs using appropriate Nest.js decorators and modules.

7. Implemented user password encryption before storing in the database.

8. Followed robust error/exception handling and validation for API inputs.

9. Documented all API endpoints and their usage using Swagger.

10. Used Jest for writing test cases of the APIs.


# Set up Instructions
## Cloning 
```
git clone https://github.com/sdcode001/forex-trading-system.git
```
## Installation
```
$ cd forex-trading-system
$ npm install
```
## Running the app
```
# development
$ npm run start

# watch mode
$ npm run start:dev
```
## Accessing APIs
```
# After the app runs successfully on port 3000, hit this URL from the Browser
$ http://localhost:3000/api/
```
## Test
```
# unit tests
$ npm run test
```

# Task Completed
## Task-1 
- Created an FX rate syncing system that runs in the background and fetches live FX conversion rates from app.exchangerate-api.com and stores them in memory.
- Each rate is valid for 30 seconds. Hence this service periodically after 30 seconds fetches FX conversion rates and stores them with the expity_at tag in the redux store.
- Redux is used to implement storing/caching of FX conversion rates.

## Task-2 
#### Created all the API endpoints with the proper guidelines.
1. ***GET /fx-rates***
   - This API fetches live FX conversion rates from redux memory, maps them with a generated quoteId, and sends this quoteId through the response to the client.
2. ***POST /fx-conversion***
   - This API performs an FX conversion using the provided quoteId from /fx-rates API and converts the specified amount from one currency to another of user balance.
3. ***POST /auth/signup***
   - This API performs Signup for the user with (name, email, password) and returns a JWT Bearer token in response.
4. ***POST /auth/login***
   - This API performs Login for the user with (email, password) and returns a JWT Bearer token in response.
5. ***GET /accounts/balance***
   - This API retrieves the balances in all currencies for the user's account.
   - This API needs Bearer JWT token authentication. So you have to add the Bearer token in the Authorize section of Swagger UI (First Login/SignUp to get the JWT Bearer 
     token).
6. ***POST /accounts/topup***
   - This API allows users to top up their account with a specified amount in a given currency.
   - This API needs Bearer JWT token authentication. So you have to add the Bearer token in the Authorize section of Swagger UI (First Login/SignUp to get the JWT Bearer 
     token).

# Decleration
Here I have used exchangerate-api.com instead of alphavantage.co because alphavantage.co has a limit of 25 API calls per day for free usage. But according to the need of the assessment we have to make an API call every 30 seconds to refresh the FX conversion rates.
