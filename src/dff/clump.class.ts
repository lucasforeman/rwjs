import {Chunk, ChunkType} from "../chunk.class";
import {FrameList} from "./frame_list.class";
import {GeometryList} from "./geometry_list.class";
import {Atomic} from "./atomic.class";

export class ClumpStruct extends Chunk {

    atomicsCount: number;
    lightsCount: number;
    camerasCount: number;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);
        this.atomicsCount = this.buffer.readUInt32LE(12);
        this.lightsCount = this.buffer.readUInt32LE(16);
        this.camerasCount = this.buffer.readUInt32LE(20);
    }

}

export class Clump extends Chunk {

    struct: ClumpStruct;
    frameList: FrameList;
    geometryList: GeometryList;
    atomics: Atomic[];


    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);
        this.frameList = children.find(child => child.type === ChunkType.FRAME_LIST);
        this.geometryList = children.find(child => child.type === ChunkType.GEOMETRY_LIST);
        this.atomics = children.filter(child => child.type === ChunkType.ATOMIC);

    }

    export(): any {

        let geometries = this.geometryList.geometries.map(geometry => {
            return {
                vertices: geometry.struct.vertices.map((vertex, index) => {
                    return [
                        [vertex.x, vertex.y, vertex.z],
                        !geometry.struct.hasNormals ? [] :
                            [
                                geometry.struct.normals[index].x,
                                geometry.struct.normals[index].y,
                                geometry.struct.normals[index].z,
                            ],
                        !geometry.struct.vertexColors.length ? [] :
                            [
                                geometry.struct.vertexColors[index].r,
                                geometry.struct.vertexColors[index].g,
                                geometry.struct.vertexColors[index].b,
                                geometry.struct.vertexColors[index].a
                            ]
                    ];
                }),
                indices: geometry.struct.triangles.map((triangle, index) => {
                    return [
                        triangle.vertIndex0,
                        triangle.vertIndex1,
                        triangle.vertIndex2,
                        triangle.materialId
                    ]
                }),
                uv: geometry.struct.textureCoords.map(tc => {
                    return [tc.u, tc.v];
                }),
                materials: geometry.materialList.materials.map(material => {
                    return {
                        texture: material.texture ? {
                            name : material.texture.name
                        } : null
                    }
                }),
                binMesh: !geometry.binMesh ? {} : {
                    meshes: geometry.binMesh.meshes
                },
                isStrip: geometry.struct.isStrip
            }
        });

        let atomics = this.atomics.map((atomic) => {
            return [atomic.struct.frameIndex, atomic.struct.geometryIndex]
        });

        let frames = this.frameList.frames.map((frame, index) => {
            return {
                id: frame.index,
                name: this.frameList.frameNames[index],
                rot: frame.rotationMatrix,
                pos: frame.position
            }
        });

        /*console.log(clump.atomics.map(a => [
            a.struct.frameIndex,
            a.struct.geometryIndex,
            clump.frameList.frameNames[a.struct.frameIndex],
            clump.geometryList.geometries[a.struct.geometryIndex].struct.vertexCount
        ]));*/

        return {
            geometries: geometries,
            atomics: atomics,
            frames: frames
        };

    }

}
