# rwjs
RenderWare library for TypeScript

## TXD
```typescript
import { ExportType, TXD } from 'rwjs';
import * as fs from 'fs';

const file = fs.readFileSync('./amyossb1.txd');

const txd = new TXD().fromBuffer(file);

const files = txd.export(ExportType.PNG);

if (files) {
    for (const file of files) {
        fs.writeFileSync(file.name, file.buffer, { encoding: 'binary' });
    }
}
```