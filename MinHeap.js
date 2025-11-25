import assert from "node:assert";
export default class MinHeap {
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
