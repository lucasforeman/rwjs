import {Chunk, ChunkType} from "../chunk.class";
const dxt = require('dxt-js');


const PNG = require("pngjs").PNG;

export enum RasterFormat {
    FORMAT_1555 = 0x100,
    FORMAT_565 = 0x200,
    FORMAT_4444 = 0x300,
    FORMAT_8888 = 0x500,
    FORMAT_888 = 0x600,
}

export class TextureNativeStruct extends Chunk {

    platformId: number;

    name: string = '';
    maskName: string = '';

    filterMode: number;
    uAddressing: number;
    vAddressing: number;

    rasterFormat: number;
    d3dFormat: number;

    width: number;
    height: number;
    depth: number;
    mipmapCount: number;
    rasterType: number;

    alpha: boolean;
    cubeTexture: boolean;
    autoMipmaps: boolean;
    compressed: boolean;

    rasterSize: number;

    constructor(buffer: Buffer, parent?: any) {

        super(buffer, parent);

        this.platformId = this.buffer.readUInt32LE(12);
        this.filterMode = this.buffer.readUInt8(16);
        this.uAddressing = this.buffer.readUInt8(17) >> 4;
        this.vAddressing = this.buffer.readUInt8(17) | 0b1111;

        if (this.platformId !== 9) {
            throw new Error('Only GTASA: PC Platform is supported');
        }

        for (let j = 0; j < 32; j++) {
            if (this.buffer.readUInt8(20 + j) === 0) {
                this.name = this.buffer.slice(20, 20 + j).toString('ascii');
                break;
            }
        }

        for (let j = 0; j < 32; j++) {
            if (this.buffer.readUInt8(20 + 32 + j) === 0) {
                this.maskName = this.buffer.slice(20 + 32, 20 + 32 + j).toString('ascii');
                break;
            }
        }

        this.rasterFormat = this.buffer.readUInt32LE(84) & 0xfff;
        this.d3dFormat = this.buffer.readUInt32LE(88);
        this.width = this.buffer.readUInt16LE(92);
        this.height = this.buffer.readUInt16LE(94);

        this.depth = this.buffer.readUInt8(96);
        this.mipmapCount = this.buffer.readUInt8(97);
        this.rasterType = this.buffer.readUInt8(98);

        let flags = this.buffer.readUInt8(99);
        this.alpha = Boolean(flags >> 7);
        this.cubeTexture = Boolean((flags >> 6) & 1);
        this.autoMipmaps = Boolean((flags >> 5) & 1);
        this.compressed = Boolean((flags >> 4) & 1);
        this.rasterSize = this.buffer.readInt32LE(100);


    }

}

export class TextureNative extends Chunk {

    struct: TextureNativeStruct;
    raster: any;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);

        const children = super.getChildren();

        this.struct = children.find(child => child.type === ChunkType.STRUCT);

        if (this.struct) {
            this.loadImage(this.struct.buffer.slice(104, this.struct.buffer.length));
        }

    }

    loadImage(buffer: Buffer) {

        if (this.struct.rasterFormat === RasterFormat.FORMAT_888) {
            return this.loadImage_888(buffer);
        }

        if (this.struct.rasterFormat === RasterFormat.FORMAT_8888) {
            return this.loadImage_8888(buffer);
        }

        if (this.struct.rasterFormat === RasterFormat.FORMAT_565) {
            return this.loadImage_565(buffer);
        }

        if (this.struct.rasterFormat === RasterFormat.FORMAT_4444) {
            return this.loadImage_4444(buffer);
        }

        if (this.struct.rasterFormat === RasterFormat.FORMAT_1555) {
            return this.loadImage_1555(buffer);
        }

        throw new Error(`Unsupported raster format ${this.struct.rasterFormat} for texture ${this.struct.name}`);
    }

    loadImage_565(buffer: Buffer) {

        const png = new PNG({
            width: this.struct.width,
            height: this.struct.height,
            filterType: -1,
            inputHasAlpha: false
        });

        const deco = dxt.decompress(buffer, this.struct.width, this.struct.height, dxt.flags.DXT1 | dxt.flags.ColourIterativeClusterFit);
        png.data = Buffer.from(deco);

        this.raster = png;

    }

    loadImage_1555(buffer: Buffer) {

        const png = new PNG({
            width: this.struct.width,
            height: this.struct.height,
            filterType: -1
        });

        const deco = dxt.decompress(buffer, this.struct.width, this.struct.height, dxt.flags.DXT1);
        png.data = Buffer.from(deco);

        this.raster = png;

    }

    loadImage_888(buffer: Buffer) {
        const png = new PNG({
            width: this.struct.width,
            height: this.struct.height,
            filterType: -1
        });

        for (let x = 0; x < this.struct.width; x++) {
            for (let y = 0; y < this.struct.height; y++) {
                const offset = (y * this.struct.width + x) * 4;

                png.data[offset] = buffer.readUInt8(offset + 2);
                png.data[offset + 1] = buffer.readUInt8(offset + 1);
                png.data[offset + 2] = buffer.readUInt8(offset);
                png.data[offset + 3] = 255;
            }
        }


        this.raster = png;

    }

    loadImage_8888(buffer: Buffer) {
        const png = new PNG({
            width: this.struct.width,
            height: this.struct.height,
            filterType: -1
        });

        for (let x = 0; x < this.struct.width; x++) {
            for (let y = 0; y < this.struct.height; y++) {
                const offset = (y * this.struct.width + x) * 4;

                png.data[offset] = buffer.readUInt8(offset + 2);
                png.data[offset + 1] = buffer.readUInt8(offset + 1);
                png.data[offset + 2] = buffer.readUInt8(offset);
                png.data[offset + 3] = buffer.readUInt8(offset + 3);
            }
        }


        this.raster = png;

    }

    loadImage_4444(buffer: Buffer) {
        const png = new PNG({
            width: this.struct.width,
            height: this.struct.height,
            filterType: -1
        });

        const deco = dxt.decompress(buffer, this.struct.width, this.struct.height, dxt.flags.DXT3);
        png.data = Buffer.from(deco);

        this.raster = png;

    }

}
