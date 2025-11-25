import assert from "node:assert";
import Huffman from "./Huffman.js";

let input = `hello world lllllllllllllllll hi llll that's a lot of "l"s. lllllllllll this should compress better the more I repeat byte, such as lllllllllll.`;

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
 
