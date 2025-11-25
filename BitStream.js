import assert from "node:assert";
// great! now all you need to do is implement these in terms of actual bytes in
// a uint8array.

export default class BitStream {

    constructor(input, nbits) {
        assert(typeof input === "string" || input instanceof BitStream);
        assert(nbits === input.length); // canary in the coal mine
        this.buffer = [...input.toString()];
    }

    get length() {
        throw new Error("can't call length on bitstream");
    }

    bitcount() {
        return this.buffer.length;
    }

    conjoin(other) {
        assert(other instanceof BitStream);
        this.buffer = [...this.buffer, ...other.toString()];
    }

    *biterate() {
        for (const char of this.buffer) {
            yield parseInt(char);
        }
    }

    toString() {
        return this.buffer.join("");
    }
}

/// TODO - run a suite of tests on this bitstream so we can find out why it's not working as expected...
//class BitStream {
//    constructor(input, nbits) {
//        assert(typeof input === "string" || input instanceof BitStream);
//        const target_bytes = Math.floor(nbits / 8) + 1;
//        this.bytes = 512;
//        while (this.bytes < target_bytes) {
//            this.bytes <<= 1;
//        }
//        this.nbits = nbits;
//        this.buffer = new Uint8Array(this.bytes);
//        // copy the string byte-data over:
//        let tmp = typeof input === "string" ?
//            new TextEncoder().encode(input) :
//            input.buffer;
//        this.buffer.set(tmp, 0);
//    }
//
//    bitcount() {
//        return this.nbits;
//    }
//
//    conjoin(other) {
//        // because we're talking about joining two arbitrary bitstreams,
//        // this is going to be more complicated.
//        //
//        // * the left bitstream can be left alone, more or less
//        // * the simplest approach is to stream in one bit at a time.
//        // * but that's awful for performance.
//        // * let's just start there...
//
//        for (const bit of other.biterate()) {
//            // omg this is gonna be horrible for performance.
//            // pls consider using an intermediate buffer that 
//            // leverages 32 or 64 bits at a time.
//            this.pushBit(bit);
//        }
//    }
//
//    /// double the allocated size every time we hit the wall:
//    realloc(length) {
//        length = length ?? (Math.floor(this.nbits / 8) + 1);
//        let newlength = this.bytes;
//        while (newlength < length) {
//            newlength <<= 1;
//        }
//
//        const newbuff = new Uint8Array(newlength);
//        newbuff.set(this.buffer, this.bytes);
//        this.buffer = newbuff;
//        this.bytes = newlength;
//        // hope we didn't run out of memory!
//    }
//
//    lastByteOffset(addtnl_bit_offset=0) {
//        const nbits = this.nbits + addtnl_bit_offset;
//        return Math.floor(nbits / 8) + (nbits % 8 === 0 ? 0 : 1);
//    }
//
//    pushBit(bit) {
//        assert(bit === 0 || bit === 1);
//        const last_byte = this.lastByteOffset(1);
//        while (last_byte >= this.bytes) {
//            this.realloc();
//        }
//        
//        this.nbits += 1;
//        const bit_index = this.nbits % 8;
//        if (bit) {
//            this.buffer[last_byte] &= (1 << bit_index);
//        }
//    }
//
//    *biterate() {
//        let i = 0;
//        for (let offs = 0; offs < this.bytes; offs++) {
//            for (let bit = 0; bit < 8; bit++) {
//                if (i++ < this.nbits) {
//                    yield (this.buffer[offs] >> bit) & 1;
//                }
//            }
//        }
//    }
//
//    /// not performant, but should preserve the original behavior.
//    toString() {
//        let output = "";
//        for (const bit of this.biterate()) {
//            output += bit;
//        }
//        return output;
//    }
//}

