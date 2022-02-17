"use strict"

const CONFIG = require("../config/config.json")
const BOTTYPES = DatabaseServer.tables.bots.types
const PHEALTH = DatabaseServer.tables.globals.config.Health.ProfileHealthSettings.BodyPartsSettings

class HealthMultiplier {

	static runOnGameStart(url, info, sessionID, output) { //Love you Fin <3 called from mod.js

		CONFIG.playerId = sessionID //Make the player's ID accessible at any point
		let pmcData = ProfileController.getPmcProfile(CONFIG.playerId)
		let scavData = ProfileController.getScavProfile(CONFIG.playerId)

		var setProfileHealth = function(target) {
			if (target.Health) {
				let profileParts = target.Health.BodyParts

				if (CONFIG.Player.enabled === true) {

					for (let eachPart in profileParts) {

						if (CONFIG.Player.bodyPartMode.enabled === true) {
							profileParts[eachPart].Health.Current = CONFIG.Player.bodyPartMode[eachPart]
							profileParts[eachPart].Health.Maximum = CONFIG.Player.bodyPartMode[eachPart]

						} else {
							profileParts[eachPart].Health.Current = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
							profileParts[eachPart].Health.Maximum = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
						}
					}
				}

			} else {
				Logger.log(`[Kiki-HealthMultiplier] : Warning, player health values will not be applied on the first run with a fresh profile.\nPlease reboot the game after you have created your character  `, "yellow", "red")
			}
		}

		setProfileHealth(pmcData)
		setProfileHealth(scavData)
		
		return output
	}

	static onLoadMod() {

		var setHealth = function (bot, target, bodyPartMode) {

			for (let eachPart in bot) {

				if (bodyPartMode == true) {
					bot[eachPart].min = CONFIG[target].bodyPartMode[eachPart]
					bot[eachPart].max = CONFIG[target].bodyPartMode[eachPart]

				} else {
					bot[eachPart].min *= CONFIG[target].healthMultiplier
					bot[eachPart].max *= CONFIG[target].healthMultiplier
				}
			}
		}

		for (let eachBot in BOTTYPES) {

			for (let eachHPSet in BOTTYPES[eachBot].health.BodyParts) {
				let thisBot = BOTTYPES[eachBot].health.BodyParts[eachHPSet]

				if (CONFIG.AllEqualToPlayer == true) {

					for (let eachPart in thisBot) {

						if (CONFIG.Player.bodyPartMode.enabled == true) {
							thisBot[eachPart].min = CONFIG.Player.bodyPartMode[eachPart]
							thisBot[eachPart].max = CONFIG.Player.bodyPartMode[eachPart]

						} else {
							thisBot[eachPart].min = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
							thisBot[eachPart].max = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
						}
					}

				} else {
					let isBoss = BOTTYPES[eachBot].experience.reward.min >= 1000 ? "Boss" : "AI"
					let mode = isBoss == "Boss" ? CONFIG.Boss.bodyPartMode.enabled : CONFIG.AI.bodyPartMode.enabled

					if (CONFIG[isBoss].enabled == true) {
						setHealth(thisBot, isBoss, mode)
					}
				}
			}
		}
	}
}

module.exports = HealthMultiplier