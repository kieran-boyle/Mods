import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
private Locations
class AllTheBoss implements IPostDBLoadMod
{
  

  
  constructor(@inject('DatabaseServer') DatabaseServer databaseServer) {
    this.locations = databaseServer.getTables().locations;
  }

  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger
  private sniperFinder = new RegExp(/.*(snip).*/i)

  private bossDictionary = {
    "Gluhar": "bossGluhar",
    "Shturman": "bossKojaniy",
    "Sanitar": "bossSanitar",
    "Reshala": "bossBully",
    "Killa": "bossKilla",
    "Tagilla": "bossTagilla",
    "Cultist": "sectantPriest"
  }

  private mapDictionary = {
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

  private zoneList = []
  private bossList = []
  private bossNames = []
  private raider = []
  private rogue = []
  private thisMap = []

  public postDBLoad(container: DependencyContainer):void
  {
    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")

    this.populateBossList()
    this.cloneRaider()
    this.cloneRogue()

    for (let eachMap in this.config.maps)
    {
      this.populateZoneList(eachMap)

      if (this.config.maps[eachMap].enabled === true)
      {
        this.setBosses(eachMap)
        this.sanatizeMap(eachMap)
      }

      if (this.config.raiders.boostRaiders.enabled === true)
      {

        if (eachMap === "rezervbase" || eachMap === "laboratory")
        {
          this.boostRaiders(eachMap)
        }
      }

      if (this.config.rogues.boostRogues.enabled === true)
      {

        if (eachMap === "lighthouse")
        {
          this.boostRogues(eachMap)
        }
      }

      if (this.config.raiders.addRaiders.enabled === true)
      {
        this.addRaiders(eachMap)
      }

      if (this.config.rogues.addRogues.enabled === true)
      {
        this.addRogues(eachMap)
      }

      this.locations[this.mapDictionary[eachMap]].base.BossLocationSpawn = [...this.locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, ...this.thisMap]
      this.thisMap = []
      
      if (this.config.debug === true)
      {
        this.logger.log(`\n${eachMap} \n${JSON.stringify(this.locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, 0, 1)}`)
      }
    }
  }
  private populateBossList():void
    {

      for (let map in this.config.maps)
      {

        for (let eachBoss of this.locations[this.mapDictionary[map]].base.BossLocationSpawn)
        {

          if (!this.bossNames.includes(eachBoss.BossName) &&
            eachBoss.BossName !== "pmcBot" &&
            eachBoss.BossName !== "exUsec")
          {
            this.bossNames.push(eachBoss.BossName)
            this.bossList.push(JSON.parse(JSON.stringify(eachBoss)))
          }
        }
      }

      for (let eachBoss in this.bossList)
      {
        this.bossList[eachBoss].BossZone = ""
        this.bossList[eachBoss].BossChance = 0
      }
    }

    private cloneRaider():void
    {

      for (let eachBoss in this.locations["rezervbase"].base.BossLocationSpawn)
      {

        if (this.locations["rezervbase"].base.BossLocationSpawn[eachBoss].BossName === "pmcBot")
        {
          this.raider = JSON.parse(JSON.stringify(this.locations["rezervbase"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      this.raider.BossChance = 0
      this.raider.BossZone = ""
      this.raider.Time = 0
      this.raider.BossEscortAmount = 0
    }

    private cloneRogue():void
    {

      for (let eachBoss in this.locations["lighthouse"].base.BossLocationSpawn)
      {

        if (this.locations["lighthouse"].base.BossLocationSpawn[eachBoss].BossName === "exUsec")
        {
          this.rogue = JSON.parse(JSON.stringify(this.locations["lighthouse"].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      this.rogue.BossChance = 0
      this.rogue.BossZone = ""
      this.rogue.Time = 0
      this.rogue.BossEscortAmount = 0
    }

    private populateZoneList(map :string):void
    {
      this.zoneList = this.locations[this.mapDictionary[map]].base.OpenZones.split(",")

      if (this.zoneList == "")
      {
        this.zoneList = ["BotZone"]
      }
      let tempList = this.zoneList.filter(zone => !zone.match(this.sniperFinder)) //Thanks REV!
      this.zoneList = tempList
    }

    private getRandomInt(max :number):number
    {

      return Math.floor(Math.random() * max)
    }

    private chooseZone(map :string):string
    {

      if (this.zoneList === "BotZone")
      {

        return this.zoneList
      }

      if (this.zoneList.length < 1)
      {
        this.populateZoneList(map)
      }
      let rand = this.getRandomInt(this.zoneList.length)
      let thisZone = this.zoneList[rand]
      this.zoneList.splice(rand, 1)

      return thisZone.toString()
    }

    private getBoss(name :string, chance :number, map :string):void
    {

      for (let eachBoss of this.bossList)
      {

        if (eachBoss.BossName === name)
        {
          let thisBoss = eachBoss
          thisBoss.BossChance = chance
          thisBoss.BossZone = this.chooseZone(map)
          this.thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
        }
      }
    }

    private setBosses(map :string)
    {

      for (let eachBoss in this.config.maps[map].bossList)
      {
        let thisBoss = this.config.maps[map].bossList[eachBoss]
        let name = this.bossDictionary[eachBoss]

        for (let i = 0; i < thisBoss.amount; i++)
        {
          this.getBoss(name, thisBoss.chance, map)
        }
      }
    }

    private sanatizeMap(map :string):void
    {

      for (let i = Object.keys(this.locations[this.mapDictionary[map]].base.BossLocationSpawn).length; i--; i < 0)
      {
        let thisBoss = this.locations[this.mapDictionary[map]].base.BossLocationSpawn[i]

        if (this.bossNames.includes(thisBoss.BossName) ||
          this.config.raiders.removeRaiders === true && thisBoss.BossName === "pmcBot" ||
          this.config.rogues.removeRogues === true && thisBoss.BossName === "exUsec")
        {
          this.locations[this.mapDictionary[map]].base.BossLocationSpawn.splice(i, 1)
        }
      }
    }

    private boostRaiders(map :string):void
    {

      for (let eachBot in this.locations[this.mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = this.locations[this.mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.raiders.boostRaiders.chance
        thisBot.Time = this.config.raiders.boostRaiders.time
        thisBot.BossEscortAmount = this.config.raiders.boostRaiders.escortAmount
      }
    }

    private boostRogues(map :string):void
    {

      for (let eachBot in this.locations[this.mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = this.locations[this.mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.rogues.boostRogues.chance
        thisBot.Time = this.config.rogues.boostRogues.time
        thisBot.BossEscortAmount = this.config.rogues.boostRogues.escortAmount
      }
    }

    private addRaiders(map :string):void
    {
      let newRaider = JSON.parse(JSON.stringify(this.raider))
      newRaider.BossChance = this.config.raiders.addRaiders.maps[map].chance
      newRaider.Time = this.config.raiders.addRaiders.maps[map].time
      newRaider.BossEscortAmount = this.config.raiders.addRaiders.maps[map].escortAmount

      for (let i = 0; i < this.config.raiders.addRaiders.maps[map].amount; i++)
      {
        newRaider.BossZone = this.chooseZone(map)
        this.thisMap.push(JSON.parse(JSON.stringify(newRaider)))
      }
    }

    private addRogues(map :string):void
    {
      let newRogue = JSON.parse(JSON.stringify(this.rogue))
      newRogue.BossChance = this.config.rogues.addRogues.maps[map].chance
      newRogue.Time = this.config.rogues.addRogues.maps[map].time
      newRogue.BossEscortAmount = this.config.rogues.addRogues.maps[map].escortAmount

      for (let i = 0; i < this.config.rogues.addRogues.maps[map].amount; i++)
      {
        newRogue.BossZone = this.chooseZone(map)
        this.thisMap.push(JSON.parse(JSON.stringify(newRogue)))
      }
    }
}

module.exports = {mod: new AllTheBoss()}