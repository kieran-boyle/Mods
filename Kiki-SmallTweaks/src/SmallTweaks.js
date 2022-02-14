"use strict"

//const config = require("../config/config.json")
const DATABASE = DatabaseServer.tables.templates.items
const GLOBALS = DatabaseServer.tables.globals
const LOCATIONS = DatabaseServer.tables.locations
const LOOTCONFIG = { //from AIO but mini
	"globalsMul": 3,
	"bigmap": 1,
	"factory4_day": 1,
	"factory4_night": 1,
	"interchange": 1,
	"laboratory": 1,
	"shoreline": 1,
	"woods": 1,
	"rezervbase": 1
}

class smallTweaks {

	static onLoadMod() {

		//set the 5 second deploy counter to be instant.
		GLOBALS.config.TimeBeforeDeploy = 1
		GLOBALS.config.TimeBeforeDeployLocal = 1

		for (const i in DATABASE) {
			let item = DATABASE[i]

			//set baground colour of ammo depending on pen
			if (item._parent === "5485a8684bdc2da71d8b4567") {
				let pen = item._props.PenetrationPower
				let colour = ""

				pen > 60 ? colour = "red" : //SuperPen 
					pen > 50 ? colour = "yellow" : //HighPen 
					pen > 40 ? colour = "violet" : //MedHighPen 
					pen > 30 ? colour = "blue" : //MedPen 
					pen > 20 ? colour = "green" : //LowMedPen 
					colour = "grey" //LowPen 
				item._props.BackgroundColor = colour
			}
		}

		//Changing maps loots spawn chances multiplier
		for (let [k, v] of Object.entries(LOOTCONFIG)) {

			k === "globalsMul" ?
				DatabaseServer.tables.globals.config.GlobalLootChanceModifier = v :
				LOCATIONS[k].base.GlobalLootChanceModifier = v
		}
	}
}

module.exports = smallTweaks