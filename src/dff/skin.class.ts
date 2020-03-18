import {Chunk} from "../chunk.class";


export class Skin extends Chunk {

    boneCount: number;
    usedBoneCount: number;
    maxWeightsPerVertex: number;

    bonesUsed: number[] = [];

    vertexBoneIndices: number[][] = [];
    vertexBoneWeights: number[][] = [];

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        this.boneCount = this.buffer.readUInt8(12);
        this.usedBoneCount = this.buffer.readUInt8(13);
        this.maxWeightsPerVertex = this.buffer.readUInt8(14);


    }

    load() {

        let offset = 16;

        for(let i = 0; i < this.boneCount; i++) {
            this.bonesUsed.push(this.buffer.readUInt8(offset));
            offset++;
        }

        for(let i = 0; i < this.parent.parent.struct.vertexCount; i++) {

            this.vertexBoneIndices.push([
                this.buffer.readUInt8(offset),
                this.buffer.readUInt8(offset + 1),
                this.buffer.readUInt8(offset + 2),
                this.buffer.readUInt8(offset + 3),
            ]);

            offset+=4;

        }

        for(let i = 0; i < this.parent.parent.struct.vertexCount; i++) {

            this.vertexBoneWeights.push([
                this.buffer.readFloatLE(offset),
                this.buffer.readFloatLE(offset + 4),
                this.buffer.readFloatLE(offset + 8),
                this.buffer.readFloatLE(offset + 12),
            ]);

            offset+=16;

        }

    }

}
