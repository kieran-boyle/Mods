import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ProfileController } from "@spt-aki/controllers/ProfileController"
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class HealthMultiplier implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger
 
  public postDBLoad(container: DependencyContainer):void
  {
    
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")    
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")
    const globals = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals
    const playerHealth = globals.config.Health.ProfileHealthSettings.BodyPartsSettings
    const botTypes = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots.types
    const profileController = new ProfileController()

    //let t = profileController.getScavProfile()
    //console.log(t)
    for (let eachBot in botTypes)
    {

      for (let eachHPSet in botTypes[eachBot].health.BodyParts)
      {
        let thisBot = botTypes[eachBot].health.BodyParts[eachHPSet]

        if (this.config.AllEqualToPlayer == true)
        {

          for (let eachPart in thisBot)
          {

            if (this.config.Player.bodyPartMode.enabled == true)
            {
              thisBot[eachPart].min = this.config.Player.bodyPartMode[eachPart]
              thisBot[eachPart].max = this.config.Player.bodyPartMode[eachPart]

            }
            else
            {
              thisBot[eachPart].min = Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
              thisBot[eachPart].max = Math.ceil(playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
            }
          }
        }
        else
        {
          console.log('hit 1')
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
          console.log(type)
          let mode :boolean

          if (type === "Boss")
          {
            console.log('boss found')
            console.log(eachBot)
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

    staticRouterModService.registerStaticRouter(
      "SetPlayerHealth",
      [
        {
          url: "/client/game/start",
          action: (url, info, sessionId, output) => 
          {
            this.config.playerId = sessionId //Make the player's ID accessible at any point
            let pmcData = profileController.getPmcProfile()
            let scavData = profileController.getScavProfile()

            this.setProfileHealth(pmcData(this.config.playerId), playerHealth)
            this.setProfileHealth(scavData(this.config.playerId), playerHealth)

            return output
          }
        }
      ],
      "aki"
    )
  }

  private setBotHealth(bot :any, target :any, bodyPartMode :boolean):void
  {
    console.log('setBotHealth')
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