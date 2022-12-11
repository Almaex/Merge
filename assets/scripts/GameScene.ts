
import { _decorator, Component, Node, instantiate, Prefab } from 'cc';
import { Global } from './Global';
import { GridNode } from './GridNode';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    @property(Node) gridPos: Node = null
    @property(Prefab) gridPrefab: Prefab = null
    
    private _gridNode: GridNode = null

    start() {
        Global.instance.init().then(() => this._loadScene())
    }
    
    private _loadScene() {
        let gridNode = instantiate(this.gridPrefab)
        this._gridNode = gridNode.getComponent(GridNode)
        this._gridNode.createGrid()
        this.gridPos.addChild(gridNode)
    }
}

