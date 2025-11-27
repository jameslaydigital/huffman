import assert from "node:assert";
import Huffman from "../Huffman.js";
import { writeFile } from "fs/promises";

let input = `hello world lllllllllllllllll hi llll that's a lot of "l"s. lllllllllll this should compress better the more I repeat byte, such as lllllllllll.`;

const frequencies       = Huffman.frequencies(input);
const tree              = Huffman.tree(frequencies);
const codebook          = Huffman.codebook(tree);
const canonicalized     = Huffman.canonicalize(codebook);
const canonicalCodeBook = Huffman.decanonicalize(canonicalized);
const encodedBitStream  = Huffman.encode(input, canonicalCodeBook);
const canonicalTree     = Huffman.treeFromCodebook(canonicalCodeBook);

await writeFile("testfile.bts", encodedBitStream.buffer);
console.log("wrote 'testfile.bts'");

await writeFile("canonicalized.json", JSON.stringify(canonicalized));
console.log("wrote 'canonicalized.json'");

console.log("");
console.log("done!");
