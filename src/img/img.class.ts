import * as fs from 'fs';
import {ImgEntry} from "./img_entry.class";

export class Img {

    readonly fd: number;

    length: number;

    private entries: ImgEntry[] = [];

    constructor(path: string) {

        if (!fs.existsSync(path)) {
            throw new Error('File not found');
        }

        this.fd = fs.openSync(path, 'r+');

        if (!this.fd) {
            throw new Error('Failed to open the file');
        }

        const header = Buffer.alloc(8);

        fs.readSync(this.fd, header, 0, 8, 0);

        const version = header.slice(0, 4).toString('ascii');

        if (version !== 'VER2') {
            throw new Error('Archive Version is not supported');
        }

        this.length = header.readUInt32LE(4);

        this.loadEntryList();

    }

    close() {
        fs.closeSync(this.fd);
    }

    private loadEntryList(): void {

        let buffer = Buffer.alloc(32 * this.length);
        fs.readSync(this.fd, buffer, 0, buffer.length, 8);

        for (let i = 0; i < this.length; i++) {

            this.entries.push(new ImgEntry(this.fd, i));

        }

    }

    listFiles(): ImgEntry[] {

        if (!this.entries.length) {
            this.loadEntryList();
        }

        return this.entries;
    }

    getFile(identifier: number | string) {

        if (!this.entries.length) {
            this.loadEntryList();
        }

        let entry: ImgEntry | undefined;

        if (typeof (identifier) === 'number') {

            if (identifier < 0 || identifier >= this.entries.length) {
                throw new Error('Invalid index');
            }

            entry = this.entries[identifier];

        } else {

            entry = this.entries.find(e => e.name === identifier);

            if(!entry) {
                throw new Error('File not found in the archive');
            }

        }

        entry.loadContent();

        return entry;

    }

}