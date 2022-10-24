import { DependencyContainer } from "tsyringe"
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class ScavTweaks implements IPreAkiLoadMod
{

  private container: DependencyContainer
  private config = require("../config/config.json")

  public preAkiLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")
    const gConfig = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals.config

    gConfig.SavagePlayCooldown = this.config.ScavTimeDead
    console.log("test")
    staticRouterModService.registerStaticRouter(
      "ScavTweaks",
      [
        {
          url: "/raid/profile/save",
          action: (url :string, info :any, sessionId :string, output :string) => 
          {
            console.log('route hit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            console.log(info.isPlayerScav)
            if (info.isPlayerScav === true)
            {
              console.log(info.exit)
              switch (info.exit)
              {
                case "survived":
                  gConfig.SavagePlayCooldown = this.config.ScavTimeIfSurvive
                  break

                case "runner":
                  gConfig.SavagePlayCooldown = this.config.ScavTimeRunThrough
                  break

                case "killed":
                  gConfig.SavagePlayCooldown = this.config.ScavTimeDead
                  break

                default:
                  gConfig.SavagePlayCooldown = this.config.ScavTimeDead
                  break
              }
            }
            console.log(gConfig.SavagePlayCooldown)
            return output
          }
        }
      ],"aki"
    )
  }
}

module.exports = {mod: new ScavTweaks()}