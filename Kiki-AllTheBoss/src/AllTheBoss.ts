import { DependencyContainer } from 'tsyringe'
import { ILogger } from '@spt-aki/models/spt/utils/ILogger'
import { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod'
import { IPreAkiLoadMod } from '@spt-aki/models/external/IPreAkiLoadMod'
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer'
import {StaticRouterModService} from '@spt-aki/services/mod/staticRouter/StaticRouterModService'
import { configBuilder } from "./configBuilder"

class AllTheBoss implements IPostDBLoadMod, IPreAkiLoadMod
{
  private container: DependencyContainer
  private bossConfig = require('../config/bossConfig.json')
  private hordeConfig = require('../config/hordeConfig.json')
  private subBossConfig = require('../config/subBossConfig.json')
  private dictionaries = require('../dictionaries/dictionaries.json')
  private logger :ILogger
  private sniperFinder = new RegExp(/.*(snip).*/i)
  private zoneList :string[] = []
  private originalZones :string[] = []
  private bossList :any[] = []
  private subBossList :any[] = []
  private thisMap :any[] = []

  /**
   * Loops through the configs, adding any required bosses to thismap[] then merges with the maps BossLocationSpawn[]
   * @param container container
   */
  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>('WinstonLogger')
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations

    if(this.bossConfig.rebuildConfig === true)
    {
      this.logger.log(`[Kiki-AllTheBoss] WARNING your config has been rebuilt.  \nA backup of your old configs have been made and stored in the backups folder`, "red")
      const builder = new configBuilder()
    
      builder.build()
    }

    this.populateSubBossList(locations)
    this.populateBossList(locations)
    
    for (let eachMap in this.bossConfig.maps)
    {
      this.populateZoneList(eachMap, locations)

      if(this.bossConfig.keepOriginalBossZones === true)
      {
        this.populateOriginalZones(eachMap, locations)
      }

      if (this.bossConfig.maps[eachMap].enabled === true)
      {
        this.setBosses(eachMap, locations)
        this.sanatizeMap(eachMap, locations)
      }

      this.setSubBosses(eachMap, locations)

      if(this.hordeConfig.hordesEnabled === true && this.hordeConfig.maps[eachMap].enabled === true)
      {
        this.setBossHordes(eachMap, locations)
      }

      if(this.bossConfig.shuffleBossOrder === true)
      {
        this.shuffleArray(this.thisMap)
      }

      //Set the maps BossLocationSpawn[] and clear thisMap[]
      locations[this.dictionaries.mapDictionary[eachMap]].base.BossLocationSpawn = [...locations[this.dictionaries.mapDictionary[eachMap]].base.BossLocationSpawn, ...this.thisMap]
      this.thisMap = []
      
      if (this.bossConfig.debug === true)
      {
        this.logger.log(`\n${eachMap} \n${JSON.stringify(locations[this.dictionaries.mapDictionary[eachMap]].base.BossLocationSpawn, null, 1)}`, 'yellow', 'black')
      }
    }
  }

  /**
   * If randomizeBossZonesEachRaid is enabled, randomizes each bosses spawn zone each raid with setBossZones()
   * @param container Container
   */
  public preAkiLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")

    if(this.bossConfig.randomizeBossZonesEachRaid === true)
    {
      staticRouterModService.registerStaticRouter
      (
        "setBossZones",
        [{
          url: "/raid/profile/save",
          action: (url :string, info :any, sessionId :string, output :string) => 
          {
            this.setBossZones()
            return output
          }
        }],"aki"
      )
    }
  }

  /**
   * Randomizes each bosses spawn zone
   */
  private setBossZones():void
  {
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations

    if(this.bossConfig.keepOriginalBossZones === true)
    {
      for(let eachMap in this.bossConfig.maps)
      {
        this.populateOriginalZones(eachMap, locations)
      }
    }

    for(let eachMap in this.bossConfig.maps)
    {
      for(let boss in locations[this.dictionaries.mapDictionary[eachMap]].base.BossLocationSpawn)
      {
        let thisBoss = locations[this.dictionaries.mapDictionary[eachMap]].base.BossLocationSpawn[boss]
        thisBoss.BossZone = this.chooseZone(eachMap, locations)
      }
    }
  }

  /**
   * Finds all subBosses and pushes their object to subBossList
   * @param locations 
   */
  private populateSubBossList(locations :any):void
  {
    for(let subBoss in this.dictionaries.subBossDictionary)
    {
      let target = this.dictionaries.subBossDictionary[subBoss]
      let location = target.map
      for (let eachBoss in locations[location].base.BossLocationSpawn)
      {
        if (locations[location].base.BossLocationSpawn[eachBoss].BossName === target.name)
        {
          let thisSubBoss = JSON.parse(JSON.stringify(locations[location].base.BossLocationSpawn[eachBoss]))
          thisSubBoss.BossChance = 0
          thisSubBoss.BossZone = ''
          thisSubBoss.Time = 0
          thisSubBoss.BossEscortAmount = 0
          this.subBossList.push(thisSubBoss)
          break
        }
      }
    }  
  }

  /**
   * Searches through the boss waves of each map, if each boss is not already found
   * It then copies the boss object to bossList
   * @param locations The container/locations
   */
  private populateBossList(locations :any):void
  {      
    for (let map in this.bossConfig.maps)
    {

      for (let eachBoss of locations[this.dictionaries.mapDictionary[map]].base.BossLocationSpawn)
      {
        if (!Object.values(this.bossList).map(obj => obj.BossName).includes(eachBoss.BossName) &&
            !Object.values(this.subBossList).map(obj => obj.BossName).includes(eachBoss.BossName) &&
            !this.dictionaries.botTypesToIgnore.includes(eachBoss.BossName))
        {
          let thisBoss = JSON.parse(JSON.stringify(eachBoss))
          thisBoss.BossZone = ''
          thisBoss.BossChance = 0
          this.bossList.push(thisBoss)
        }
      }
    }
  }

  /**
   * Populates zoneList with the maps openZones
   * @param map The map to extract the zones from
   * @param locations The container/locations
   */
  private populateZoneList(map :string, locations :any):void
  {
    this.zoneList = locations[this.dictionaries.mapDictionary[map]].base.OpenZones.split(',')
    this.zoneList = this.zoneList.filter(zone => !zone.match(this.sniperFinder)) //Thanks REV!
  }

  /**
   * populates originalZones with bosses original spawn zones
   * @param map The map to extract the zones from
   * @param locations The container/locations
   */
  private populateOriginalZones(map :string, locations :any):void
  {
    let bossLocations = locations[this.dictionaries.mapDictionary[map]].base.BossLocationSpawn
    bossLocations = bossLocations.filter(boss => Object.values(this.bossList)
                                .map(obj => obj.BossName)
                                .includes(boss.BossName) 
                                && !this.dictionaries.botTypesToSkipZoneHarvest.includes(boss.BossName))

    let bossZones = bossLocations.map(boss => boss.BossZone.split(',')).flat()
    this.originalZones[map] = [...new Set(bossZones)]
  }

  /**
   * @param min Min
   * @param max Max
   * @returns Random int between min and max
   */
  private getRandomInt(min :number, max :number):number
  {
    return Math.floor(Math.random() * (max - min) + min)
  }

  /**
   * Pick a random zone from zoneList
   * @param map Map
   * @param locations The container/locations
   * @returns Random zone
   */
  private chooseZone(map :string, locations :any):string
  {
    if(map === 'FactoryDay' || map === 'FactoryNight')
    {
      return 'BotZone'
    }

    if(this.bossConfig.keepOriginalBossZones === true && map !== 'Laboratory')
    {
      return this.originalZones[map].join(',')
    }

    if (this.zoneList.length < 1)
    {
      this.populateZoneList(map, locations)
    }
    let rand = this.getRandomInt(0, this.zoneList.length)
    let thisZone = this.zoneList[rand]
    this.zoneList.splice(rand, 1)

    return `${thisZone}`
  }

  /**
   * Loops through the maps potential bosses, and sets those required to spawn with getboss()
   * @param map Map
   * @param locations The container/locations
   */
  private setBosses(map :string, locations :any):void
  {
    for (let eachBoss in this.bossConfig.maps[map].bossList)
    {
      let thisBoss = this.bossConfig.maps[map].bossList[eachBoss]
      for (let i = 0; i < thisBoss.amount; i++)
      {
        let clone = JSON.parse(JSON.stringify(this.bossList.find(boss => boss.BossName === this.dictionaries.bossDictionary[eachBoss])))
        clone.BossChance = thisBoss.chance
        clone.BossZone = this.chooseZone(map, locations)
        this.thisMap.push(clone) 
      }
    }
  }

  /**
   * Removes any unwanted bosses and subBosses from the maps original bossSpawns[]
   * @param map Map
   * @param locations The container/locations
   */
  private sanatizeMap(map :string, locations :any):void
  {
    const subBossesToRemove = Object.entries(this.subBossConfig.maps[map])
                                    .filter(([subBoss, subBossData]) => subBossData.remove === true)
                                    .map(([subBoss, subBossData]) => this.dictionaries.subBossDictionary[subBoss].name)

    console.log(subBossesToRemove)
    
    for (let i = Object.keys(locations[this.dictionaries.mapDictionary[map]].base.BossLocationSpawn).length; i--; i < 0)
    {
      let thisBoss = locations[this.dictionaries.mapDictionary[map]].base.BossLocationSpawn[i]

      if (Object.values(this.bossList).map(obj => obj.BossName).includes(thisBoss.BossName) ||
          subBossesToRemove.includes(thisBoss.BossName))
      {
        locations[this.dictionaries.mapDictionary[map]].base.BossLocationSpawn.splice(i, 1)
      }
    }
  }

  /**
   * Apply boost and add options for subBosses from the config
   * @param map Map
   * @param locations The container/locations
   */
  private setSubBosses(map :string, locations :any):void
  {
    //console.log(this.subBossConfig.maps[map])
    for(let subBoss in this.subBossConfig.maps[map])
    {
      if(this.subBossConfig.maps[map][subBoss].add.enabled === true)
      {
        this.addSubBoss(subBoss, map, locations)
      }
    }
  }

  /**
   * Add additional subBoss groups to the map.
   * @param target subBoss name 
   * @param map Map
   * @param locations The container/locations
   */
  private addSubBoss(target :string, map :string, locations :any):void
  {
    let newSubBoss = this.subBossList.find(boss => boss.BossName === this.dictionaries.subBossDictionary[target].name)
    newSubBoss.BossChance = this.subBossConfig.maps[map][target].add.chance
    newSubBoss.Time = this.subBossConfig.maps[map][target].add.chance.time
    newSubBoss.BossEscortAmount = this.subBossConfig.maps[map][target].add.chance.escortAmount

    for (let i = 0; i < this.subBossConfig.maps[map][target].add.chance.amount; i++)
    {
      newSubBoss.BossZone = this.chooseZone(map, locations)
      this.thisMap.push(JSON.parse(JSON.stringify(newSubBoss)))
    }
  }

  /**
   * Add any boss hordes requested in the hordeConfig
   * @param map Map
   * @param locations The container/locations
   */
  private setBossHordes(map :string, locations :any):void
  {
    if(this.hordeConfig.maps[map].addRandomHorde.enabled === true)
    {
      let thisHorde = this.hordeConfig.maps[map].addRandomHorde
      for(let i = 0; i < thisHorde.numberToGenerate; i++)
      {
        this.addRandomHorde(thisHorde.minimumSupports, thisHorde.maximumSupports, map, locations)
      }            
    }
    for(let eachBoss in this.hordeConfig.maps[map].bossList)
    {
      let thisBoss = this.hordeConfig.maps[map].bossList[eachBoss]
      for(let i = 0; i < thisBoss.amount; i++)
      {
        this.addBossHorde(this.dictionaries.bossDictionary[eachBoss], map, thisBoss.chance, thisBoss.escorts, thisBoss.escortAmount, locations)
      }
    }
  }

  /**
   * Adds a boss horde to thisMap
   * @param target Boss to use as leader
   * @param map Map
   * @param chance Spawn chance
   * @param escorts Comma seperated string with the names of the bosses to escort the leader
   * @param escortAmounts Comma seperated string with the ammount of each escort
   * @param locations The container/locations
   */
  private addBossHorde(target :string, map :string, chance :number, escorts :string, escortAmounts :string, locations :any):void
  {
    let myEscorts = escorts.split(',')
    let myAmounts = escortAmounts.split(',')
    let thisBoss = JSON.parse(JSON.stringify(this.bossList.find(boss => boss.BossName === target)))
    thisBoss.BossChance = chance
    thisBoss.BossZone = this.chooseZone(map, locations)
    myEscorts.forEach((escort, index) => 
    {
      if(!thisBoss.Supports) thisBoss.Supports = []
      thisBoss.Supports.push(
      {
        "BossEscortType" : this.dictionaries.bossDictionary[escort],
        "BossEscortDifficult": [
          "normal"
        ],
        "BossEscortAmount": myAmounts[index]
      })
    })
    this.thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
  }

  /**
   * Add a randomized boss horde using addBossHorde()
   * @param minimumSupports Minimum number of supports
   * @param maximumSupports Maximum number of supports
   * @param map Map
   * @param locations The container/locations
   */
  private addRandomHorde(minimumSupports :number, maximumSupports :number, map :string, locations :any):void
  {
    let tally :number = 0
    let supports :string[] = []
    let supportAmmounts :number[] = []
    let done :boolean = false
    let options = Object.values(this.bossList).map((subBoss) => subBoss.BossName)
    let bigBossindex = this.getRandomInt(0, options.length - 1)
    let bigBoss = options[bigBossindex]
    options.splice(bigBossindex, 1)

    while (done === false) 
    {
      let rand = this.getRandomInt(1, maximumSupports - tally)
      tally += rand
      let supportIndex = this.getRandomInt(0, options.length - 1)
      supports.push(options[supportIndex])
      options.splice(supportIndex, 1)      
      supportAmmounts.push(rand)
      if(tally > minimumSupports && Math.round(Math.random()) === 1 || tally >= maximumSupports || options.length < 1)
      {
        done = true
      }
    }
    this.addBossHorde(bigBoss, map, 100, supports.join(','), supportAmmounts.join(','), locations)
  }

  /**
   * Shuffles elements in an array into a random order
   * @param array Array
   */
  private shuffleArray(array :any):void
  {
    for (let i = array.length - 1; i > 0; i--) 
    {
      let j = this.getRandomInt(0, i + 1)
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }
}

module.exports = {mod: new AllTheBoss()}