import {Clump} from "../dff/clump.class";
import {RWFile} from "../rwfile.class";

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

    export(path: string) {
        if (!this.textureDictionary) {
            return false;
        }

        this.textureDictionary.textureNatives.forEach(native => {
            if (native.raster) {
                if (!fs.existsSync(`${path}`)) {
                    fs.mkdirSync(`${path}`, {recursive: true});
                }
                native.raster.pack().pipe(fs.createWriteStream(`${path}/${native.struct.name}.png`))
            }
        })
    }

}
