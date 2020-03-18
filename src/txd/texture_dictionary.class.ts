import {Chunk, ChunkType} from "../chunk.class";
import {TextureNative} from "./texture_native.class";

export class TextureDictionaryStruct extends Chunk {

    textureCount: number;
    deviceId: number;

    constructor(buffer: Buffer, parent?: any) {

        super(buffer, parent);

        this.textureCount = this.buffer.readUInt16LE(12);
        this.deviceId = this.buffer.readUInt16LE(14);

    }

}

export class TextureDictionary extends Chunk {

    struct: TextureDictionaryStruct;
    textureNatives: TextureNative[];

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);
        this.textureNatives = children.filter(child => child.type === ChunkType.TEXTURE_NATIVE);

    }

}
