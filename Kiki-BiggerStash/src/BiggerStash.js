"use strict"

const CONFIG = require("../config/config.json")
const ITEMS = DatabaseServer.tables.templates.items
const STASHARRAY = [
	"566abbc34bdc2d92178b4576", //Standard stash 10x28
	"5811ce572459770cba1a34ea", //Left Behind stash 10x38
	"5811ce662459770f6f490f32", //Prepare for escape stash 10x48
	"5811ce772459770e9e5f9532" //Edge of darkness stash 10x68
]

class BiggerStash {
	
	static onLoadMod() {

		CONFIG.ChangeAll !== false ?

			STASHARRAY.forEach(stash => {
				ITEMS[stash]._props.Grids[0]._props.cellsV = CONFIG.ChangeAll
			}) :
			
			STASHARRAY.forEach(stash => {
				ITEMS[stash]._props.Grids[0]._props.cellsV = CONFIG[stash].size
				Logger.log(`[kiki-BiggerStash] : ${CONFIG[stash].name} stash size changed to ${CONFIG[stash].size}`, "yellow", "black")
			})
	}
}
module.exports = BiggerStash