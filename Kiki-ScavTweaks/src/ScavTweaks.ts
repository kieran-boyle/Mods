import { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class ScavTweaks implements IPostDBLoadMod
{

  private container: DependencyContainer
  private config = require("../config/config.json")

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")
    const gConfig = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals.config

    gConfig.SavagePlayCooldown = this.config.ScavTimeDead

    staticRouterModService.registerStaticRouter(
      "ScavTweaks",
      [
        {
          url: "/raid/profile/save",
          action: (url, info, sessionId, output) => 
          {
            if (info.isPlayerScav === true)
            {
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
            return output;
          }
        }
      ],
      "aki"
    )
  }

  module.exports = {mod: new ScavTweaks()}
}