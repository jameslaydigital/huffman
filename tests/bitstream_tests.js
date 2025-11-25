import assert from "node:assert";
import BitStream from "../BitStream.js";


const test_buffer = BitStream.bit_string_to_buffer("0001000110001000");
assert(test_buffer[0] === parseInt("10001000", 2));
assert(test_buffer[1] === parseInt("00010001", 2));
console.info("pass buffer conversion");

// remember - "1010" is 0b0101 because we process the bytes starting with least
// significant bit - so 0b0101, the 1 on the right comes out first, resulting
// in "1010". It's just easier on the hardware - and I'm pretty sure it's how
// pkzip works.
const bs = new BitStream("1010", 4);
assert(bs.bitcount() === 4);
console.info("pass bitcount");

assert(bs.buffer[0] === 0b0101);
console.info("pass buffer value test");

assert(bs.toString() === "1010");
console.info("pass toString conversion");

bs.pushBit(1);
assert(bs.bitcount() === 5);
console.info("pass pushBit bitcount inc");

// console.log("tostring is ", bs.toString());
assert(bs.toString() === "10101");
console.info("pass bs.toString() after pushBit(1)");

bs.pushBit(0);
assert(bs.bitcount() === 6);
console.info("pass 2nd pushBit bitcount inc");

assert(bs.toString() === "101010");
console.info("pass bs.toString() after pushBit(0)");

bs.pushBit(1);
bs.pushBit(1);
assert(bs.bitcount() === 8);
console.info("pass bitcount at byte boundary");

console.log("real: 0b%s", bs.buffer[0].toString(2));
assert(bs.toString() === "10101011");
console.info("pass toSTring at byte boundary");

const other = new BitStream("1111", 4);
//console.log("other tostring (should be 1111): ", other.toString());

assert("before realloc" && (other.toString() === "1111"));
console.info("pass toString on init for 'other' bit stream");

other.realloc(5);
assert("after realloc" && (other.toString() === "1111"));
console.info("pass toString after large realloc");

bs.conjoin(other);

// console.log("bitcount should be 10 but is %d", bs.bitcount());
assert(bs.bitcount() === 12);
console.info("pass bitcount after conjoin");

console.log("----bs.toString() = " + bs.toString());
assert(bs.toString() === "101010111111");
console.info("pass toString after conjoin");

let output = "";
for (const bit of bs.biterate()) {
    assert(typeof bit === "number");
    output += bit.toString();
}
assert(output === "101010111111");

// now we gotta test the realloc behavior
console.info("pass!");
