class MinHeap {
    constructor() {
        this.values = [];
    }

    size() {
        return this.values.length;
    }

    insert(newval) {
        if (typeof newval.frequency === "undefined") {
            throw new TypeError("insert must receive an object with a frequency");
        }
        this.values.push(newval);

        // sort by frequency first, then by ordinal
        this.values.sort((a, b) => b.frequency === a.frequency ? (
            b.symbol.charCodeAt(0) - a.symbol.charCodeAt(0)
        ) : b.frequency - a.frequency);
    }

    pop() {
        return this.values.pop();
    }
}

class Huffman {

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
                symbol: String.fromCharCode(0),
                frequency: sum,
            };
            frequencies.insert(parent);
        }
        return frequencies.pop();
    }

    static codebook(tree, code="", table={}) {
        // traverse the tree and generate the "code table",
        // which is the mapping of symbol to bit-code.

        if (tree.symbol !== String.fromCharCode(0)) {
            // this is a leaf node
            table[tree.symbol] = code;
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
        let output = "";
        for (const char of input) {
            output += codebook[char];
        }
        return output;
    }

    static decode(input, tree) {
        let output = "";
        let node = tree;
        for (const index of input) {
            node = node[index];
            if (node.symbol !== String.fromCharCode(0)) {
                // matched a leaf node,
                // put it in the output and reset the node to the tree.
                output += node.symbol;
                node = tree;
            }
        }
        return output;
    }

    static canonicalize(codebook) {
        // convert the codebook to a mapping of symbol to depth
        // which is used to derive the canonical huffman table

        const output = [];
        for (const [symbol, code] of Object.entries(codebook)) {
            output.push([symbol, code.length]); // is it this simple, really?
        }
        return output;
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

            output[sym] = code.toString(2).slice(-len).padStart(len, '0');
            const diff = next_len - len;
            code = (code + 1) << diff;
        }

        return output;
    }

    static treeFromCodebook(codebook) {
        // derive the tree
        // kind of a "mkdir -p" of all the codes
        const tree = {};
        for (const [symbol, code] of Object.entries(codebook)) {
            let node = tree;

            // navigate and create the nodes along the way:
            for (const index of code) {
                node[index] = node[index] ?? {
                    '0': null,
                    '1': null,
                    symbol: String.fromCharCode(0),
                };
                node = node[index];
            }

            // set the symbol because we're at the end destination
            node.symbol = symbol;
        }
        return tree;
    }
}

let input = `
Hello there, my name is James and I am writing a zip file generator.
At some point, I'll also probably wanna write a zip file decompressor, but that's in the near future.

Okay, so the first goal here is to compress this input string, then decompress it to 
arrive at the same result.

Technically, having done just that is successfully considered a huffman encoder.

After that, it's just layers!
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

const encoded = Huffman.encode(input, canonicalCodeBook);
console.log("encoded: %s", encoded);

const decoded = Huffman.decode(encoded, canonicalTree);
console.log("decoded: %s", decoded);
 
// // TODO - last step is to get the canonical tree back from the canonical code table!
// // go look at the function stub for `treeFromCodebook`
// // and then rewrite the following functions to use the canonical book and tree
// // instead of the original ones.
// // Actually, then the last step is to actually encode and decode from binary -
// // then this becomes a legit util that can actually compress stuff.
//         // make it more efficient! make it zip-compatible!
//         // make it do actual byte-per-byte compression, btw - use Uint8Arrays.
//         // run it from the browser! go cray-cray!
// 
// console.log("input length: %d", input.length);
// console.log("encoded length: %d", encoded.length / 8);
// console.log("compressed to %d% of original size", Math.floor(((encoded.length/8) / input.length) * 100));
