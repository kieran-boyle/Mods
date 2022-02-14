"use strict"

const RemoveTediousQuestConditions = require("./src/RemoveTediousQuestConditions.js")

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-RemoveTediousQuestConditions")
			ModLoader.onLoad["Kiki-RemoveTediousQuestConditions"] = RemoveTediousQuestConditions.onLoadMod
		}	
}

module.exports.Mod = new Mod()