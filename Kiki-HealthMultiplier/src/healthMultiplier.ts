import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import type { ProfileHelper } from "@spt-aki/helpers/ProfileHelper"
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class HealthMultiplier implements IPostDBLoadMod
{
    private container: DependencyContainer
    private config = require("../config/config.json")
    private logger: ILogger
    private databaseTables
    private playerHealth

    public postDBLoad(container: DependencyContainer): void
    {
        this.container = container
        this.logger = this.container.resolve<ILogger>("WinstonLogger")
        this.databaseTables = this.container.resolve<DatabaseServer>("DatabaseServer").getTables()
        this.playerHealth = this.databaseTables.globals.config.Health.ProfileHealthSettings.BodyPartsSettings

        const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")
        staticRouterModService.registerStaticRouter(
            "SetPlayerHealth",
            [{
                url: "/client/game/start",
                action: (url, info, sessionId, output) => 
                {
                    this.setProfiles(sessionId)
                    return output
                }
            }],
            "aki"
        )

        this.setBots()
    }

    private setBots(): void
    {
        const botTypes = this.databaseTables.bots.types

        for (const eachBot in botTypes)
        {
            for (const eachHPSet in botTypes[eachBot].health.BodyParts)
            {
                const thisBot = botTypes[eachBot].health.BodyParts[eachHPSet]

                if (this.config.AllEqualToPlayer == true)
                {
                    for (const eachPart in thisBot)
                    {
                        if (this.config.Player.bodyPartMode.enabled == true)
                        {
                            thisBot[eachPart].min = this.config.Player.bodyPartMode[eachPart]
                            thisBot[eachPart].max = this.config.Player.bodyPartMode[eachPart]
                        }
                        else
                        {
                            thisBot[eachPart].min = Math.ceil(this.playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
                            thisBot[eachPart].max = Math.ceil(this.playerHealth[eachPart].Maximum * this.config.Player.healthMultiplier)
                        }
                    }
                }
                else
                {
                    this.logger.debug("")
                    this.logger.debug("Hit 1")

                    const dict = function(input :string):string
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

                    const type = dict(eachBot)

                    this.logger.debug(`Type: ${type}`)

                    let mode :boolean

                    if (type === "Boss")
                    {
                        this.logger.debug(`Boss Found: ${eachBot}`)

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

    private setProfiles(sessionId: string):void
    {
        this.logger.success("setProfiles")
        const profileHelper = this.container.resolve<ProfileHelper>("ProfileHelper")

        const pmcData = profileHelper.getPmcProfile(sessionId)
        const scavData = profileHelper.getScavProfile(sessionId)

        this.setProfileHealth(pmcData, this.playerHealth)
        this.setProfileHealth(scavData, this.playerHealth)
    }

    private setBotHealth(bot :any, target :any, bodyPartMode :boolean):void
    {
        this.logger.debug("setBotHealth")

        for (const eachPart in bot)
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
        this.logger.debug("setProfileHealth")

        if (target.Health)
        {
            const profileParts = target.Health.BodyParts

            if (this.config.Player.enabled === true)
            {

                for (const eachPart in profileParts)
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
            this.logger.log("[Kiki-HealthMultiplier] : Warning, player health values will not be applied on the first run with a fresh profile.\nPlease reboot the game after you have created your character", "yellow", "red")
        }
    }
}

module.exports = {mod: new HealthMultiplier()}
