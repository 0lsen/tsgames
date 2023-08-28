import {App} from "./App";
import {Settings} from "./model/Settings";
import {CanvasBall} from "../canvas/model/CanvasBall";
import {Pillar} from "./model/Pillar";

export class SaveHelper {

    private readonly IGNORED_PROPERTIES = ['_shadow'];

    private readonly KEY_SETTINGS = 'liroSettings';
    private readonly KEY_LIGHTSOURCE = 'liroLightsource';
    private readonly KEY_PILLARS = 'liroPillars';

    private readonly app : App;

    constructor(app: App) {
        this.app = app;
    }

    public save() : void {
        this.storeObject(this.KEY_SETTINGS, this.app.settings);
        this.storeObject(this.KEY_LIGHTSOURCE, this.app.lightSource);
        this.storeList(this.KEY_PILLARS, this.app.pillars);
    }

    public checkStorage() : boolean {
        return this.exists(this.KEY_SETTINGS) && this.exists(this.KEY_LIGHTSOURCE) && this.exists(this.KEY_PILLARS);
    }

    public loadSettings() : Settings {
        return this.loadObject(this.KEY_SETTINGS, Settings);
    }

    public loadLightsource() : CanvasBall {
        return this.loadObject(this.KEY_LIGHTSOURCE, CanvasBall);
    }

    public loadPillars() : Pillar[] {
        return this.loadList(this.KEY_PILLARS, Pillar);
    }

    private toJsonString(object : object) : string {
        return JSON.stringify(Object.assign({}, object));
    }

    private storeObject(key : string, value : object) : void {
        window.localStorage.setItem(key, this.toJsonString(value));
    }

    private storeList(key : string, values : object[]) : void {
        let list = [];
        for (let value of values) {
            list.push(this.toJsonString(value))
        }
        window.localStorage.setItem(key, '{"list":['+list.join(',')+']}');
    }

    private exists(key : string) : boolean {
        return window.localStorage.getItem(key) !== null;
    }

    private loadObject<T>(key : string, type : new () => T) : T {
        let jsonObject = JSON.parse(window.localStorage.getItem(key)) as T;
        return this.toObject(jsonObject, type);
    }

    private toObject<T>(jsonObject : T, type : new() => T) : T {
        let object = new type();
        Object.assign(object, jsonObject);
        for (let key of Object.keys(object)) {
            if (this.IGNORED_PROPERTIES.includes(key)) {
                delete object[key];
            }
            if (typeof object[key] === 'object') {
                let obj = new ((new type())[key].constructor);
                object[key] = Object.assign(obj, object[key]);
            }
        }
        return object;
    }

    private loadList<T>(key : string, type : new () => T) : T[] {
        let list = JSON.parse(window.localStorage.getItem(key)).list as T[];
        return list.map(item => this.toObject(item, type));
    }
}