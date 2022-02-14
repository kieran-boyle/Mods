"use strict";

class AllQuestsFinished {
    constructor() {
        this.mod = "Toasty-AllQuestsFinished-Kiki-Repack";
		Logger.info(`Loading: ${this.mod}`);
        ModLoader.onLoad[this.mod] = this.Start.bind(this);
    }

    Start() {

        const database = DatabaseServer.tables;
        let base = database.templates.quests;
    
        //The following is ripped straight from Ereshkigal's All Quests Available mod with minor changes

        for (let file in base) {
            let fileData = base[file]

            fileData.conditions.AvailableForFinish = [{
                "_parent": "Level",
                "_props": {
                    "compareMethod": ">=",
                    "value": "1",
                    "index": 0,
                    "parentId": "",
                    "id": "Exist"
                }
            }]
        }
    }
}

module.exports.Mod = AllQuestsFinished;