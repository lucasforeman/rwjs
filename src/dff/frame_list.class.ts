import {Chunk, ChunkType} from "../chunk.class";
import {Extension} from "./extension.class";

export class FrameListStruct extends Chunk {

    frameCount: number;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);
        this.frameCount = this.buffer.readUInt32LE(12);

        for(let i = 0; i < this.frameCount; i++) {
            const offset = 16 + (56 * i);
            this.parent.frames.push({
                rotationMatrix: [
                    [
                        this.buffer.readFloatLE(offset),
                        this.buffer.readFloatLE(offset + 4),
                        this.buffer.readFloatLE(offset + 8),
                    ],
                    [
                        this.buffer.readFloatLE(offset + 12),
                        this.buffer.readFloatLE(offset + 16),
                        this.buffer.readFloatLE(offset + 20),
                    ],
                    [
                        this.buffer.readFloatLE(offset + 24),
                        this.buffer.readFloatLE(offset + 28),
                        this.buffer.readFloatLE(offset + 32),
                    ]
                ],
                position: [
                    this.buffer.readFloatLE(offset + 36),
                    this.buffer.readFloatLE(offset + 40),
                    this.buffer.readFloatLE(offset + 44),
                ],
                index: this.buffer.readInt32LE(offset + 48),
                flags: this.buffer.readUInt32LE(offset + 52)
            })
        }
    }

}

export class FrameList extends Chunk {

    struct: FrameListStruct;
    extensions: Extension[];

    frames: {

        rotationMatrix: number[][];
        position: number[];
        index: number;
        flags: number;

    }[] = [];

    frameNames: string[] = [];


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);
        this.extensions = children.filter(child => child.type === ChunkType.EXTENSION);

    }

}
