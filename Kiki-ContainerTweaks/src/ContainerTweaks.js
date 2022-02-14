"use strict"

const CONTAINERS = DatabaseServer.tables.loot.statics
const CONFIG = require("../config/config.json")

class ContainerTweaks {

	static onLoadMod() {

		for (let eachContainer in CONTAINERS) {
			CONTAINERS[eachContainer].chance = CONFIG.chance
		}

		if (CONFIG.debug === true) {
			Logger.log(`[Kiki-ContainerTweaks] : Containers loot spawn chance set to ${CONFIG.chance}`, "yellow", "black")
		}
	}
}

module.exports = ContainerTweaks