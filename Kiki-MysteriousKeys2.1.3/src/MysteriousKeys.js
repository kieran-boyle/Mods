"use strict"

const database = DatabaseServer.tables.templates.items
const parents = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"]

class MysteriousKeys {

	static onLoadMod() {

		for (const i in database) {
			let item = database[i]
			parents.includes(item._parent) ?
				item._props.ExaminedByDefault = false :
				item._props.ExaminedByDefault = true
		}
	}
}

module.exports = MysteriousKeys