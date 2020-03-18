import * as fs from 'fs';
import {Clump} from './dff/clump.class';
import {ChunkType} from "./chunk.class";
import {TextureDictionary} from "./txd/texture_dictionary.class";

export class RWFile {

    clump?: Clump;
    textureDictionary?: TextureDictionary;

    constructor() {

    }

    fromFile(filename: string) {

        if (!fs.existsSync(filename)) {
            throw new Error('Invalid filename');
        }

        const fd = fs.openSync(filename, 'r');

        if (!fd) {
            throw new Error('Couldn\'t open the file');
        }

        const stat = fs.statSync(filename);


        const buffer = Buffer.alloc(stat.size);
        fs.readSync(fd, buffer, 0, stat.size, 0);

        return this.fromBuffer(buffer);

    }

    fromBuffer(buffer: Buffer) {

        const fileType = buffer.readUInt32LE(0);

        if (fileType === ChunkType.CLUMP) {
            this.clump = new Clump(buffer);
        } else if (fileType === ChunkType.TEXTURE_DICTIONARY) {
            this.textureDictionary = new TextureDictionary(buffer)
        } else {
            throw new Error('File is not a compatible RW Texture / Model');
        }

        this.onLoaded();

        return this;

    }

    onLoaded() {

    }

}
