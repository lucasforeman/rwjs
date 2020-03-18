import {Chunk, ChunkType} from "../chunk.class";

export class TextureStruct extends Chunk {

    filterMask: number;
    uAddressing: number;
    vAddressing: number;
    mipMaps: boolean;

    constructor(buffer: Buffer, parent?: any) {

        super(buffer, parent);

        let piece = this.buffer.readUInt32LE(12);

        this.filterMask = piece & 0x000000FF;
        this.uAddressing = piece & 0x00000F00 >> 8;
        this.vAddressing = piece & 0x0000F000 >> 12;
        this.mipMaps = Boolean(piece & 0x000F0000 >> 16);

    }

}

export class Texture extends Chunk {

    struct: TextureStruct;
    name: string;
    maskName: string;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        let strings = children.filter(child => child.type === ChunkType.STRING);
        this.name = strings[0].value;
        this.maskName = strings[1].value;

    }

}
