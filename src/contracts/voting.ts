import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    toByteString,
    fill,
    fromByteString
} from 'scrypt-ts'

import type { ByteString, FixedArray } from 'scrypt-ts';

export type Name = ByteString

export type Candidate = {
    name: Name,
    votesRecieved: bigint
}

export const N = 2


export class Voting extends SmartContract {
    @prop(true)
    candidates: FixedArray<Candidate, typeof N>

    constructor(names: FixedArray<Name, typeof N>) {
        super(...arguments)
        this.candidates = fill({
            name: toByteString(''),
            votesRecieved: 0n
        }, N)
        for (let i = 0; i < N; i++) {
            this.candidates[i] = {
                name: names[i],
                votesRecieved: 0n
            }
        }
    }

    @method()
    public vote(name: Name) {
        for (let i = 0; i < N; i++) {
            if (this.candidates[i].name == name) {
                this.candidates[i].votesRecieved += 1n
            }
        }

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput()
        }
        console.log(this.ctx.version)
        console.log(this.ctx.utxo)
        console.log(this.ctx.hashPrevouts)
        console.log(this.ctx.hashSequence)
        console.log(this.ctx.sequence)
        console.log(this.ctx.hashOutputs)
        console.log(this.ctx.locktime)
        console.log(this.ctx.sigHashType)
        console.log(this.ctx.serialize())
        console.log("")
        console.log(this.ctx)

        assert(true, 'invalid HashOutputs')
    }
}
