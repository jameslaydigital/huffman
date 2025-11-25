import assert from "node:assert";
import BitStream from "./BitStream.js";
import MinHeap from "./MinHeap.js";

const nullbyte = String.fromCharCode(0);

export default class Huffman {

    constructor(input) {
        this.input = input;
    }

    static frequencies(input) {
        const symbols = new Map();
        for (const symbol of input) {
            if (symbols.has(symbol)) {
                symbols.set(symbol, symbols.get(symbol) + 1);
            } else {
                symbols.set(symbol, 1);
            }
        }

        const heap = new MinHeap();
        for (const [symbol, frequency] of symbols) {
            heap.insert({symbol, frequency});
        }
        return heap;
    }

    static tree(frequencies) {
        while (frequencies.size() > 1) {
            const a = frequencies.pop();
            const b = frequencies.pop();
            const sum = a.frequency + b.frequency;
            const parent = {
                '0': a,
                '1': b,
                symbol: nullbyte,
                frequency: sum,
            };
            frequencies.insert(parent);
        }
        return frequencies.pop();
    }

    static codebook(tree, code="", table={}) {
        // traverse the tree and generate the "code table",
        // which is the mapping of symbol to bit-code.

        if (tree.symbol !== nullbyte) {
            // this is a leaf node
            table[tree.symbol] = new BitStream(code, code.length);
            return table;
        }

        if (tree['0']) {
            //code <<= 1;
            Huffman.codebook(tree['0'], code + "0", table);
        }
        if (tree['1']) {
            //code <<= 1;
            //code = code | 1;
            Huffman.codebook(tree['1'], code + "1", table);
        }

        return table;
    }

    static encode(input, codebook) {
        let output = new BitStream("", 0);
        for (const char of input) {
            output.conjoin(codebook[char]);
        }
        return output; // BitStream!
    }

    static decode(input, tree) {
        assert(input instanceof BitStream);
        assert(tree.hasOwnProperty("0"));
        assert(tree.hasOwnProperty("1"));
        assert(tree.hasOwnProperty("symbol"));

        let outstr = "";
        let node = tree;
        for (const index of input.biterate()) {
            assert(index === 0 || index === 1);

            node = node[index.toString()];

            if (node.symbol !== nullbyte) {
                // matched a leaf node,
                // put it in the outstr and reset the node to the tree.
                outstr += node.symbol;
                node = tree;
            }
        }

        return outstr;
    }

    static canonicalize(codebook) {
        // convert the codebook to a mapping of symbol to depth
        // which is used to derive the canonical huffman table

        const lentab = [];
        for (const [symbol, code] of Object.entries(codebook)) {
            assert(typeof symbol === "string");
            assert(code instanceof BitStream);
            lentab.push([symbol, code.bitcount()]); // is it this simple, really?
        }
        return lentab;
    }

    static decanonicalize(lentab) {
        // somehow we follow a standardized algorithm here to derive the "canonical huffman tree", which
        // is what's usually sent along with a deflated file.

        // 1. sort items by length, then lexicographically
        lentab.sort((a, b) => a[1] === b[1] ? (
            a[0].charCodeAt(0) - b[0].charCodeAt(0)
        ) : a[1] - b[1]);

        // 2. for each code
        const output = {};
        let code = 0;
        for (let i = 0; i < lentab.length; i++) {
            const [sym, len] = lentab[i];
            const next = lentab[i+1] ?? [0, len];
            const next_len = next[1];

            const code_value = code.toString(2).slice(-len).padStart(len, '0');
            output[sym] = new BitStream(code_value, len);

            const diff = next_len - len;
            code = (code + 1) << diff;
        }

        return output;
    }

    static treeFromCodebook(codebook) {
        // derive the tree
        // kind of a "mkdir -p" of all the codes
        const tree = {symbol: nullbyte};
        for (const [symbol, code] of Object.entries(codebook)) {
            assert(code instanceof BitStream);

            let node = tree;

            // navigate and create the nodes along the way:
            for (const index of code.biterate()) {
                node[index] = node[index] ?? {
                    '0': null,
                    '1': null,
                    symbol: nullbyte,
                };
                node = node[index];
            }

            // set the symbol because we're at the end destination
            node.symbol = symbol;
        }

        return tree;
    }
}
