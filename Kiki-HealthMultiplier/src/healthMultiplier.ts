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
 
  public postDBLoad(container: DependencyContainer):void
  {    
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const botTypes = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots.types
    const globals = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals
    const playerHealth = globals.config.Health.ProfileHealthSettings.BodyPartsSettings
        
    for (let eachBot in botTypes)
    {
      for (let eachHPSet in botTypes[eachBot].health.BodyParts)
      {
        let thisBot = botTypes[eachBot].health.BodyParts[eachHPSet]

        if (this.config.AllEqualToPlayer == true)
        {
          for (let eachPart in thisBot)
          {
            let newHealth = this.config.Player.bodyPartMode.enabled === true ? 
                            this.config.Player.bodyPartMode[eachPart] : 
                            Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
            
            thisBot[eachPart].min = newHealth
            thisBot[eachPart].max = newHealth            
          }
        }
        else
        {
          var dict = function(input :string):string
          {
            return input === "bosstest" || input === "test" ? "PMC" :
              input === "assault" || input === "marksman" ? "Scav" :
              input === "pmcbot" ? "Raider" :
              input === "exusec" ? "Rogue" :
              botTypes[input].experience.reward.min >= 1000 ? "Boss" :
              "Follower"
          }

          const bossDictionary = {
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

          let type = dict(eachBot)
          let mode :boolean

          if (type === "Boss")
          {
            if (this.config.Boss[bossDictionary[eachBot]].enabled == true)
            {
              mode = this.config.Boss[bossDictionary[eachBot]].bodyPartMode.enabled
              this.setBotHealth(thisBot, this.config.Boss[bossDictionary[eachBot]], mode)
            }
          }
          else
          {
            if (this.config[type].enabled == true)
            {
              mode = this.config[type].bodyPartMode.enabled
              this.setBotHealth(thisBot, this.config[type], mode)
            }
          }
        }
      }
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

  private setProfiles(sessionId :string, playerHealth :any):void
  {
    const profileHelper = this.container.resolve<ProfileHelper>("ProfileHelper")
    let pmcData = profileHelper.getPmcProfile(sessionId)
    let scavData = profileHelper.getScavProfile(sessionId)

    this.setProfileHealth(pmcData, playerHealth)
    this.setProfileHealth(scavData, playerHealth)
  }

  private setBotHealth(bot :any, target :any, bodyPartMode :boolean):void
  {
    for (let eachPart in bot)
    {
      if (bodyPartMode == true)
      {
        bot[eachPart].min = target.bodyPartMode[eachPart]
        bot[eachPart].max = target.bodyPartMode[eachPart]
      }
      else
      {
        bot[eachPart].min *= target.healthMultiplier
        bot[eachPart].max *= target.healthMultiplier
      }
    }
  }

  private setProfileHealth(target :any, playerHealth :any):void
  {
    for (let eachPart in target)
    {
      let newHealth = this.config.Player.bodyPartMode.enabled === true ? 
                      this.config.Player.bodyPartMode[eachPart] : 
                      Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
      
      target[eachPart].min = newHealth
      target[eachPart].max = newHealth            
    }
    if (target.Health)
    {
      let profileParts = target.Health.BodyParts

      if (this.config.Player.enabled === true)
      {
        for (let eachPart in profileParts)
        {
          if (this.config.Player.bodyPartMode.enabled === true)
          {
            profileParts[eachPart].Health.Current = this.config.Player.bodyPartMode[eachPart]
            profileParts[eachPart].Health.Maximum = this.config.Player.bodyPartMode[eachPart]

          }
          else
          {
            profileParts[eachPart].Health.Current = Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
            profileParts[eachPart].Health.Maximum = Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
          }
        }
      }
    }
    else
    {
      this.logger.log(`[Kiki-HealthMultiplier] : Warning, player health values will not be applied on the first run with a fresh profile.\nPlease reboot the game after you have created your character`, "yellow", "red")
    }
  }
}

module.exports = {mod: new HealthMultiplier()}