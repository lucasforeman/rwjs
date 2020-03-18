import {Clump} from "./clump.class";
import {RWFile} from "../rwfile.class";

export class DFF extends RWFile {

    constructor() {
        super();
    }

    onLoaded() {

        if(!this.clump || !this.clump.geometryList) {
            throw new Error('File is not a model.');
        }

    }

}