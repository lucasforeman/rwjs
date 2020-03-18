import {Chunk, ChunkType} from "../chunk.class";
import {Geometry} from "./geometry.class";

export class GeometryListStruct extends Chunk {

    geometryCount: number;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);
        this.geometryCount = this.buffer.readUInt32LE(12);
    }

}

export class GeometryList extends Chunk {

    struct: GeometryListStruct;

    geometries: Geometry[] = [];


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        this.geometries = children.filter(child => child.type === ChunkType.GEOMETRY);

    }

}
