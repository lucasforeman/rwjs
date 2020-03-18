import * as fs from "fs";

export class ImgEntry {

    readonly fd: number;

    offset: number;
    sectors: number;
    name: string;

    size?: number;

    content?: Buffer;

    constructor(fd: number, index: number) {
        this.fd = fd;

        let buffer = Buffer.alloc(32);
        fs.readSync(this.fd, buffer, 0, 32, 8 + (index * 32));

        this.name = '';
        for (let j = 0; j < 24; j++) {
            if (buffer.readUInt8(8 + j) === 0) {
                this.name = buffer.slice(8, 8 + j).toString('ascii');
                break;
            }
        }

        this.offset = buffer.readUInt32LE(0);
        this.sectors = buffer.readUInt16LE(4) || buffer.readUInt16LE(6);

        this.size = this.sectors * 2048;

    }

    loadContent() {

        this.content = Buffer.alloc(this.sectors * 2048);
        fs.readSync(this.fd, this.content, 0, this.sectors * 2048, this.offset * 2048);

        return this;

    }

    saveTo(filename: string) {

        return new Promise(resolve => {

            if (!this.content) {
                this.loadContent();
            }

            fs.open(filename, 'w', (error, fd) => {
                if (error) {
                    throw error;
                }


                if(!this.content) {
                    throw new Error('File has no content');
                }

                fs.write(fd, this.content, 0, this.content.length, 0, (error, written) => {
                    
                    if (error) {
                        throw error;
                    }

                    resolve(written);

                });

            });

        })

    }

}