"use strict"

const CONFIG = require("../config/config.json")
const PHEALTH = DatabaseServer.tables.globals.config.Health.ProfileHealthSettings.BodyPartsSettings

class HealthMultiplier
{

  static runOnGameStart(url, info, sessionID, output)
  { //Love you Fin <3 called from mod.js

    CONFIG.playerId = sessionID //Make the player's ID accessible at any point
    let pmcData = ProfileController.getPmcProfile(CONFIG.playerId)
    let scavData = ProfileController.getScavProfile(CONFIG.playerId)

    var setProfileHealth = function(target)
    {

      if (target.Health)
      {
        let profileParts = target.Health.BodyParts

        if (CONFIG.Player.enabled === true)
        {

          for (let eachPart in profileParts)
          {

            if (CONFIG.Player.bodyPartMode.enabled === true)
            {
              profileParts[eachPart].Health.Current = CONFIG.Player.bodyPartMode[eachPart]
              profileParts[eachPart].Health.Maximum = CONFIG.Player.bodyPartMode[eachPart]

            }
            else
            {
              profileParts[eachPart].Health.Current = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
              profileParts[eachPart].Health.Maximum = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
            }
          }
        }
      }
      else
      {
        Logger.log(`[Kiki-HealthMultiplier] : Warning, player health values will not be applied on the first run with a fresh profile.\nPlease reboot the game after you have created your character  `, "yellow", "red")
      }
    }

    setProfileHealth(pmcData)
    setProfileHealth(scavData)

    return output
  }

  static onLoadMod()
  {


    const botTypes = DatabaseServer.tables.bots.types

    var setBotHealth = function(bot, target, bodyPartMode)
    {

      for (let eachPart in bot)
      {

        if (bodyPartMode == true)
        {
          bot[eachPart].min = target.bodyPartMode[eachPart]
          bot[eachPart].max = target.bodyPartMode[eachPart]

        }
        else
        {
          bot[eachPart].min *= target.healthMultiplier
          bot[eachPart].max *= target.healthMultiplier
        }
      }
    }

    for (let eachBot in botTypes)
    {

      for (let eachHPSet in botTypes[eachBot].health.BodyParts)
      {
        let thisBot = botTypes[eachBot].health.BodyParts[eachHPSet]

        if (CONFIG.AllEqualToPlayer == true)
        {

          for (let eachPart in thisBot)
          {

            if (CONFIG.Player.bodyPartMode.enabled == true)
            {
              thisBot[eachPart].min = CONFIG.Player.bodyPartMode[eachPart]
              thisBot[eachPart].max = CONFIG.Player.bodyPartMode[eachPart]

            }
            else
            {
              thisBot[eachPart].min = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
              thisBot[eachPart].max = Math.ceil(PHEALTH[eachPart].Maximum * CONFIG.Player.healthMultiplier)
            }
          }
        }
        else
        {

          var dict = function(input)
          {
            return input === "bosstest" || input === "test" ? "PMC" :
              input === "assault" || input === "marksman" ? "Scav" :
              input === "pmcbot" ? "Raider" :
              input === "exusec" ? "Rogue" :
              botTypes[input].experience.reward.min >= 1000 ? "Boss" :
              "Follower"
          }

          const bossDictionary = {
            "bossgluhar": "Gluhar",
            "bosskojaniy": "Shturman",
            "bosssanitar": "Sanitar",
            "bossbully": "Reshala",
            "bosskilla": "Killa",
            "bosstagilla": "Tagilla",
            "sectantpriest": "Cultist"
          }

          let type = dict(eachBot)
          let mode

          if (type === "Boss")
          {

            if (CONFIG.Boss[bossDictionary[eachBot]].enabled == true)
            {
              mode = CONFIG.Boss[bossDictionary[eachBot]].bodyPartMode.enabled
              setBotHealth(thisBot, CONFIG.Boss[bossDictionary[eachBot]], mode)
            }
          }
          else
          {

            if (CONFIG[type].enabled == true)
            {
              mode = CONFIG[type].bodyPartMode.enabled
              setBotHealth(thisBot, CONFIG[type], mode)
            }
          }
        }
      }
    }
  }
}

module.exports = HealthMultiplier