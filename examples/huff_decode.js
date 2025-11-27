import assert from "node:assert";
import Huffman from "../Huffman.js";
import BitStream from "../BitStream.js";
import { readFile } from "fs/promises";

const canonicalized     = JSON.parse(await readFile("canonicalized.json"));
const canonicalCodeBook = Huffman.decanonicalize(canonicalized);
const canonicalTree     = Huffman.treeFromCodebook(canonicalCodeBook);
const encodedBitStream  = BitStream.fromBytes(new Uint8Array(await readFile("testfile.bts")));
const decoded           = Huffman.decode(encodedBitStream, canonicalTree);
console.log("decoded: %s", decoded);
