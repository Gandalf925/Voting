import { type } from 'os';
import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    SigHash,
    toByteString,
    fill
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
    public vote() {

    }
}
