"use strict"

const config = require("../config/config.json")
const botTypes = DatabaseServer.tables.bots.types
const pHealth = DatabaseServer.tables.globals.config.Health.ProfileHealthSettings.BodyPartsSettings

class HealthMultiplier {

	static runOnGameStart(url, info, sessionID, output) { //Love you Fin <3 called from mod.js

		config.playerId = sessionID //Make the player's ID accessible at any point
		let pmcData = ProfileController.getPmcProfile(config.playerId)
		if(pmcData.Health){
			let profileParts = pmcData.Health.BodyParts

			if (config.Player.enabled === true) {
				for (let eachPart in profileParts) {
					if(config.Player.bodyPartMode.enabled === true){
						profileParts[eachPart].Health.Current = config.Player.bodyPartMode[eachPart]
						profileParts[eachPart].Health.Maximum = config.Player.bodyPartMode[eachPart]
					}else{
						profileParts[eachPart].Health.Current = Math.ceil(pHealth[eachPart].Maximum * config.Player.healthMultiplier)
						profileParts[eachPart].Health.Maximum = Math.ceil(pHealth[eachPart].Maximum * config.Player.healthMultiplier)
					}
				}
			}
		}else{
			Logger.log(`[Kiki-HealthMultiplier] : Warning, player health values will not be applied on the first run with a fresh profile.\nPlease reboot the game after you have created your character  `,"yellow","red")
		}

		return output
	}

	static onLoadMod() {

		for (let eachBot in botTypes) {
			if (Array.isArray(botTypes[eachBot].health.BodyParts)){
				for(let eachHPSet in botTypes[eachBot].health.BodyParts){
					let thisBot = botTypes[eachBot].health.BodyParts[eachHPSet]
					if(config.AllEqualToPlayer == true){
						for (let eachPart in thisBot) {
							if(config.Player.bodyPartMode.enabled == true){
								thisBot[eachPart].min = config.Player.bodyPartMode[eachPart]
								thisBot[eachPart].max = config.Player.bodyPartMode[eachPart]
							}else{
								thisBot[eachPart].min = Math.ceil(pHealth[eachPart].Maximum * config.Player.healthMultiplier)
								thisBot[eachPart].max = Math.ceil(pHealth[eachPart].Maximum * config.Player.healthMultiplier)
							}
						}
					}else{
						let isBoss = botTypes[eachBot].experience.reward.min >= 1000 ? "Boss" : "AI"
						let mode = isBoss == "Boss" ? config.Boss.bodyPartMode.enabled : config.AI.bodyPartMode.enabled
						if (config[isBoss].enabled == true) {
							setHealth(thisBot, isBoss, mode)
						}
					}					
				}	
			}
		}

		function setHealth(bot, target, bodyPartMode) {
			for (let eachPart in bot) {
				if(bodyPartMode == true){
					bot[eachPart].min = config[target].bodyPartMode[eachPart]
					bot[eachPart].max = config[target].bodyPartMode[eachPart]
				}else{
					bot[eachPart].min *= config[target].healthMultiplier
					bot[eachPart].max *= config[target].healthMultiplier
				}
			}
		}
	}
}
module.exports = HealthMultiplier