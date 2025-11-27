ROADMAP:
========

1. clean up the code (currently, it "works" but the code is hard to make sense of because of crazy naming issues and rigid design choices)
2. deserialize from raw byte stream.
3. encode canonical table in standard format
4. encode to binary sequence
5. try (en/de)coding the README (this file).
6. make it DEFLATE compatible, so it can be used in zip, pdf, etc...

## USAGE

```js

// calculate frequency table
const frequencies = Huffman.frequencies(input);

// generate a non-canonical tree from the frequencies
const tree = Huffman.tree(frequencies);

// generate a non-canonical codebook from the frequencies
const codebook = Huffman.codebook(tree);

// serialize the huffman tree to the "canonical" representation
// this is what will be written to the DEFLATE streams and the like.
const canonicalized = Huffman.canonicalize(codebook);

// create the canonical codebook - the mapping of huffman code to bitcodes,
// this is what is used to encode a stream
const canonicalCodeBook = Huffman.decanonicalize(canonicalized);

// derive the canonical tree from the canonical codebook
// this is what is used to decode a stream
const canonicalTree = Huffman.treeFromCodebook(canonicalCodeBook);

// get a bitstream that can be written to disk (or somewhere)
const encodedBitStream = Huffman.encode(input, canonicalCodeBook);

// decode a bitstream
const decoded = Huffman.decode(encodedBitStream, canonicalTree);

```
