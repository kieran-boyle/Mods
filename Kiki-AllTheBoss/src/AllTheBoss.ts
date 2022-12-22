import type { DependencyContainer } from 'tsyringe'
import type { ILogger } from '@spt-aki/models/spt/utils/ILogger'
import type { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod'
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer'
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class AllTheBoss implements IPostDBLoadMod, IPreAkiLoadMod
{
  private container: DependencyContainer
  private config = require('../config/config.json')
  private hordeConfig = require('../config/hordeConfig.json')
  private logger :ILogger
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

  private zoneList :string[] = []
  private originalZones :string[] = []
  private bossList :any[] = []
  private bossNames :string[] = []
  private raider :any[] = []
  private rogue :any[] = []
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

    this.populateBossList(locations)
    this.cloneSubBoss('raider', locations)
    this.cloneSubBoss('rogue', locations)
    
    for (let eachMap in this.config.maps)
    {
      this.populateZoneList(eachMap, locations)

      if(this.config.keepOriginalBossZones === true)
      {
        this.populateOriginalZones(eachMap, locations)
      }

      if (this.config.maps[eachMap].enabled === true)
      {
        this.setBosses(eachMap, locations)
        this.sanatizeMap(eachMap, locations)
      }

      if (this.config.raiders.boostRaiders.enabled === true && (eachMap === 'Reserve' || eachMap === 'Laboratory'))
      {
        this.boostSubBoss('raiders', eachMap, locations)
      }

      if (this.config.rogues.boostRogues.enabled === true && eachMap === 'Lighthouse')
      {
        this.boostSubBoss('rogues', eachMap, locations)
      }

      if (this.config.raiders.addRaiders.enabled === true)
      {
        this.addSubBoss('raiders', eachMap, locations)
      }

      if (this.config.rogues.addRogues.enabled === true)
      {
        this.addSubBoss('rogues', eachMap, locations)
      }

      if(this.hordeConfig.hordesEnabled === true && this.hordeConfig.maps[eachMap].enabled === true)
      {
        this.setBossHordes(eachMap, locations)
      }

      if(this.config.shuffleBossOrder === true)
      {
        this.shuffleArray(this.thisMap)
      }

      //Set the maps BossLocationSpawn[] and clear thisMap[]
      locations[this.mapDictionary[eachMap]].base.BossLocationSpawn = [...locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, ...this.thisMap]
      this.thisMap = []
      
      if (this.config.debug === true)
      {
        this.logger.log(`\n${eachMap} \n${JSON.stringify(locations[this.mapDictionary[eachMap]].base.BossLocationSpawn, 0, 1)}`, 'yellow', 'black')
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

    if(this.config.randomizeBossZonesEachRaid === true)
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
              
    for(let eachMap in locations)
    {
      if(eachMap !== 'base')
      {
        for(let boss in locations[eachMap].base.BossLocationSpawn)
        {
          let thisBoss = locations[eachMap].base.BossLocationSpawn[boss]
          thisBoss.BossZone = this.chooseZone(this.getKeyByValue(this.mapDictionary, eachMap), locations)
        }
      }
    }
  }

  /**
     * Return the key from the provided value in an object
     * Used as a reverse dictionary search
     * @param object The object to search
     * @param value The value to search for
     * @returns The key that holds the value
     */
  private getKeyByValue(object :any, value :any):any
  {
    return Object.keys(object).find(key => object[key] === value)
  }

  /**
   * Searches through the boss waves of each map, if each boss is not already found
   * It then copies the boss object to bossList, and the name to BossNames for quick reference
   * @param locations The container/locations
   */
  private populateBossList(locations :any):void
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

  /**
   * Makes a copy of the target sub-boss
   * @param target 'raider' or 'rogue'
   * @param locations The container/locations
   */
  private cloneSubBoss(target :string, locations :any):void
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

  /**
   * Populates zoneList with the maps openZones
   * @param map The map to extract the zones from
   * @param locations The container/locations
   */
  private populateZoneList(map :string, locations :any):void
  {
    this.zoneList = locations[this.mapDictionary[map]].base.OpenZones.split(',')
    this.zoneList = this.zoneList.filter(zone => !zone.match(this.sniperFinder)) //Thanks REV!
  }

  /**
   * populates originalZones with bosses original spawn zones
   * @param map The map to extract the zones from
   * @param locations The container/locations
   */
  private populateOriginalZones(map :string, locations :any):void
  {
    let bossLocations = locations[this.mapDictionary[map]].base.BossLocationSpawn
    bossLocations = bossLocations.filter(boss => this.bossNames.includes(boss.BossName) && boss.BossName !== 'sectantPriest')
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

    if(this.config.keepOriginalBossZones === true && map !== 'Laboratory')
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
   * Finds the specified boss in bossList and pushes a copy to thisMap with the chance and zone set
   * @param name Name of boss
   * @param chance Chance to spawn
   * @param map Map
   * @param locations The container/locations 
   */
  private getBoss(name :string, chance :number, map :string, locations :any):void
  {
    for (let eachBoss of this.bossList)
    {
      if (eachBoss.BossName === name)
      {
        let thisBoss = eachBoss
        thisBoss.BossChance = chance
        thisBoss.BossZone = this.chooseZone(map, locations)
        this.thisMap.push(JSON.parse(JSON.stringify(thisBoss)))
      }
    }
  }

  /**
   * Loops through the maps potential bosses, and sets those required to spawn with getboss()
   * @param map Map
   * @param locations The container/locations
   */
  private setBosses(map :string, locations :any):void
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

  /**
   * Removes any unwanted bosses from the maps original bossSpawns[]
   * @param map Map
   * @param locations The container/locations
   */
  private sanatizeMap(map :string, locations :any):void
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

  /**
   * Sets the chance, time and escort amount for raiders / rogues in the maps original bossSpawns[]
   * @param target 'raider' / 'rogue' 
   * @param map Map
   * @param locations The container/locations
   */
  private boostSubBoss(target :string, map :string, locations :any):void
  {
    let targetType = target === 'raiders' ? 'boostRaiders' : 'boostRogues'
    for (let eachBot in locations[this.mapDictionary[map]].base.BossLocationSpawn)
    {
      let thisBot = locations[this.mapDictionary[map]].base.BossLocationSpawn[eachBot]
      thisBot.BossChance = this.config[target][targetType].chance
      thisBot.Time = this.config[target][targetType].time
      thisBot.BossEscortAmount = this.config[target][targetType].escortAmount
    }
  }

  /**
   * Add additional raider / rogue groups to the map.
   * @param target 'raider' / 'rogue' 
   * @param map Map
   * @param locations The container/locations
   */
  private addSubBoss(target :string, map :string, locations :any):void
  {
    let targetType = target === 'raiders' ? 'addRaiders' : 'addRogues'
    let getTarget = target === 'raiders' ? this.raider : this.rogue
    let newSubBoss = JSON.parse(JSON.stringify(getTarget))
    newSubBoss.BossChance = this.config[target][targetType].maps[map].chance
    newSubBoss.Time = this.config[target][targetType].maps[map].time
    newSubBoss.BossEscortAmount = this.config[target][targetType].maps[map].escortAmount

    for (let i = 0; i < this.config[target][targetType].maps[map].amount; i++)
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
        this.addBossHorde(this.bossDictionary[eachBoss], map, thisBoss.chance, thisBoss.escorts, thisBoss.escortAmount, locations)
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
    let thisBoss = JSON.parse(JSON.stringify(this.bossList.find(e => e.BossName === target)))
    thisBoss.BossChance = chance
    thisBoss.BossZone = this.chooseZone(map, locations)

    myEscorts.forEach((e, i) => 
    {
      if(!thisBoss.Supports) thisBoss.Supports = []
      thisBoss.Supports.push(
      {
        "BossEscortType" : this.bossDictionary[e],
        "BossEscortDifficult": [
          "normal"
        ],
        "BossEscortAmount": myAmounts[i]
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
    let options = [
      'Knight',
      'Gluhar',
      'Shturman',
      'Sanitar',
      'Reshala' ,
      'Killa',
      'Tagilla'
    ]
    let bigBossindex = this.getRandomInt(0, options.length - 1)
    let bigBoss = this.bossDictionary[options[bigBossindex]]
    options.splice(bigBossindex, 1)
  
    let tally = 0
    let supports :string[] = []
    let supportAmmounts :number[] = []
    let done = false

    while (done === false) 
    {
      let rand = this.getRandomInt(1, maximumSupports - tally)
      tally += rand
      let supportIndex = this.getRandomInt(0, options.length - 1)
      supports.push(options[supportIndex])
      options.splice(supportIndex, 1)      
      supportAmmounts.push(rand)
      if(tally > minimumSupports && Math.round(Math.random()) === 1 || tally >= maximumSupports) done = true
    }
    this.addBossHorde(bigBoss, map, 100, supports.join(','), supportAmmounts.join(','), locations)
  }

  /**
   * Shuffles elements in an array into a random order
   * @param array Array
   */
  private shuffleArray(array :any):void
  {
    for (var i = array.length - 1; i > 0; i--) 
    {
      var j = this.getRandomInt(0, i + 1)
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }
}

module.exports = {mod: new AllTheBoss()}