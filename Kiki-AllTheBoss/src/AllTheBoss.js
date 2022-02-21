"use strict"

class AllTheBoss {

  static onLoadMod() {

    const database = DatabaseServer.tables.locations
    /* const allBoss = require("./boss.json")
    const maps = require("./maps.json")
    const raiders = require("./raiders.json") */
    const config = require("../config/config.json")
    var zoneList = []
    var bossList = []
    var bossNames = []
    var thisMap = []

    var populateBossList = function () {

      for (let map in config.maps) {

        for (let eachBoss of database[map].base.BossLocationSpawn) {

          if (!bossNames.includes(eachBoss.BossName) &&
            eachBoss.BossName !== "pmcBot" &&
            eachBoss.BossName !== "exUsec") {
            bossNames.push(eachBoss.BossName)
            bossList.push(eachBoss)
          }
        }
      }
    }

    var sanatizeBossList = function () {

      for (let eachBoss in bossList) {
        bossList[eachBoss].BossZone = ""
        bossList[eachBoss].BossChance = 0
      }
    }

    var populateZoneList = function (map) {
      zoneList = database[map].base.OpenZones.split(",")

      if (zoneList == "") {
        zoneList = ["BotZone"]
      }
    }

    var getRandomInt = function (max) {

      return Math.floor(Math.random() * max);
    }

    var chooseZone = function (map) {
      if (zoneList === "BotZone") {

        return zoneList
      }

      if (zoneList.length < 1) {
        Logger.log("ping")
        populateZoneList(map)
      }
      let rand = getRandomInt(zoneList.length)
      let thisZone = zoneList[rand]
      Logger.log(thisZone)
      zoneList.splice(rand, 1)

      return thisZone.toString()
    }

    var getBoss = function (name, chance, map) {

      for (let eachBoss of bossList) {

        if (eachBoss.BossName === name) {
          let thisBoss = eachBoss
          thisBoss.BossChance = chance
          thisBoss.BossZone = chooseZone(map)
          thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
        }
      }
    }

    var setBosses = function (map) {

      for (let eachBoss in config.maps[map].bossList) {
        let thisBoss = config.maps[map].bossList[eachBoss]

        for (let i = 0; i < thisBoss.number; i++) {
          getBoss(eachBoss, thisBoss.chance, map)
        }
      }
    }

    populateBossList()
    sanatizeBossList()

    for (let eachMap in config.maps) {

      if (config.maps[eachMap].enabled === true) {
        populateZoneList(eachMap)

        if (config.debug === true) {
          Logger.log(`\n[Kiki-ATB] : ${eachMap} zones = \n${JSON.stringify(zoneList, 0, 1)}`, "yellow", "black")
        }
        setBosses(eachMap)
      }
    }
    Logger.log(thisMap)
  }
}

module.exports = AllTheBoss