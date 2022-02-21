"use strict"

class AllTheBoss
{

  static onLoadMod()
  {

    const database = DatabaseServer.tables.locations
    /* const allBoss = require("./boss.json")
    const maps = require("./maps.json")
    const raiders = require("./raiders.json") */
    const config = require("../config/config.json")
    var zoneList = []
    var bossList = []
    var bossNames = []
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
            bossList.push(eachBoss)
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
      return Math.floor(Math.random() * max);
    }

    var chooseZone = function(map)
    {
      if (zoneList === "BotZone")
      {

        return zoneList
      }
      if (zoneList.length < 1)
      {
        Logger.log("ping")
        populateZoneList(map)
      }
      let rand = getRandomInt(zoneList.length)
      let thisZone = zoneList[rand]
      Logger.log(thisZone)
      zoneList.splice(rand, 1)
      return thisZone.toString()
    }

    var getBoss = function(name, chance, map)
    {

      for (let eachBoss of bossList)
      {
        sanatizeBossList()
        if (eachBoss.BossName === name)
        {
          let thisBoss = eachBoss
          thisBoss.BossChance = chance
          thisBoss.BossZone = chooseZone(map)
          //Logger.log(thisBoss)
          thisMap.push(thisBoss)
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
          //Logger.log(bossList[eachBoss])
        }
        //bossList[eachBoss].BossChance = thisBoss.chance
        //Logger.log(bossList[eachBoss].BossChance)
      }
    }

    populateBossList()
    sanatizeBossList()

    for (let eachMap in config.maps)
    {
      if (config.maps[eachMap].enabled === true)
      {
        populateZoneList(eachMap)

        if (config.debug === true)
        {
          Logger.log(`\n[Kiki-ATB] : ${eachMap} zones = \n${JSON.stringify(zoneList, 0, 1)}`, "yellow", "black")
        }
        setBosses(eachMap)
      }
    }
    Logger.log(thisMap)
    //Logger.log(bossList)
    /*
        for (let eachMap in maps)
        {
          let thisMap = []

          if (config[eachMap].enabled === true)
          {
            zones = maps[eachMap].split(",")

            for (let eachEntry in allBoss)
            {
              let thisBoss = allBoss[eachEntry]

              if (config[eachMap].bossList[thisBoss.BossName] > 0)
              {
                thisBoss.BossChance = config[eachMap].bossList[thisBoss.BossName]
                thisBoss.BossZone = chooseZone(zones)

                if (zones.length <= 1)
                {
                  zones = maps[eachMap].split(",")
                }

                thisMap.push(thisBoss)

                if (config.debug === true)
                {
                  Logger.log(`[Kiki-AllTheBoss] : ${thisBoss.BossName} has a ${thisBoss.BossChance}% chance to spawn on ${eachMap}`, "yellow", "black")
                }
              }
            }

            if (eachMap === "rezervbase")
            {

              for (let eachBot in raiders.rezervbase)
              {
                let thisRaider = raiders.rezervbase[eachBot]

                if (config.boostRaiders.enabled === true)
                {
                  thisRaider.BossChance = config.boostRaiders.chance
                  thisRaider.Time = config.boostRaiders.time
                  thisRaider.BossEscortAmount = config.boostRaiders.escortAmount - 1
                }
                thisMap.push(thisRaider)
              }
            }

            if (eachMap === "laboratory")
            {

              for (let eachBot in raiders.laboratory)
              {
                let thisRaider = raiders.laboratory[eachBot]

                if (config.boostRaiders.enabled === true)
                {
                  thisRaider.BossChance = config.boostRaiders.chance
                  thisRaider.Time = config.boostRaiders.time
                  thisRaider.BossEscortAmount = config.boostRaiders.escortAmount - 1
                }
                thisMap.push(thisRaider)
              }
            }

            eachMap === "lighthouse" ?
              database[eachMap].base.BossLocationSpawn = [...database[eachMap].base.BossLocationSpawn, ...thisMap] :
              database[eachMap].base.BossLocationSpawn = thisMap
          }
        } */
  }
}

module.exports = AllTheBoss