"use strict"

const DATABASE = DatabaseServer.tables.locations
const ALLBOSS = require("./boss.json")
const MAPS = require("./maps.json")
const RAIDERS = require("./raiders.json")
const CONFIG = require("../config/config.json")
var ZONES = []

class AllTheBoss {

	static onLoadMod() {

		var getRandomInt = function (max) {
			return Math.floor(Math.random() * max);
		}

		var chooseZone = function (zoneList) {

			if (zoneList.length === 1) {
				return zoneList.toString()
			}
			let rand = getRandomInt(zoneList.length)
			let thisZone = zoneList[rand]
			ZONES.splice(rand, 1)
			return thisZone.toString()
		}

		for (let eachMap in MAPS) {
			let thisMap = []

			if (CONFIG[eachMap].enabled === true) {
				ZONES = MAPS[eachMap].split(",")

				for (let eachEntry in ALLBOSS) {
					let thisBoss = ALLBOSS[eachEntry]

					if (CONFIG[eachMap].bossList[thisBoss.BossName] > 0) {
						thisBoss.BossChance = CONFIG[eachMap].bossList[thisBoss.BossName]
						thisBoss.BossZone = chooseZone(ZONES)

						if (ZONES.length <= 1) {
							ZONES = MAPS[eachMap].split(",")
						}

						thisMap.push(thisBoss)

						if (CONFIG.debug === true) {
							Logger.log(`[Kiki-AllTheBoss] : ${thisBoss.BossName} has a ${thisBoss.BossChance}% chance to spawn on ${eachMap}`, "yellow", "black")
						}
					}
				}

				if (eachMap === "rezervbase") {

					for (let eachBot in RAIDERS.rezervbase) {
						let thisRaider = RAIDERS.rezervbase[eachBot]

						if (CONFIG.boostRaiders.enabled === true) {
							thisRaider.BossChance = CONFIG.boostRaiders.chance
							thisRaider.Time = CONFIG.boostRaiders.time
							thisRaider.BossEscortAmount = CONFIG.boostRaiders.escortAmount - 1
						}
						thisMap.push(thisRaider)
					}
				}

				if (eachMap === "laboratory") {

					for (let eachBot in RAIDERS.laboratory) {
						let thisRaider = RAIDERS.laboratory[eachBot]

						if (CONFIG.boostRaiders.enabled === true) {
							thisRaider.BossChance = CONFIG.boostRaiders.chance
							thisRaider.Time = CONFIG.boostRaiders.time
							thisRaider.BossEscortAmount = CONFIG.boostRaiders.escortAmount - 1
						}
						thisMap.push(thisRaider)
					}
				}

				eachMap === "lighthouse" ?
					DATABASE[eachMap].base.BossLocationSpawn = [...DATABASE[eachMap].base.BossLocationSpawn, ...thisMap] :
					DATABASE[eachMap].base.BossLocationSpawn = thisMap
			}
		}
	}
}
module.exports = AllTheBoss