import {Chunk} from "../chunk.class";

export class String extends Chunk {

    value: string = '';

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        let valBuffer = buffer.slice(12);

        for(let i = valBuffer.length - 1; i >= 0; i--) {
            if(valBuffer.readUInt8(i)) {

                this.value = valBuffer.slice(0, i+1).toString('utf-8');
                break;

            }
        }


    }

}
