import {Chunk, ChunkType} from "../chunk.class";
import {MaterialList} from "./material_list.class";
import {Skin} from "./skin.class";
import {BinMesh} from "./bin_mesh.class";

enum GeometryFlags {
    ISSTRIP = 0x00000001,
    PRELIT = 0x00000008,
    TEXTURED = 0x00000004,
    TEXTURED2 = 0x00000080,
    NATIVE = 0x01000000,
}

export class GeometryStruct extends Chunk {

    format: number;
    triangleCount: number;
    vertexCount: number;
    morphTargetCount: number;

    texSetCount: number;
    textureCoords: any[] = [];

    triangles: any[] = [];

    vertexColors: any[] = [];

    morphTargets: any[] = [];

    boundingSphere: {
        x: number;
        y: number;
        z: number;
        radius: number;
    };

    hasVertices: boolean;
    hasNormals: boolean;
    vertices: any[] = [];
    normals: any[] = [];

    isStrip: boolean;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        this.format = this.buffer.readUInt32LE(12);
        this.triangleCount = this.buffer.readUInt32LE(16);
        this.vertexCount = this.buffer.readUInt32LE(20);
        this.morphTargetCount = this.buffer.readUInt32LE(24);

        this.texSetCount = (this.format & 0x00FF0000) >> 16;

        this.isStrip = Boolean(this.format & GeometryFlags.ISSTRIP);

        let offset = 28;

        if (!(this.format & GeometryFlags.NATIVE)) {

            if (this.format & GeometryFlags.PRELIT) {
                for (let i = 0; i < this.vertexCount; i++) {
                    this.vertexColors.push({
                        r: this.buffer.readUInt8(offset),
                        g: this.buffer.readUInt8(offset + 1),
                        b: this.buffer.readUInt8(offset + 2),
                        a: this.buffer.readUInt8(offset + 3)
                    });
                    offset += 4;
                }
            }

            if (this.format & (GeometryFlags.TEXTURED | GeometryFlags.TEXTURED2)) {

                for (let i = 0; i < (this.texSetCount * this.vertexCount); i++) {
                    this.textureCoords.push({
                        u: this.buffer.readFloatLE(offset),
                        v: this.buffer.readFloatLE(offset + 4)
                    });
                    offset += 8;
                }

            }

            for (let i = 0; i < this.triangleCount; i++) {
                this.triangles.push({
                    vertIndex1: this.buffer.readUInt16LE(offset),
                    vertIndex0: this.buffer.readUInt16LE(offset + 2),
                    materialId: this.buffer.readUInt16LE(offset + 4),
                    vertIndex2: this.buffer.readUInt16LE(offset + 6),
                });
                offset += 8;
            }

            // console.log(this.triangles.map(t => t.materialId).join(','));
        }

        this.boundingSphere = {
            x: this.buffer.readFloatLE(offset),
            y: this.buffer.readFloatLE(offset + 4),
            z: this.buffer.readFloatLE(offset + 8),
            radius: this.buffer.readFloatLE(offset + 12),
        };

        this.hasVertices = Boolean(this.buffer.readUInt32LE(offset + 16));
        this.hasNormals = Boolean(this.buffer.readUInt32LE(offset + 20));

        offset += 24;

        if (this.hasVertices) {
            for (let i = 0; i < this.vertexCount; i++) {
                this.vertices.push({
                    x: this.buffer.readFloatLE(offset),
                    y: this.buffer.readFloatLE(offset + 4),
                    z: this.buffer.readFloatLE(offset + 8),
                });
                offset += 12;
            }
        }

        if (this.hasNormals) {
            for (let i = 0; i < this.vertexCount; i++) {
                this.normals.push({
                    x: this.buffer.readFloatLE(offset),
                    y: this.buffer.readFloatLE(offset + 4),
                    z: this.buffer.readFloatLE(offset + 8),
                });
                offset += 12;
            }
        }

    }

}

export class Geometry extends Chunk {

    struct: GeometryStruct;
    materialList: MaterialList;

    binMesh: BinMesh | undefined;

    skin: Skin | undefined;


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        this.materialList = children.find(child => child.type === ChunkType.MATERIAL_LIST);

        if(this.skin) {
            this.skin.load();
        }

        // console.log(children.find(c => c.type === 3).getChildren().map(c => c.type.toString(16)));

    }

}
