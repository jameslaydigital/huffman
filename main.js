import assert from "node:assert";
import Huffman from "./Huffman.js";

let input = `
Hello there, my name is James and I am writing a zip file generator.
At some point, I'll also probably wanna write a zip file decompressor, but that's in the near future.

Okay, so the first goal here is to compress this input string, then decompress it to 
arrive at the same result.

Technically, having done just that is successfully considered a huffman encoder.

Which I've already done, actually.

So, now the point is to canonically encode the huffman table so that we can
encode and decode with the EXACT same tree.  Using the canonical representation
may produce a different tree, but it will be guaranteed to have the exact same
effect.  However, the canonical code table can be represented simply using a
symbol-to-length mapping, which can be encoded in the smallest amount of space.
This allows us to send all the info needed to deflate a stream with the minimal
amount of space.

And the good news is — that part is done!

Here's what's left:

1. use actual bit encodings instead of string representations.
2. support unicode by operating on byte streams instead of JS strings.
3. follow the deflate stream standard, encoding the huffman table into the payload as would be expected by PDF, pkzip, or gzip.

`;

//input = `aaaabcccddef`;

const frequencies = Huffman.frequencies(input);
//console.log("frequencies: ", frequencies);

const tree = Huffman.tree(frequencies);
//console.log("tree", JSON.stringify(tree, null, 8));

const codebook = Huffman.codebook(tree);
//console.log("symbol table: ", codebook);

const canonicalized = Huffman.canonicalize(codebook);
//console.log("canonicalized: ", canonicalized);

const canonicalCodeBook = Huffman.decanonicalize(canonicalized);
//console.log("canonicalCodeBook: ", canonicalCodeBook);

const canonicalTree = Huffman.treeFromCodebook(canonicalCodeBook);
//console.log("canonicalTree: ", JSON.stringify(canonicalTree, null, 4));

const encodedBitStream = Huffman.encode(input, canonicalCodeBook);
console.log("encoded: %s", encodedBitStream.toString());

const decoded = Huffman.decode(encodedBitStream, canonicalTree);
console.log("decoded: %s", decoded);
 
// // Actually, then the last step is to actually encode and decode from binary -
// // then this becomes a legit util that can actually compress stuff.
//         // make it more efficient! make it zip-compatible!
//         // make it do actual byte-per-byte compression, btw - use Uint8Arrays.
//         // run it from the browser! go cray-cray!
// 
// console.log("input length: %d", input.length);
// console.log("encoded length: %d", encoded.length / 8);
// console.log("compressed to %d% of original size", Math.floor(((encoded.length/8) / input.length) * 100));
