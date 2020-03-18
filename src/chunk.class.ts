
export enum ChunkType {
    STRUCT = 1,
    STRING = 2,
    EXTENSION = 3,
    TEXTURE = 6,
    MATERIAL = 7,
    MATERIAL_LIST = 8,
    FRAME_LIST = 14,
    GEOMETRY = 15,
    CLUMP = 16,
    GEOMETRY_LIST = 26,
    ATOMIC = 20,

    TEXTURE_NATIVE = 21,
    TEXTURE_DICTIONARY = 22,

    BIN_MESH = 0x50e,
    SKIN = 0x0116,
    NODE_NAME = 0x0253F2FE
}

export class Chunk {

    type: ChunkType;
    size: number;
    stamp: number;

    buffer: Buffer;

    parent: any;

    constructor(buffer: Buffer, parent?: any) {

        this.type = buffer.readUInt32LE(0);
        this.size = buffer.readUInt32LE(4);
        this.stamp = buffer.readUInt32LE(8);

        this.buffer = buffer;
        this.parent = parent;

    }

    getChildren(atOffset: number = 12): any[] {

        const children = [];

        let offset = atOffset;

        do {


            const childInfo = {
                type: this.buffer.readUInt32LE(offset),
                size: this.buffer.readUInt32LE(offset + 4),
                stamp: this.buffer.readUInt32LE(offset + 8)
            };

            const childBuffer = this.buffer.slice(offset, offset + 12 + childInfo.size);

            if (!childInfo.type) {
                throw new Error(`Couldn't find a chunk at offset ${offset}`);
            }

            if (!childInfo.size) {
                //throw new Error(`Child at offset ${offset} has zero size`);
            }

            if (childInfo.size) {
                const child = this.createChild(childInfo.type, this.type, childBuffer);

                if(child) {
                    children.push(child);
                    offset += child.size;
                }
            }

            offset += 12;

        } while (offset < this.size);

        return children;

    }

    createChild(type: ChunkType, parentType: ChunkType, buffer: Buffer): Chunk | void {

        const ClassReferences: any = {
            [ChunkType.FRAME_LIST]: FrameList,
            [ChunkType.GEOMETRY_LIST]: GeometryList,
            [ChunkType.ATOMIC]: Atomic,
            [ChunkType.EXTENSION]: Extension,
            [ChunkType.NODE_NAME]: NodeName,
            [ChunkType.GEOMETRY]: Geometry,
            [ChunkType.MATERIAL_LIST]: MaterialList,
            [ChunkType.MATERIAL]: Material,
            [ChunkType.TEXTURE]: Texture,
            [ChunkType.STRING]: String,
            [ChunkType.BIN_MESH]: BinMesh,
            [ChunkType.SKIN]: Skin,
            [ChunkType.TEXTURE_DICTIONARY]: TextureDictionary,
            [ChunkType.TEXTURE_NATIVE]: TextureNative,
            [ChunkType.STRUCT]: {
                [ChunkType.FRAME_LIST]: FrameListStruct,
                [ChunkType.CLUMP]: ClumpStruct,
                [ChunkType.GEOMETRY_LIST]: GeometryListStruct,
                [ChunkType.ATOMIC]: AtomicStruct,
                [ChunkType.GEOMETRY]: GeometryStruct,
                [ChunkType.MATERIAL_LIST]: MaterialListStruct,
                [ChunkType.MATERIAL]: MaterialStruct,
                [ChunkType.TEXTURE]: TextureStruct,
                [ChunkType.TEXTURE_DICTIONARY]: TextureDictionaryStruct,
                [ChunkType.TEXTURE_NATIVE]: TextureNativeStruct,
            }
        };

        if (type === ChunkType.STRUCT && ClassReferences[ChunkType.STRUCT][parentType]) {

            return new ClassReferences[ChunkType.STRUCT][parentType](buffer, this);

        } else if (ClassReferences[type] && type !== ChunkType.STRUCT) {

            return new ClassReferences[type](buffer, this);

        } else {

            return new Chunk(buffer, this);

        }

    }

}

import {String} from './dff/string.class';
import {Extension} from "./dff/extension.class";
import {Texture, TextureStruct} from "./dff/texture.class";
import {ClumpStruct} from "./dff/clump.class";
import {FrameList, FrameListStruct} from "./dff/frame_list.class";
import {Atomic, AtomicStruct} from "./dff/atomic.class";
import {NodeName} from "./dff/node_name.class";
import {Geometry, GeometryStruct} from "./dff/geometry.class";
import {GeometryList, GeometryListStruct} from "./dff/geometry_list.class";
import {MaterialList, MaterialListStruct} from "./dff/material_list.class";
import {Material, MaterialStruct} from "./dff/material.class";
import {BinMesh} from "./dff/bin_mesh.class";
import {Skin} from "./dff/skin.class";
import {TextureDictionary, TextureDictionaryStruct} from "./txd/texture_dictionary.class";
import {TextureNative, TextureNativeStruct} from "./txd/texture_native.class";
