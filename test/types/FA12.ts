import { MichelsonMap, MichelsonMapKey } from "@taquito/michelson-encoder";

import { BigNumber } from "bignumber.js";

export type UserFA12Info = {
  balances: MichelsonMap<MichelsonMapKey, unknown>;
  allowances: string[];
};

export type Approve =
  {
    spender: string;
    value: BigNumber;
  };

export type TransferDestination = {
  to: string;
  value: BigNumber;
};

export type Transfer = {
  from: string;
  destination_pair: TransferDestination;
};

export type getAllowance = {
  owner: string;
  spender: string;
};

export type getBalance = {
  owner: string;
};