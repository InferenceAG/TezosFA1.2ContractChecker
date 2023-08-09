import { Utils } from "./utils";
import accounts from "../../scripts/accounts";
import { SBAccount } from "../types/Common";
import { FA12 } from "./fa12";
import { FA12Errors } from "../types/Errors"

import { rejects } from "assert";
import { BigNumber } from "bignumber.js";
import chai, { expect } from "chai";
import  env from "../../env";

chai.use(require('chai-bignumber')(BigNumber));

//var utils: Utils;
var admin: SBAccount = accounts.admin;
var alice: SBAccount = accounts.alice;
var bob: SBAccount = accounts.bob;
var charlie: SBAccount = accounts.charlie;
var baseToken: number = env.fa12initstate.admin.tokenId[0];

export class FA12testlib {
    util: Utils;
    contract: FA12;

    constructor(contract: FA12, util: Utils) {
        this.contract = contract;
        this.util = util;
    };
    
    async initState(): Promise<unknown> {
        
        await this.util.setProvider(admin.sk);
        if (await this.contract.fa12specifics.getAllowance(this.contract, admin.pkh, alice.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, admin.pkh, bob.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: bob.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, admin.pkh, charlie.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: charlie.pkh, value: new BigNumber(0)});
        }

        var balA : BigNumber = await this.contract.fa12specifics.getBalance(this.contract, alice.pkh);
        var balB : BigNumber = await this.contract.fa12specifics.getBalance(this.contract, bob.pkh);
        var balC : BigNumber = await this.contract.fa12specifics.getBalance(this.contract, charlie.pkh);    

        await this.util.setProvider(alice.sk);
        if (balA > new BigNumber(0)) {
            await this.contract.transfer({from: alice.pkh, destination_pair: {to: admin.pkh, value: balA}});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, alice.pkh, admin.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: admin.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, alice.pkh, bob.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: bob.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, alice.pkh, charlie.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: charlie.pkh, value: new BigNumber(0)});
        }

        await this.util.setProvider(bob.sk);
        if (balB > new BigNumber(0)) {
            await this.contract.transfer({from: bob.pkh, destination_pair: {to: admin.pkh, value: balB}});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, bob.pkh, admin.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: admin.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, bob.pkh, alice.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, bob.pkh, charlie.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: charlie.pkh, value: new BigNumber(0)});
        }

        await this.util.setProvider(charlie.sk);
        if (balC > new BigNumber(0)) {
            await this.contract.transfer({from: charlie.pkh, destination_pair: {to: admin.pkh, value: balC}});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, charlie.pkh, admin.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: admin.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, charlie.pkh, alice.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        }
        if (await this.contract.fa12specifics.getAllowance(this.contract, charlie.pkh, bob.pkh) > new BigNumber(0)) {
            await this.contract.approve({spender: bob.pkh, value: new BigNumber(0)});
        }

    };
};
  