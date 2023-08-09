import { MichelsonMap, MichelsonMapKey, OptionTokenSchema, PairTokenSchema } from "@taquito/michelson-encoder";

import { BigNumber } from "bignumber.js";

export type FA12SingleStorage = {
  ledger: MichelsonMap<MichelsonMapKey, unknown>;
  approvals: MichelsonMap<MichelsonMapKey, unknown>;
  fields: {
    totalSupply: BigNumber;
    paused: boolean;
    admin: string;
  }
};