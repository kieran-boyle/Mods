"use strict";

const config = require("../config/config.json");
const base = DatabaseServer.tables.templates.items;;
const itemId = ["5a341c4086f77401f2541505","5448e5284bdc2dcb718b4567","5448e54d4bdc2dcc718b4568","5448e53e4bdc2d60728b4567"];
const itemName = ["Helmet","Rig","Armor","Backpack"];

class ArmorDebuffRemover{
	static onLoadMod(){
		for (let id in base){
			for (let item in itemId){
				if (itemId[item] === base[id]._parent){
					let configOption = itemName[item];
					for (let debuf in config[configOption]){
						if (config[configOption][debuf] === true ){
							let debufOption = debuf;
							base[id]._props[debufOption] = 0;
						}
					}
				}
			}		
		}
	}
}
module.exports = ArmorDebuffRemover;