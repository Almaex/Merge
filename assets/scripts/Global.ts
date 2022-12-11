
import { _decorator, Component, Node } from 'cc';
import Config from './Config';
import { Event } from './utils/EventHandler';
const { ccclass, property } = _decorator;

@ccclass('Global')
export class Global {
    private static _instance: Global
    private _config: Config

    static get instance() { return Global._instance || (this._instance = new Global())}
    static get config() { return this._instance._config }

    onChangeGrid = new Event

    init = () => new Promise<void>((resolve) => {
        Global._instance._config = new Config()
        resolve()
    })
}
