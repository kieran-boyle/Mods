"use strict"

const CONFIG = require("../config/config.json")
const ITEMS = DatabaseServer.tables.templates.items
const ITEMIDS = ["5a341c4086f77401f2541505", "5448e5284bdc2dcb718b4567", "5448e54d4bdc2dcc718b4568", "5448e53e4bdc2d60728b4567"]
const ITEMNAMES = ["Helmet", "Rig", "Armor", "Backpack"]

class ArmorDebuffRemover {

	static onLoadMod() {

		for (let item in ITEMS) {

			for (let id in ITEMIDS) {

				if (ITEMIDS[id] === ITEMS[item]._parent) {
					let configOption = ITEMNAMES[id]

					for (let debuf in CONFIG[configOption]) {

						if (CONFIG[configOption][debuf] === true) {
							let debufOption = debuf
							ITEMS[item]._props[debufOption] = 0
						}
					}
				}
			}
		}
	}
}

module.exports = ArmorDebuffRemover;