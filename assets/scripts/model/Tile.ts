
import { _decorator, Component, Vec2, TiledLayer, Vec3 } from 'cc';
import { Event } from '../utils/EventHandler';
const { ccclass, property } = _decorator;

export const enum TileType {
    Empty = 0,
    Flower1,
    Flower2, 
    Cake
}

@ccclass('Tile')
export class Tile extends Component {
    private _position: Vec3
    private _type: TileType   

    get type() { return this._type }
    get position() { return this._position }
    get removed() { return this._type === TileType.Empty }

    set type(t: TileType) { this._type = t }

    onTileUpgrade = new Event

    constructor(pos: Vec3) {
        super()
        this._position = pos
        this._type = this._getRandomTile()
    }

    updateType(type: TileType) {
        this._type = type
        this.onTileUpgrade.dispatch()
    }
    remove() {
        this.type = TileType.Empty
        this.onTileUpgrade.dispatch()
    }
    private _tileTypeLength = 4
    upgrade() {
        //Hack because of icon textures limit 
        this.type < this._tileTypeLength && this.type++
        //
        this.onTileUpgrade.dispatch()
    }


    private _getRandomTile() {
    // because of icon textures limit 
        let min = TileType.Flower1
        let max = TileType.Flower1

        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    
}

