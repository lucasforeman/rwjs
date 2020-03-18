
import {Chunk, ChunkType} from "../chunk.class";

export class NodeName extends Chunk {

    value: string;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        this.value = this.buffer.slice(12).toString('utf-8');

    }

}
