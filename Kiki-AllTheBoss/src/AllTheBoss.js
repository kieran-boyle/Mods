"use strict"

class AllTheBoss
{

  static onLoadMod()
  {

    const database = DatabaseServer.tables.locations
    const allBoss = require("./boss.json")
    const maps = require("./maps.json")
    const raiders = require("./raiders.json")
    const config = require("../config/config.json")
    var zones = []

    var getRandomInt = function(max)
    {
      return Math.floor(Math.random() * max);
    }

    var chooseZone = function(zoneList)
    {

      if (zoneList.length === 1)
      {
        return zoneList.toString()
      }
      let rand = getRandomInt(zoneList.length)
      let thisZone = zoneList[rand]
      zones.splice(rand, 1)
      return thisZone.toString()
    }

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
    }
  }
}

module.exports = AllTheBoss