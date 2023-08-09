import {
    OriginationOperation,
    TransactionOperation,
    TezosToolkit,
    Contract,
    Operation,
  } from "@taquito/taquito";
  
 
import { BigNumber } from "bignumber.js";

import { confirmOperation } from "../../scripts/confirmation";

import { Approve, Transfer, TransferDestination } from "../types/FA12";

import { FA12SingleStorage } from "../types/FA12single-specific";

import { FA12singlespecific } from "./fa12single-specific";



  
  export class FA12 {
    tezos: TezosToolkit;
    contract: Contract;
    storage: FA12SingleStorage;
    fa12specifics: FA12singlespecific;
  
    constructor(contract: Contract, tezos: TezosToolkit, storage: FA12SingleStorage) {
      this.contract = contract;
      this.tezos = tezos;
      this.fa12specifics = new FA12singlespecific();
      this.storage = storage;
    }
  
    static async init(fa12Address: string, tezos: TezosToolkit): Promise<FA12> {
      var fa12specifics: unknown;
      var storage: unknown;
      const contract: Contract = await tezos.contract.at(fa12Address);

      storage = await contract.storage() as FA12SingleStorage;

      return new FA12(contract, tezos, storage);
    }

    async updateStorage(maps = {}): Promise<void> {  
      this.storage = await this.contract.storage();
        
 
      for (const key in maps) {
        this.storage[key] = await maps[key].reduce(
          async (prev: any, current: any) => {
            try {
              return {
                ...(await prev),
                [current]: await this.storage[key].get(current),
              };
            } catch (ex) {
              return {
                ...(await prev),
                [current]: 0,
              };
            }
          },
          Promise.resolve({})
        );
      }
    }
  
    async transfer(params: Transfer): Promise<TransactionOperation> {
      const operation: TransactionOperation = await this.contract.methods
        .transfer(params.from, params.destination_pair.to, params.destination_pair.value )
        .send();
  
      await confirmOperation(this.tezos, operation.hash);
  
      return operation;
    }

    async approve(params: Approve): Promise<TransactionOperation> {
      const operation: TransactionOperation = await this.contract.methods.approve(params.spender, params.value).send();
      await confirmOperation(this.tezos, operation.hash);

      return operation;
    }

  }
