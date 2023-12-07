import {App} from "./App";
import {Settings} from "./model/Settings";
import {CanvasBall} from "../canvas/model/CanvasBall";
import {Pillar} from "./model/Pillar";
import {LocalStorage} from "../core/impl/LocalStorage";

export class SaveHelper extends LocalStorage {

    private readonly KEY_SETTINGS = 'liroSettings';
    private readonly KEY_LIGHTSOURCE = 'liroLightsource';
    private readonly KEY_PILLARS = 'liroPillars';

    private readonly app : App;

    constructor(app: App) {
        super(['_shadow']);
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
}