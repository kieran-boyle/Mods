"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MysteriousKeys {
    constructor() {
        this.debug = false;
    }
    postDBLoad(container) {
        this.container = container;
        const items = this.container.resolve("DatabaseServer").getTables().templates.items;
        const parents = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"];
        for (const i in items) {
            let item = items[i];
            parents.includes(item._parent) ?
                item._props.ExaminedByDefault = false :
                item._props.ExaminedByDefault = true;
        }
    }
}
module.exports = { mod: new MysteriousKeys() };
