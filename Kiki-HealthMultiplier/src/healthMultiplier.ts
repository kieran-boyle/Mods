import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import type { ProfileHelper } from "@spt-aki/helpers/ProfileHelper"
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class HealthMultiplier implements IPreAkiLoadMod, IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger
  private bossDictionary = {
    "bossgluhar": "Gluhar",
    "bosskojaniy": "Shturman",
    "bosssanitar": "Sanitar",
    "bossbully": "Reshala",
    "bosskilla": "Killa",
    "bosstagilla": "Tagilla",
    "sectantpriest": "Cultist",
    "bossknight" : "Knight",
    "followerbigpipe" : "BigPipe",
    "followerbirdeye" : "BirdEye"
  }
  
  public postDBLoad(container: DependencyContainer):void
  {    
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const botTypes = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots.types
    const globals = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals
    const playerHealth = globals.config.Health.ProfileHealthSettings.BodyPartsSettings
    
    this.ResolveConfigOptions(playerHealth, 'Player', playerHealth)
    for (let eachBot in botTypes)
    {
      this.ResolveConfigOptions(botTypes[eachBot].health.BodyParts, this.findBotType(eachBot, botTypes), playerHealth)
    }
  }

  public preAkiLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")

    staticRouterModService.registerStaticRouter(
      "SetPlayerHealth",
      [
        {
          url: "/client/game/start",
          action: (url :string, info :any, sessionId :string, output :string) => 
          {
            const globals = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals
            const playerHealth = globals.config.Health.ProfileHealthSettings.BodyPartsSettings

            this.setProfiles(sessionId, playerHealth)
            return output
          }
        }
      ],
    "aki"
    )
  }

  /**
   * Resolves the pmc and scav profile from session ID and send to setHealth
   * @param sessionId SessionID
   * @param playerHealth Globals ProfileHealthSettings
   */
  private setProfiles(sessionId :string, playerHealth :any):void
  {
    const profileHelper = this.container.resolve<ProfileHelper>("ProfileHelper")
    let pmcData = profileHelper.getPmcProfile(sessionId)
    let scavData = profileHelper.getScavProfile(sessionId)

    if(pmcData.Health)
    {
      this.ResolveConfigOptions(pmcData.Health.BodyParts, 'Player', playerHealth)
      this.ResolveConfigOptions(scavData.Health.BodyParts, 'Player', playerHealth)
    }
  }

  /**
   * Matches the name of a bot, to the human readable option name in the config
   * @param input Name of bot
   * @param botTypes Database/bots/types
   * @returns Name for config option
   */
  private findBotType(input :string, botTypes :any):string
  {
    switch (input)
    {
      case 'bosstest':
      case 'test':
        return 'PMC'

      case 'assault':
      case 'marksman':
        return 'Scav'
  
      case 'pmcbot':
        return 'Raider'
      
      case 'exusec':
        return 'Rogue'

      default :
        return botTypes[input].experience.reward.min >= 1000 ? this.bossDictionary[input] : 'Follower'
    }
  }

  /**
   * 
   * @param healthTarget bodyparts array from bot types.health or profile
   * @param configTarget name in the config
   * @param playerHealth if targeting players profile we need to base our calculations from the template
   */
  private ResolveConfigOptions(healthTarget :any, configTarget :string, playerHealth :any):void
  {
    if(Array.isArray(healthTarget)){
      for (let eachHPSet in healthTarget)
      {
        this.setHealth(healthTarget[eachHPSet], configTarget, playerHealth)
      }
    }
    else
    {
      this.setHealth(healthTarget, configTarget, playerHealth)
    }
  }

  private setHealth(healthTarget :any, configTarget :string, playerHealth? :any):void
  {
    console.log(configTarget)
    for(let eachPart in healthTarget)
    {
      let thisConfig = Object.values(this.bossDictionary).includes(configTarget) 
                      ? this.config.Boss[configTarget] 
                      : this.config[configTarget]

      let data = configTarget === 'Player' 
                ? playerHealth 
                : healthTarget

      let target = healthTarget[eachPart]

      let newHealth = thisConfig.bodyPartMode.enabled === true  
                    ? thisConfig.bodyPartMode[eachPart] 
                    : configTarget === 'Player' 
                                  ? Math.ceil(data.Maximum * thisConfig.healthMultiplier) 
                                  : Math.ceil(data.max * thisConfig.healthMultiplier)
                    
      configTarget === 'Player' ? target.Default = newHealth : target.min = newHealth
      configTarget === 'Player' ? target.Maximum = newHealth : target.max = newHealth
    }
  }
}

module.exports = {mod: new HealthMultiplier()}