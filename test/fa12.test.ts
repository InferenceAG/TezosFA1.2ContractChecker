import "@taquito/rpc";
import { Utils } from "./utils/utils";
import accounts from "../scripts/accounts";
import { SBAccount } from "./types/Common";
import { FA12 } from "./utils/fa12";
import  env from "../env";
import { rejects } from "assert";
import { FA12Errors } from "./types/Errors"

import chai, { expect } from "chai";

import { BigNumber } from "bignumber.js";
import { FA12testlib} from "./utils/fa12testlib";

chai.use(require('chai-bignumber')(BigNumber));

var utils: Utils;

const admin: SBAccount = accounts.admin;
const alice: SBAccount = accounts.alice;
const bob: SBAccount = accounts.bob;
const charlie: SBAccount = accounts.charlie;

var fa12contract: FA12;
var fa12testlib: FA12testlib;


const baseTokenAmount: number = env.fa12initstate.admin.amount[0];

describe("FA12 generic transfer testing", () => {
    
    before("setup", async () => {
        utils = new Utils();
        await utils.init(admin.sk);
        fa12contract = await FA12.init(env.fa12contract, utils.tezos);
        fa12contract.updateStorage();
        fa12testlib = new FA12testlib(fa12contract, utils);
        await fa12testlib.initState();
    });
    
    // Generic transfer test cases:
    it("#1 - Transfer of 1 token from admin to admin by admin", async () => {
        //Expected result: succeed
        await utils.setProvider(admin.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(1)}});

        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(baseTokenAmount);
    });
    
    it("#2 - Transfer of 0 tokens from admin to admin by admin", async () => {
        //Expected result: undefined behaviour in the standard
        await utils.setProvider(admin.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(0)}});

        expect(await  fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(baseTokenAmount);
    });

    it("#3 - Transfer of too many tokens from admin to admin by admin", async () => {
        //Expected result: fail, returning error message "NotEnoughBalance"
        await utils.setProvider(admin.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(baseTokenAmount + 1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_BALANCE);

            return true;
        });
    });

    it("#4 - Transfer of too many tokens from admin to alice by admin", async () => {
        //Expected result: fail, returning error message "NotEnoughBalance"
        await utils.setProvider(admin.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(baseTokenAmount + 1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_BALANCE);

            return true;
        });
    });

    it("#5 - Transfer of 0 tokens from admin to alice by admin ", async () => {
        //Expected result: undefined behaviour in the standard
        await utils.setProvider(admin.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(0)}});

        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));
    });

    it("#6 - Transfer of 1 token from admin to alice by admin.", async () => {
        //Expected result: succeed

        await utils.setProvider(admin.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(1)}});
    
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount-1));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(1));

        await utils.setProvider(alice.sk);
        await fa12contract.transfer({from: alice.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(1)}});
    
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));

    });
});

