"use strict"

const CONFIG = require("../config/config.json")
const ITEMS = DatabaseServer.tables.templates.items

const PARENTS = [
	"5448f39d4bdc2d0a728b4568", //med
	"5448f3a64bdc2d60728b456a", //stim
	"5448f3a14bdc2d27728b4569", //drug
	"5448f3ac4bdc2dce718b4569", //medical item
]

class MedTweaker {

	static onLoadMod() {

		for (let i in ITEMS) {
			let item = ITEMS[i]

			if (PARENTS.includes(item._parent)) {

				if (item._props.MaxHpResource) {
					item._props.MaxHpResource *= CONFIG.MaxHpResource
				}

				if (item._props.hpResourceRate) {
					item._props.hpResourceRate *= CONFIG.hpResourceRate
				}

				if (item._props.medUseTime) {
					item._props.medUseTime *= CONFIG.medUseTime
				}

				if (item._props.effects_damage != []) {

					for (let effect in item._props.effects_damage) {

						for (let prop in item._props.effects_damage[effect]) {

							if (CONFIG.effects_damage[effect] && item._props.effects_damage[effect][prop] != 0) {
								item._props.effects_damage[effect][prop] *= CONFIG.effects_damage[effect][prop]
							}
						}

						if (CONFIG.debug === true) {
							Logger.log(`\n[Kiki-MedTweaker-Debug] : ${item._props.Name} ${effect} ${JSON.stringify(item._props.effects_damage[effect], 0, 4)}`, "yellow", "black")
						}
					}
				}

				if (item._props.effects_health != []) {

					for (let effect in item._props.effects_health) {

						for (let prop in item._props.effects_health[effect]) {
							item._props.effects_health[effect][prop] *= CONFIG.effects_health[effect][prop]
						}

						if (CONFIG.debug === true) {
							Logger.log(`\n[Kiki-MedTweaker-Debug] : ${item._props.Name} ${effect} ${JSON.stringify(item._props.effects_health[effect], 0, 4)}`, "yellow", "black")
						}
					}
				}
			}
		}
	}
}

module.exports = MedTweaker