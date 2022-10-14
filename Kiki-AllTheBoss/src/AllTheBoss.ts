import { DependencyContainer } from 'tsyringe'
import type { ILogger } from '@spt-aki/models/spt/utils/ILogger'
import type { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod'
import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer'

class AllTheBoss implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require('../config/config.json')
  private logger
  private sniperFinder = new RegExp(/.*(snip).*/i)

  private bossDictionary = {
    'Knight': 'bossKnight',
    'Gluhar': 'bossGluhar',
    'Shturman': 'bossKojaniy',
    'Sanitar': 'bossSanitar',
    'Reshala': 'bossBully',
    'Killa': 'bossKilla',
    'Tagilla': 'bossTagilla',
    'Cultist': 'sectantPriest'
  }

  private mapDictionary = {
    'Customs': 'bigmap',
    'FactoryDay': 'factory4_day',
    'FactoryNight': 'factory4_night',
    'Interchange': 'interchange',
    'Laboratory': 'laboratory',
    'Reserve': 'rezervbase',
    'Shoreline': 'shoreline',
    'Woods': 'woods',
    'Lighthouse': 'lighthouse'
  }

  private zoneList = []
  private bossList = []
  private bossNames = []
  private raider = []
  private rogue = []
  private thisMap = []

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>('WinstonLogger')
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations

    this.populateBossList(locations)
    this.cloneSubBoss('raider', locations)
    this.cloneSubBoss('rogue', locations)
    
    for (let eachMap in this.config.maps)
    {
      this.populateZoneList(eachMap, locations)

      if (this.config.maps[eachMap].enabled === true)
      {
        this.setBosses(eachMap, locations)
        this.sanatizeMap(eachMap, locations)
      }

      if (this.config.raiders.boostRaiders.enabled === true)
      {

        if (eachMap === 'rezervbase' || eachMap === 'laboratory')
        {
          this.boostRaiders(eachMap, locations)
        }
      }

      if (this.config.rogues.boostRogues.enabled === true)
      {

        if (eachMap === 'lighthouse')
        {
          this.boostRogues(eachMap, locations)
        }
      }

      if (this.config.raiders.addRaiders.enabled === true)
      {
        this.addRaiders(eachMap, locations)
      }

      if (this.config.rogues.addRogues.enabled === true)
      {
        this.addRogues(eachMap, locations)
      }

      locations[this.mapDictionary[eachMap]].base.BossLocationSpawn = [...locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, ...this.thisMap]
      this.thisMap = []
      
      if (this.config.debug === true)
      {
        this.logger.log(`\n${eachMap} \n${JSON.stringify(locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, 0, 1)}`, 'yellow', 'black')
      }
    }
  }

  private populateBossList(locations):void
    {      
      for (let map in this.config.maps)
      {

        for (let eachBoss of locations[this.mapDictionary[map]].base.BossLocationSpawn)
        {

          if (!this.bossNames.includes(eachBoss.BossName) &&
            eachBoss.BossName !== 'pmcBot' &&
            eachBoss.BossName !== 'exUsec')
          {
            this.bossNames.push(eachBoss.BossName)
            this.bossList.push(JSON.parse(JSON.stringify(eachBoss)))
          }
        }
      }

      for (let eachBoss in this.bossList)
      {
        this.bossList[eachBoss].BossZone = ''
        this.bossList[eachBoss].BossChance = 0
      }
    }

    private cloneSubBoss(target :string, locations):void
    {
      let loc = target === 'raider' ? 'rezervbase' : 'lighthouse'
      for (let eachBoss in locations[loc].base.BossLocationSpawn)
      {

        if (locations[loc].base.BossLocationSpawn[eachBoss].BossName === (target === 'raider' ? 'pmcBot' : 'exUsec'))
        {
          this[target] = JSON.parse(JSON.stringify(locations[loc].base.BossLocationSpawn[eachBoss]))
          break
        }
      }
      this[target].BossChance = 0
      this[target].BossZone = ''
      this[target].Time = 0
      this[target].BossEscortAmount = 0
    }

    private populateZoneList(map :string, locations):void
    {
      this.zoneList = locations[this.mapDictionary[map]].base.OpenZones.split(',')
      let tempList = this.zoneList.filter(zone => !zone.match(this.sniperFinder)) //Thanks REV!
      this.zoneList = tempList
    }

    private getRandomInt(max :number):number
    {
      return Math.floor(Math.random() * max)
    }

    private chooseZone(map :string, locations):string
    {
      if (this.zoneList.length < 1)
      {
        this.populateZoneList(map, locations)
      }
      let rand = this.getRandomInt(this.zoneList.length)
      let thisZone = this.zoneList[rand]
      this.zoneList.splice(rand, 1)

      return `${thisZone}`
    }

    private getBoss(name :string, chance :number, map :string, locations):void
    {
      for (let eachBoss of this.bossList)
      {

        if (eachBoss.BossName === name)
        {
          let thisBoss = eachBoss
          thisBoss.BossChance = chance
          if(map === 'FactoryDay' || map === 'FactoryNight')
          {
            thisBoss.BossZone = 'BotZone'
          }
          else
          {
            thisBoss.BossZone = this.chooseZone(map, locations)
          }
          this.thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
        }
      }
    }

    private setBosses(map :string, locations):void
    {
      for (let eachBoss in this.config.maps[map].bossList)
      {
        let thisBoss = this.config.maps[map].bossList[eachBoss]
        let name = this.bossDictionary[eachBoss]

        for (let i = 0; i < thisBoss.amount; i++)
        {
          this.getBoss(name, thisBoss.chance, map, locations)
        }
      }
    }

    private sanatizeMap(map :string, locations):void
    {
      for (let i = Object.keys(locations[this.mapDictionary[map]].base.BossLocationSpawn).length; i--; i < 0)
      {
        let thisBoss = locations[this.mapDictionary[map]].base.BossLocationSpawn[i]

        if (this.bossNames.includes(thisBoss.BossName) ||
          this.config.raiders.removeRaiders === true && thisBoss.BossName === 'pmcBot' ||
          this.config.rogues.removeRogues === true && thisBoss.BossName === 'exUsec')
        {
          locations[this.mapDictionary[map]].base.BossLocationSpawn.splice(i, 1)
        }
      }
    }

    private boostRaiders(map :string, locations):void
    {
      for (let eachBot in locations[this.mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = locations[this.mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.raiders.boostRaiders.chance
        thisBot.Time = this.config.raiders.boostRaiders.time
        thisBot.BossEscortAmount = this.config.raiders.boostRaiders.escortAmount
      }
    }

    private boostRogues(map :string, locations):void
    {
      for (let eachBot in locations[this.mapDictionary[map]].base.BossLocationSpawn)
      {
        let thisBot = locations[this.mapDictionary[map]].base.BossLocationSpawn[eachBot]
        thisBot.BossChance = this.config.rogues.boostRogues.chance
        thisBot.Time = this.config.rogues.boostRogues.time
        thisBot.BossEscortAmount = this.config.rogues.boostRogues.escortAmount
      }
    }

    private addRaiders(map :string, locations):void
    {
      let newRaider = JSON.parse(JSON.stringify(this.raider))
      newRaider.BossChance = this.config.raiders.addRaiders.maps[map].chance
      newRaider.Time = this.config.raiders.addRaiders.maps[map].time
      newRaider.BossEscortAmount = this.config.raiders.addRaiders.maps[map].escortAmount

      for (let i = 0; i < this.config.raiders.addRaiders.maps[map].amount; i++)
      {
        if(map === 'FactoryDay' || map === 'FactoryNight')
        {
          newRaider.BossZone = 'BotZone'
        }
        else
        {
          newRaider.BossZone = this.chooseZone(map, locations)
        }        
        this.thisMap.push(JSON.parse(JSON.stringify(newRaider)))
      }
    }

    private addRogues(map :string, locations):void
    {
      let newRogue = JSON.parse(JSON.stringify(this.rogue))
      newRogue.BossChance = this.config.rogues.addRogues.maps[map].chance
      newRogue.Time = this.config.rogues.addRogues.maps[map].time
      newRogue.BossEscortAmount = this.config.rogues.addRogues.maps[map].escortAmount

      for (let i = 0; i < this.config.rogues.addRogues.maps[map].amount; i++)
      {
        if(map === 'FactoryDay' || map === 'FactoryNight')
        {
          newRogue.BossZone = 'BotZone'
        }
        else
        {
          newRogue.BossZone = this.chooseZone(map, locations)
        }
        this.thisMap.push(JSON.parse(JSON.stringify(newRogue)))
      }
    }
}

module.exports = {mod: new AllTheBoss()}