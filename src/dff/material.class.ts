import {Chunk, ChunkType} from "../chunk.class";
import {Texture} from "./texture.class";

export class MaterialStruct extends Chunk {

    flags: number;
    color: number[];
    isTextured: boolean;
    ambient: number;
    specular: number;
    diffuse: number;

    constructor(buffer: Buffer, parent?: any) {

        super(buffer, parent);

        this.flags = this.buffer.readUInt32LE(12);

        this.color = [
            this.buffer.readUInt8(16),
            this.buffer.readUInt8(17),
            this.buffer.readUInt8(18),
            this.buffer.readUInt8(19),
        ];

        this.isTextured = Boolean(this.buffer.readUInt32LE(24));

        this.ambient = this.buffer.readUInt32LE(28);
        this.specular = this.buffer.readUInt32LE(32);
        this.diffuse = this.buffer.readUInt32LE(36);

    }

}

export class Material extends Chunk {

    struct: MaterialStruct;
    texture: Texture;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        this.texture = children.find(child => child.type === ChunkType.TEXTURE);

    }

}
