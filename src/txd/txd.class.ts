import { ExportType } from "../const/export-types";
import { Clump } from "../dff/clump.class";
import { RWFile } from "../rwfile.class";

const PNG = require("pngjs").PNG;
const fs = require('fs');

export class TXD extends RWFile {

    constructor() {
        super();
    }

    onLoaded() {
        if (!this.textureDictionary) {
            throw new Error('File is not a texture.');
        }
    }

    export(type: ExportType) {
        if (!this.textureDictionary) {
            return false;
        }

        const result = [];

        for (const native of this.textureDictionary.textureNatives) {
            if (!native.raster) {
                continue;
            }

            let fileName = native.struct.name + '.png';

            result.push({
                name: fileName,
                buffer: PNG.sync.write(native.raster)
            })
        }

        return result;
    }

}
