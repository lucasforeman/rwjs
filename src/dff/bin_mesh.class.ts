import {Chunk} from "../chunk.class";

interface Mesh {
    indexCount: number;
    materialIndex: number;
    indices: number[]
}

export class BinMesh extends Chunk {

    flags: number;
    meshCount: number;
    indexCount: number;

    meshes: Mesh[] = [];

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        this.flags = this.buffer.readUInt32LE(12);
        this.meshCount = this.buffer.readUInt32LE(16);
        this.indexCount = this.buffer.readUInt32LE(20);

        let offset = 24;


        for (let i = 0; i < this.meshCount; i++) {


            const mesh = {
                indexCount: this.buffer.readUInt32LE(offset),
                materialIndex: this.buffer.readUInt32LE(offset + 4),
                indices: [] as any
            };

            offset += 8;

            for (let j = 0; j < mesh.indexCount; j++) {
                mesh.indices.push(this.buffer.readUInt32LE(offset));
                offset += 4;
            }

            this.meshes.push(mesh);

        }



    }

}
