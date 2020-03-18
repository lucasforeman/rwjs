import {TXD} from "./txd/txd.class";

const args = process.argv.slice(2);

if (args.length !== 3) {
    console.error(`usage: cli [filetype] [input file] [output file/directory]`);
    process.exit(0);
}

const [type, input, output] = args;

if (type !== 'txd') {
    console.error(`Only TXD files are supported as of now`);
    process.exit(0);
}

const texture = new TXD().fromFile(input);
if(!texture) {
    console.error(`Failed to load texture`);
    process.exit(0);
}

texture.export(output, true);

console.log(`OK`);
