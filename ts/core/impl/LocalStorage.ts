export abstract class LocalStorage {

    private readonly IGNORED_PROPERTIES : string[];

    constructor(IGNORED_PROPERTIES: string[]) {
        this.IGNORED_PROPERTIES = IGNORED_PROPERTIES;
    }

    protected exists(key : string) : boolean {
        return window.localStorage.getItem(key) !== null;
    }

    protected storeObject(key : string, value : object) : void {
        window.localStorage.setItem(key, this.toJsonString(value));
    }

    protected loadObject<T>(key : string, type : new () => T) : T {
        let jsonObject = JSON.parse(window.localStorage.getItem(key)) as T;
        return this.toObject(jsonObject, type);
    }

    protected storeList(key : string, values : object[]) : void {
        let list = [];
        for (let value of values) {
            list.push(this.toJsonString(value))
        }
        window.localStorage.setItem(key, '{"list":['+list.join(',')+']}');
    }

    protected loadList<T>(key : string, type : new () => T) : T[] {
        let list = JSON.parse(window.localStorage.getItem(key)).list as T[];
        return list.map(item => this.toObject(item, type));
    }

    private toJsonString(object : object) : string {
        return JSON.stringify(Object.assign({}, object));
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
}