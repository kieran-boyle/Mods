"use strict"

const ITEMS = DatabaseServer.tables.templates.items
const PARENTS = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"]

class MysteriousKeys {

	static onLoadMod() {

		for (const i in ITEMS) {
			let item = ITEMS[i]
			
			PARENTS.includes(item._parent) ?
				item._props.ExaminedByDefault = false :
				item._props.ExaminedByDefault = true
		}
	}
}

module.exports = MysteriousKeys