import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class CameraRecoilRemover implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const weaponClassList = [
      "pistol",
      "smg",
      "shotgun",
      "assaultRifle",
      "assaultCarbine",
      "machinegun",
      "marksmanRifle",
      "sniperRifle"
    ]

    for (let eachItem in items)
    {

      if (weaponClassList.includes(items[eachItem]._props.weapClass))
      {
        items[eachItem]._props.CameraRecoil *= this.config.CameraRecoil
      }
    }

    if (this.config.debug === true)
    {
      this.Logger.log(`[Kiki-CameraRecoilRemover] : Camera recoil is multiplied by ${this.config.CameraRecoil}`, "yellow", "black")
    }
  }
}

module.exports = {mod: new CameraRecoilRemover()}