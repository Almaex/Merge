
import { _decorator, Component, Node, Vec2, v2, v3 } from 'cc';
import { Event } from '../utils/EventHandler';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;


@ccclass('Grid')
export class Grid extends Component {
    private _size: Vec2 = null
    private _currentGrid: Array<Array<Tile>> = []

    get size() { return this._size }
    get currentGrid() { return this._currentGrid }

    onGridChanged = new Event
  
    constructor(size: Vec2) {
        super()
        this._size = size
        this._addTiles()
    }

    private _addTiles() {
        for (let row = 0; row < this.size.x; row++) {
            this.currentGrid.push([])
            for (let column = 0; column < this.size.y; column++) {
                let tile = new Tile(v3(row, column, 0))
                this.currentGrid[row].push(tile)
            }
        }
    }
}

