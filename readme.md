# FA1.2 smart contract testing suite
## Introduction
This is a suite of test cases for Tezos smart contracts in order to check the correct implementation of the FA1.2 interface standard according to [TZIP-07](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md) (Commit: af597cdabd8d749c2ff008a2cd1aacd06bfbe026). 

This suite can be used by smart contract developers or security assessors to check correct working of their developed or assessed FA1.2 smart contract.

The defined test cases are checking the correct working of the following FA1.2 entrypoints:
- transfer
- approve
- getAllowance 
- getBalance
- getTotalSupply

## TODO / ideas / improvements:
- add/change test cases to support more complex scenarios
- clean up code 
- automatic setup of accounts and tez funding
- DApp / front end 

## How to install
- [NVM install](https://github.com/nvm-sh/nvm#installing-and-updating)
- Install nodejs: `nvm install node`
- Install npm packages: `npm i`

## How to use

### Accounts
Four Tezos accounts are required. These acccounts have to be configured in the file ./scripts/accounts.ts. A default account file can be found here [./scripts/default_accounts.js](scripts/default_accounts.ts).

The names of the accounts (admin, alice, bob, and charlie) in the default account should not be changed. Just insert the public key hash (PKH), public key (PK), and secret key (SK) into the template.

Ensure the accounts have sufficient tez to pay for the transaction they emit.

### Configuration in env.ts
You have to create an env.js in the root directory of the repo. An example/template file can be found here: [example_env.js](example_env.js). Please see comments in the example/template file.

### Initial token distribution
All required tokens have to be given (minted / transferred) to the admin account. See comments in file [example_env.js](example_env.js).

### Execution
npm test

## Contribution
Everyone is invited to contribute to the FA1.2 smart contract testing suite. We are eager to see new ideas, read new test cases and foster the development of the suite by everyone in the Tezos ecosystem.

## Disclaimer
This FA1.2 smart contract testing suite is currently "work in progress". The FA1.2 smart contract testing suite does not claim to be complete at any time as it is continuously developed.

## Contact
This github repository is currently maintained by [Inference](https://inference.ag).
