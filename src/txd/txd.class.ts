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

    export(path: string, lowerCase: boolean = false) {
        if (!this.textureDictionary) {
            return false;
        }

        this.textureDictionary.textureNatives.forEach(native => {
            if (native.raster) {
                if (!fs.existsSync(`${path}`)) {
                    fs.mkdirSync(`${path}`, {recursive: true});
                }
                let fileName = native.struct.name;
                if (lowerCase) {
                    fileName = fileName.toLowerCase();
                }
                native.raster.pack().pipe(fs.createWriteStream(`${path}/${fileName}.png`))
            }
        })
    }

}