describe("FA12 generic operator transfer testing", () => {

    before("setup", async () => {
        utils = new Utils();
        await utils.init(admin.sk);
        fa12contract = await FA12.init(env.fa12contract, utils.tezos);
        fa12contract.updateStorage();
        fa12testlib = new FA12testlib(fa12contract, utils);
        await fa12testlib.initState();
    });

    it("#1 - Non-authorized operator transfers 1 token from admin to alice by alice", async () => {
        //Expected result: fail, returning error message "NotEnoughAllowance"
        await utils.setProvider(alice.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_ALLOWANCE);

            return true;
        });
    });

    it("#2 - Non-authorized operator transfers too many tokens from admin to alice by alice", async () => {
        //Expected result: fail, returning error message "NotEnoughAllowance"
        await utils.setProvider(alice.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(baseTokenAmount + 1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_ALLOWANCE);

            return true;
        });
    });

    it("#3 - Non-authorized operator transfers 1 token from admin to bob by alice", async () => {
        //Expected result: fail, returning error message "NotEnoughAllowance"
        await utils.setProvider(alice.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: bob.pkh, value: new BigNumber(1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_ALLOWANCE);

            return true;
        });
    });

    it("#4 - Non-authorized operator transfers too many tokens from admin to bob by alice", async () => {
        //Expected result: fail, returning error message "NotEnoughAllowance"
        await utils.setProvider(alice.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: bob.pkh, value: new BigNumber(baseTokenAmount + 1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_ALLOWANCE);

            return true;
        });
    });

    it("#5 - Operator alice for admin transfers 1 token from admin to alice", async () => {
        //Expected result: succeed
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(1)});

        await utils.setProvider(alice.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(1)}});

        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount-1));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(1));
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        await utils.setProvider(alice.sk);
        await fa12contract.transfer({from: alice.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(1)}});
    });

    it("#6 - Operator alice for admin transfers 0 token from admin to alice", async () => {
        //Expected result: succeed
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});

        await utils.setProvider(alice.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(0)}});

        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
    });

    it("#7 - Operator alice transfers too many tokens from admin to alice by alice", async () => {
        //Expected result: fail, returning error message "NotEnoughAllowance"
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(1)});

        await utils.setProvider(alice.sk);
        await rejects(fa12contract.transfer({from: admin.pkh, destination_pair: {to: alice.pkh, value: new BigNumber(baseTokenAmount + 1)}}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_NOT_ENOUGH_ALLOWANCE);

            return true;
        });
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});   
    });

    it("#8 - Operator alice for admin transfers 1 token from admin to bob", async () => {
        //Expected result: succeed
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(1)});

        await utils.setProvider(alice.sk);
        await fa12contract.transfer({from: admin.pkh, destination_pair: {to: bob.pkh, value: new BigNumber(1)}});

        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount-1));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, bob.pkh)).to.be.bignumber.equal(new BigNumber(1));
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        await utils.setProvider(bob.sk);
        await fa12contract.transfer({from: bob.pkh, destination_pair: {to: admin.pkh, value: new BigNumber(1)}});
    });
});

describe("FA12 generic update allowances test cases", () => {
    
    before("setup", async () => {
        utils = new Utils();
        await utils.init(admin.sk);
        fa12contract = await FA12.init(env.fa12contract, utils.tezos);
        fa12contract.updateStorage();
        fa12testlib = new FA12testlib(fa12contract, utils);
        await fa12testlib.initState();
    });

    it("#1 - Admin adds Alice as an operator and changes her allowance back to zero in a second transaction", async () => {
        // Expected result: succeed

        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(1)});
        
        expect(await fa12contract.fa12specifics.getAllowance(fa12contract, admin.pkh, alice.pkh)).to.be.bignumber.equal(new BigNumber(1));
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        
        expect(await fa12contract.fa12specifics.getAllowance(fa12contract, admin.pkh, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));
    });

    it("#2 - Admin attempts an unsafe allowance change on Alice, changing from 2 to 1 without first changing to 0", async () => {
        //Expected result: fail, returning error message "UnsafeAllowanceChange"
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(2)});
        
        await rejects(fa12contract.approve({spender: alice.pkh, value: new BigNumber(1)}), (err, Error) => {
            expect(JSON.parse(err.message)["args"][0]["string"]).to.equal(FA12Errors.FA12_UNSAFE_ALLOWANCE_CHANGE);

            return true;
        });
        
        await utils.setProvider(admin.sk);
        await fa12contract.approve({spender: alice.pkh, value: new BigNumber(0)});
        
        expect(await fa12contract.fa12specifics.getAllowance(fa12contract, admin.pkh, alice.pkh)).to.be.bignumber.equal(new BigNumber(0));
    });
});

describe("FA12 test getBalance and getTotalSupply", () => {
    
    before("setup", async () => {
        utils = new Utils();
        await utils.init(admin.sk);
        fa12contract = await FA12.init(env.fa12contract, utils.tezos);
        fa12contract.updateStorage();
        fa12testlib = new FA12testlib(fa12contract, utils);
        await fa12testlib.initState();
    });

    it("#1 - Testing that getBalance returns the correct balance for admin", async () => {
        // Expected result: succeed

        await utils.setProvider(admin.sk);
        
        expect(await fa12contract.fa12specifics.getBalance(fa12contract, admin.pkh)).to.be.bignumber.equal(new BigNumber(baseTokenAmount));
    });

    it("#2 - Testing that getTotalSupply returns the correct balance for admin", async () => {
        // Expected result: succeed

        await utils.setProvider(admin.sk);
        
        expect(await fa12contract.fa12specifics.getTotalSupply(fa12contract)).to.be.bignumber.equal(new BigNumber(baseTokenAmount));
    });

});