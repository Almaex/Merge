
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { Global } from './Global';
import { Grid } from './model/Grid';
import { Tile } from './model/Tile';
import { TileNode } from './TileNode';
import { Event } from './utils/EventHandler';
const { ccclass, property } = _decorator;

@ccclass('GridNode')
export class GridNode extends Component {
    @property(Node) view: Node = null
    @property(Prefab) tilePrefab: Prefab = null

    onGridChanged = new Event

    private _grid: Grid
    private _tileSize: number = 0

    createGrid() {
        this._grid = new Grid(Global.config.gridSize)
        this._tileSize = this.tilePrefab.data.getContentSize().width
        this._grid.currentGrid.forEach(r => r.forEach(t => this._createTile(t)))

    }
    private _createTile(tile: Tile) {
        let tileNode = instantiate(this.tilePrefab)
        tileNode.getComponent(TileNode).setInfo(tile)
        tileNode.setPosition(tile.position.y * this._tileSize, -tile.position.x * this._tileSize)
        this.view.addChild(tileNode)
    }
}

