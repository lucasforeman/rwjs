import {Chunk, ChunkType} from "../chunk.class";
import {Geometry} from "./geometry.class";
import {Material} from "./material.class";

export class MaterialListStruct extends Chunk {

    materialCount: number;
    indices: number[] = [];

    constructor(buffer: Buffer, parent?: any) {

        super(buffer, parent);
        this.materialCount = this.buffer.readUInt32LE(12);
        for(let i = 0; i < this.materialCount; i++) {
            this.indices.push(this.buffer.readInt32LE(16 + i * 4));
        }

    }

}

export class MaterialList extends Chunk {

    struct: MaterialListStruct;

    materials: Material[] = [];


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        this.materials = children.filter(child => child.type === ChunkType.MATERIAL);


    }

}
