import {Chunk, ChunkType} from "../chunk.class";
import {NodeName} from "./node_name.class";
import {FrameList} from "./frame_list.class";
import {BinMesh} from "./bin_mesh.class";
import {Geometry} from "./geometry.class";
import {Skin} from "./skin.class";

export class Extension extends Chunk {

    nodeName: NodeName;

    binMesh: BinMesh;

    skin: Skin;

    constructor(buffer: Buffer, parent?: any) {
        super(buffer, parent);
        const children = super.getChildren();

        this.nodeName = children.find(child => child.type === ChunkType.NODE_NAME);

        this.binMesh = children.find(child => child.type === ChunkType.BIN_MESH);

        this.skin = children.find(child => child.type === ChunkType.SKIN);

        if(this.parent instanceof FrameList && this.nodeName) {
            this.parent.frameNames.push(this.nodeName.value);
        }

        if(this.parent instanceof Geometry && this.binMesh) {
            this.parent.binMesh = this.binMesh;
        }

        if(this.parent instanceof Geometry && this.skin) {
            this.parent.skin = this.skin;
        }

    }

}
