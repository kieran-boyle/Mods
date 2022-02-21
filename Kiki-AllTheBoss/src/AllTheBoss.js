"use strict"

class AllTheBoss
{

  static onLoadMod()
  {

    const database = DatabaseServer.tables.locations
    const config = require("../config/config.json")
    var zoneList = []
    var bossList = []
    var bossNames = []
    var raider = []
    var rogue = []
    var thisMap = []

    var populateBossList = function()
    {

      for (let map in config.maps)
      {

        for (let eachBoss of database[map].base.BossLocationSpawn)
        {

          if (!bossNames.includes(eachBoss.BossName) &&
            eachBoss.BossName !== "pmcBot" &&
            eachBoss.BossName !== "exUsec")
          {
            bossNames.push(eachBoss.BossName)
            bossList.push(JSON.parse(JSON.stringify(eachBoss)))
          }
        }
      }
    }

    var sanatizeBossList = function()
    {

      for (let eachBoss in bossList)
      {
        bossList[eachBoss].BossZone = ""
        bossList[eachBoss].BossChance = 0
      }
    }

    var cloneRaider = function()
    {
      for (let eachBoss in database["rezervbase"].base.BossLocationSpawn)
      {

        if (database["rezervbase"].base.BossLocationSpawn[eachBoss].BossName === "pmcBot")
        {
          raider = JSON.parse(JSON.stringify(database["rezervbase"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      raider.BossChance = 0
      raider.BossZone = ""
      raider.Time = 0
      raider.BossEscortAmount = 0
    }

    var cloneRogue = function()
    {
      for (let eachBoss in database["lighthouse"].base.BossLocationSpawn)
      {

        if (database["lighthouse"].base.BossLocationSpawn[eachBoss].BossName === "exUsec")
        {
          rogue = JSON.parse(JSON.stringify(database["lighthouse"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      rogue.BossChance = 0
      rogue.BossZone = ""
      rogue.Time = 0
      rogue.BossEscortAmount = 0
    }

    var populateZoneList = function(map)
    {
      zoneList = database[map].base.OpenZones.split(",")

      if (zoneList == "")
      {
        zoneList = ["BotZone"]
      }
    }

    var getRandomInt = function(max)
    {

      return Math.floor(Math.random() * max)
    }

    var chooseZone = function(map)
    {
      if (zoneList === "BotZone")
      {

        return zoneList
      }

      if (zoneList.length < 1)
      {
        populateZoneList(map)
      }
      let rand = getRandomInt(zoneList.length)
      let thisZone = zoneList[rand]
      zoneList.splice(rand, 1)

      return thisZone.toString()
    }

    var getBoss = function(name, chance, map)
    {

      for (let eachBoss of bossList)
      {

        if (eachBoss.BossName === name)
        {
          let thisBoss = eachBoss
          thisBoss.BossChance = chance
          thisBoss.BossZone = chooseZone(map)
          thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
        }
      }
    }

    var setBosses = function(map)
    {

      for (let eachBoss in config.maps[map].bossList)
      {
        let thisBoss = config.maps[map].bossList[eachBoss]

        for (let i = 0; i < thisBoss.number; i++)
        {
          getBoss(eachBoss, thisBoss.chance, map)
        }
      }
    }

    var sanatizeMap = function(map)
    {

      for (let i = Object.keys(database[map].base.BossLocationSpawn).length; i--; i < 0)
      {
        let thisBoss = database[map].base.BossLocationSpawn[i]

        if (bossNames.includes(thisBoss.BossName) ||
          config.raiders.removeRaiders === true && thisBoss.BossName === "pmcBot" ||
          config.rogues.removeRogues === true && thisBoss.BossName === "exUsec")
        {
          database[map].base.BossLocationSpawn.splice(i, 1)
        }
      }
    }

    var boostRaiders = function(map)
    {
      for (let eachBot in database[map].base.BossLocationSpawn)
      {
        let thisBot = database[map].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = config.raiders.boostRaiders.chance
        thisBot.Time = config.raiders.boostRaiders.time
        thisBot.BossEscortAmount = config.raiders.boostRaiders.escortAmount
      }
    }

    var boostRogues = function(map)
    {
      for (let eachBot in database[map].base.BossLocationSpawn)
      {
        let thisBot = database[map].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = config.rogues.boostRogues.chance
        thisBot.Time = config.rogues.boostRogues.time
        thisBot.BossEscortAmount = config.rogues.boostRogues.escortAmount
      }
    }

    var addRaiders = function(map)
    {
      let newRaider = JSON.parse(JSON.stringify(raider))
      newRaider.BossChance = config.raiders.addRaiders.maps[map].chance
      newRaider.Time = config.raiders.addRaiders.maps[map].time
      newRaider.BossEscortAmount = config.raiders.addRaiders.maps[map].escortAmount
      for (let i = 0; i < config.raiders.addRaiders.maps[map].amount; i++)
      {
        newRaider.BossZone = chooseZone(map)
        thisMap.push(JSON.parse(JSON.stringify(newRaider)))
      }
    }

    var addRogues = function(map)
    {
      let newRogue = JSON.parse(JSON.stringify(rogue))
      newRogue.BossChance = config.rogues.addRogues.maps[map].chance
      newRogue.Time = config.rogues.addRogues.maps[map].time
      newRogue.BossEscortAmount = config.rogues.addRogues.maps[map].escortAmount
      for (let i = 0; i < config.rogues.addRogues.maps[map].amount; i++)
      {
        newRogue.BossZone = chooseZone(map)
        thisMap.push(JSON.parse(JSON.stringify(newRogue)))
      }
    }

    // ************************ Start of main ************************

    populateBossList()
    sanatizeBossList()
    cloneRaider()
    cloneRogue()

    for (let eachMap in config.maps)
    {

      if (config.maps[eachMap].enabled === true)
      {
        populateZoneList(eachMap)
        setBosses(eachMap)
        sanatizeMap(eachMap)
      }

      if (config.raiders.boostRaiders.enabled === true)
      {
        if (eachMap === "rezervbase" || eachMap === "laboratory")
        {
          boostRaiders(eachMap)
        }
      }

      if (config.rogues.boostRogues.enabled === true)
      {
        if (eachMap === "lighthouse")
        {
          boostRogues(eachMap)
        }
      }

      if (config.raiders.addRaiders.enabled === true)
      {
        addRaiders(eachMap)
      }

      if (config.rogues.addRogues.enabled === true)
      {
        addRogues(eachMap)
      }

      database[eachMap].base.BossLocationSpawn = [...database[eachMap].base.BossLocationSpawn, ...thisMap]
      Logger.log(`\n${eachMap} \n${JSON.stringify(database[eachMap].base.BossLocationSpawn, 0, 1)}`)
    }
  }
}

module.exports = AllTheBoss