import { BigNumber } from "bignumber.js";

import { FA12 } from "./fa12";

export class FA12singlespecific {
  
  async getBalance(fa12contract: FA12, user: string): Promise<BigNumber> {
    await fa12contract.updateStorage();
    
    if (await fa12contract.storage.ledger.get(user.toString()) !== undefined) {
      const balance: BigNumber = await fa12contract.storage.ledger.get(user.toString()) as BigNumber;
      return balance !== undefined ? new BigNumber(balance) : new BigNumber(0);
    }
    
    return new BigNumber(0);
  }

  async getAllowance(fa12contract: FA12, owner: string, spender: string): Promise<BigNumber> {
    await fa12contract.updateStorage();
    if (await fa12contract.storage.approvals.get({owner: owner.toString(), spender: spender.toString()}) !== undefined) {
      const balance: BigNumber = await fa12contract.storage.approvals.get({owner: owner.toString(), spender: spender.toString()}) as BigNumber;
      return balance !== undefined ? new BigNumber(balance) : new BigNumber(0);
    }
    
    return new BigNumber(0);
  }

  async getTotalSupply(fa12contract: FA12): Promise<BigNumber> {
    await fa12contract.updateStorage();
    
    if (await fa12contract.storage.fields.totalSupply !== undefined) {
      const balance: BigNumber = await fa12contract.storage.fields.totalSupply as BigNumber;
      return balance !== undefined ? new BigNumber(balance) : new BigNumber(0);
    }
    
    return new BigNumber(0);
  }

}