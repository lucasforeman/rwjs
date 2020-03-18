import {TXD} from "./txd/txd.class";

const fs = require('fs');

const util = require('util');

new TXD().fromFile('test.txd');

// fs.readdir('import', (e, f) => {
//     f.forEach(file => {
//
//         try {
//             const txd = new TXD().fromFile(`import/${file}`);
//             if (!txd) {
//                 throw `Failed to open txd ${file}`;
//             }
//
//             if (!txd.textureDictionary) {
//                 throw `Failed to load struct of ${file}`
//             }
//
//             const path = `export2/${file.replace('.', '')}`;
//
//             if (!fs.existsSync(path)) {
//                 fs.mkdirSync(path, {recursive: true});
//             }
//
//             txd.export(path);
//         } catch (error) {
//             console.error(error);
//         }
//     });
// });
