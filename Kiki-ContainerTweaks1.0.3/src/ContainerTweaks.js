"use strict";

const containers = DatabaseServer.tables.loot.statics
const config = require("../config/config.json")

class ContainerTweaks{
	static onLoadMod(){
		for(let eachContainer in containers){
			containers[eachContainer].chance = config.chance
		}
		if(config.debug === true){
			Logger.log(`[Kiki-ContainerTweaks] : Containers loot spawn chance set to ${config.chance}`,"yellow","black") 
		}
	}
}
module.exports = ContainerTweaks;