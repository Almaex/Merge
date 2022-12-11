
import { _decorator, Component, Node, Sprite, SpriteFrame, BoxCollider2D, IPhysics2DContact, Contact2DType, log, Touch, Vec3 } from 'cc';
import { Tile, TileType } from './model/Tile';
const { ccclass, property } = _decorator;
 
@ccclass('TileNode')
export class TileNode extends Component {

    @property(Sprite) tileIcon: Sprite = null
    @property([SpriteFrame]) icons = new Array<SpriteFrame>()

    private collider: BoxCollider2D;
    private _positionChanged: boolean = false
    private _isSameType: boolean = false
    private _isDifferentType: boolean = false
    private _isEmpty: boolean = false

    private _tile: Tile = null
    private _anotherTile: Tile = null
    private _moving: boolean = false
    private _position: Vec3
    private _startPosition: Vec3
    
    private get tile() { return this._tile }
    private get type() { return this._tile.type }


    start() {
        this.collider = this.node.getComponent(BoxCollider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this._onEndContact, this);
        }
    }
    onLoad() {
        this._position = new Vec3()
        this._startPosition = new Vec3()
        this.tileIcon.spriteFrame = this.icons[this.type] 
        this._startPosition = this.node.getPosition()
        this.tile.onTileUpgrade.add(this, () => this._updateIcon())

        this.node.on(Node.EventType.TOUCH_START,  this._onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END,    this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        this.node.on(Node.EventType.TOUCH_MOVE,   this._onTouchMove, this);
    }
    setInfo(tile: Tile) {
        this._tile = tile
    }
    update(dt) {
        this._moving && this.node.setPosition(this._position)
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        this._resetFlags()
        this._position = otherCollider.node.getPosition()

        this._anotherTile = otherCollider.node.getComponent(TileNode).tile
        let otherNodeTypeEmpty = this._anotherTile.removed
        this._positionChanged = true

        if (this.type == this._anotherTile.type) { 
            this._isSameType = true
            return
        } else if (otherNodeTypeEmpty) {
            this._isEmpty = true
            return
        } else if (this.type != this._anotherTile.type && !otherNodeTypeEmpty) { 
            this._isDifferentType = true 
            return
        } 
 
    }
    private _onEndContact() {
        this._positionChanged = false
    }
    private _updateIcon() {
        this.tile.removed ? this.tileIcon.spriteFrame = null : this.tileIcon.spriteFrame = this.icons[this.type]
    }
    private _onTouchStart(e: Touch) {
        this._resetFlags()
        if (this.tile.removed) return
        this._position = this.node.getPosition()
        this._moving = true;
        this._onSpriteReduce()
    }
    private _onTouchEnd(e: Touch) {
        this._moving = false
        this._upgradeTiles()
        this._resetFlags()
        this._positionChanged = false
        this._onSpriteStartSize()
    }
    private _upgradeTiles() {
        this.node.setPosition(this._startPosition)
        if (this._positionChanged) {
            if (this._isSameType) {
                this.tile.remove()
                this._anotherTile.upgrade()
            }
            if (this._isEmpty || this._isDifferentType) {
                let currentType = this._anotherTile.type
                this._anotherTile.updateType(this.tile.type)
                this.tile.updateType(currentType)
            }
        }
    }
    private _resetFlags() {
        this._isSameType = false
        this._isEmpty = false
        this._isDifferentType = false
    }
    private _onTouchCancel(e: Touch) {
        this._moving = false
        this._onSpriteStartSize()
    }
    private _onTouchMove(e: Touch) {
        if (this._moving) {
            let delta = e.getUIDelta()
            this._position.x += delta.x
            this._position.y += delta.y
        }
    }
    private _onSpriteStartSize() {
        this.node.setScale(1.4, 1.4)
    }
    private _onSpriteReduce() {
        this.node.setScale(1.2, 1.2)
    }

}
