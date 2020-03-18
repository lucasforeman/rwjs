import {Chunk, ChunkType} from "../chunk.class";

export class AtomicStruct extends Chunk {

    frameIndex: number;
    geometryIndex: number;
    flags: number;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);
        this.frameIndex = this.buffer.readUInt32LE(12);
        this.geometryIndex = this.buffer.readUInt32LE(16);
        this.flags = this.buffer.readUInt32LE(20);
    }

}

export class Atomic extends Chunk {

    struct: AtomicStruct;


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

    }

}
