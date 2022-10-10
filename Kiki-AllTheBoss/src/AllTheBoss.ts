import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class AllTheBoss implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations
    const sniperFinder = new RegExp(/.*(snip).*/i)

    const bossDictionary = {
      "Gluhar": "bossGluhar",
      "Shturman": "bossKojaniy",
      "Sanitar": "bossSanitar",
      "Reshala": "bossBully",
      "Killa": "bossKilla",
      "Tagilla": "bossTagilla",
      "Cultist": "sectantPriest"
    }

    const mapDictionary = {
      "Customs": "bigmap",
      "FactoryDay": "factory4_day",
      "FactoryNight": "factory4_night",
      "Interchange": "interchange",
      "Laboratory": "laboratory",
      "Reserve": "rezervbase",
      "Shoreline": "shoreline",
      "Woods": "woods",
      "Lighthouse": "lighthouse"
    }

    var zoneList = []
    var bossList = []
    var bossNames = []
    var raider = []
    var rogue = []
    var thisMap = []

    var populateBossList = function():void
    {

      for (let map in this.config.maps)
      {

        for (let eachBoss of locations[mapDictionary[map]].base.BossLocationSpawn)
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

      for (let eachBoss in bossList)
      {
        bossList[eachBoss].BossZone = ""
        bossList[eachBoss].BossChance = 0
      }
    }

    var cloneRaider = function():void
    {

      for (let eachBoss in locations["rezervbase"].base.BossLocationSpawn)
      {

        if (locations["rezervbase"].base.BossLocationSpawn[eachBoss].BossName === "pmcBot")
        {
          raider = JSON.parse(JSON.stringify(locations["rezervbase"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      raider.BossChance = 0
      raider.BossZone = ""
      raider.Time = 0
      raider.BossEscortAmount = 0
    }

    var cloneRogue = function():void
    {

      for (let eachBoss in locations["lighthouse"].base.BossLocationSpawn)
      {

        if (locations["lighthouse"].base.BossLocationSpawn[eachBoss].BossName === "exUsec")
        {
          rogue = JSON.parse(JSON.stringify(locations["lighthouse"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      rogue.BossChance = 0
      rogue.BossZone = ""
      rogue.Time = 0
      rogue.BossEscortAmount = 0
    }

    var populateZoneList = function(map :string):void
    {
      zoneList = locations[mapDictionary[map]].base.OpenZones.split(",")

      if (zoneList == "")
      {
        zoneList = ["BotZone"]
      }
      let tempList = zoneList.filter(zone => !zone.match(sniperFinder)) //Thanks REV!
      zoneList = tempList
    }

    var getRandomInt = function(max :number):number
    {

      return Math.floor(Math.random() * max)
    }

    var chooseZone = function(map :string):string
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

    var getBoss = function(name :string, chance :number, map :string):void
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

    var setBosses = function(map :string)
    {

      for (let eachBoss in this.config.maps[map].bossList)
      {
        let thisBoss = this.config.maps[map].bossList[eachBoss]
        let name = bossDictionary[eachBoss]

        for (let i = 0; i < thisBoss.amount; i++)
        {
          getBoss(name, thisBoss.chance, map)
        }
      }
    }

    var sanatizeMap = function(map :string):void
    {

      for (let i = Object.keys(locations[mapDictionary[map]].base.BossLocationSpawn).length; i--; i < 0)
      {
        let thisBoss = locations[mapDictionary[map]].base.BossLocationSpawn[i]

        if (bossNames.includes(thisBoss.BossName) ||
          this.config.raiders.removeRaiders === true && thisBoss.BossName === "pmcBot" ||
          this.config.rogues.removeRogues === true && thisBoss.BossName === "exUsec")
        {
          locations[mapDictionary[map]].base.BossLocationSpawn.splice(i, 1)
        }
      }
    }

    var boostRaiders = function(map :string):void
    {

      for (let eachBot in locations[mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = locations[mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.raiders.boostRaiders.chance
        thisBot.Time = this.config.raiders.boostRaiders.time
        thisBot.BossEscortAmount = this.config.raiders.boostRaiders.escortAmount
      }
    }

    var boostRogues = function(map :string):void
    {

      for (let eachBot in locations[mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = locations[mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.rogues.boostRogues.chance
        thisBot.Time = this.config.rogues.boostRogues.time
        thisBot.BossEscortAmount = this.config.rogues.boostRogues.escortAmount
      }
    }

    var addRaiders = function(map :string):void
    {
      let newRaider = JSON.parse(JSON.stringify(raider))
      newRaider.BossChance = this.config.raiders.addRaiders.maps[map].chance
      newRaider.Time = this.config.raiders.addRaiders.maps[map].time
      newRaider.BossEscortAmount = this.config.raiders.addRaiders.maps[map].escortAmount

      for (let i = 0; i < this.config.raiders.addRaiders.maps[map].amount; i++)
      {
        newRaider.BossZone = chooseZone(map)
        thisMap.push(JSON.parse(JSON.stringify(newRaider)))
      }
    }

    var addRogues = function(map :string):void
    {
      let newRogue = JSON.parse(JSON.stringify(rogue))
      newRogue.BossChance = this.config.rogues.addRogues.maps[map].chance
      newRogue.Time = this.config.rogues.addRogues.maps[map].time
      newRogue.BossEscortAmount = this.config.rogues.addRogues.maps[map].escortAmount

      for (let i = 0; i < this.config.rogues.addRogues.maps[map].amount; i++)
      {
        newRogue.BossZone = chooseZone(map)
        thisMap.push(JSON.parse(JSON.stringify(newRogue)))
      }
    }

    // ************************ Start of main ************************

    populateBossList()
    cloneRaider()
    cloneRogue()

    for (let eachMap in this.config.maps)
    {
      populateZoneList(eachMap)

      if (this.config.maps[eachMap].enabled === true)
      {
        setBosses(eachMap)
        sanatizeMap(eachMap)
      }

      if (this.config.raiders.boostRaiders.enabled === true)
      {

        if (eachMap === "rezervbase" || eachMap === "laboratory")
        {
          boostRaiders(eachMap)
        }
      }

      if (this.config.rogues.boostRogues.enabled === true)
      {

        if (eachMap === "lighthouse")
        {
          boostRogues(eachMap)
        }
      }

      if (this.config.raiders.addRaiders.enabled === true)
      {
        addRaiders(eachMap)
      }

      if (this.config.rogues.addRogues.enabled === true)
      {
        addRogues(eachMap)
      }

      locations[mapDictionary[eachMap]].base.BossLocationSpawn = [...locations[mapDictionary[eachMap]].base.BossLocationSpawn, ...thisMap]
      thisMap = []
      
      if (this.config.debug === true)
      {
        this.logger.log(`\n${eachMap} \n${JSON.stringify(locations[mapDictionary[eachMap]].base.BossLocationSpawn, 0, 1)}`)
      }
    }
  }
}

module.exports = {mod: new AllTheBoss()}