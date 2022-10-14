import { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class ArmorDebuffRemover implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const itemIDs = [
      "5a341c4086f77401f2541505",
      "5448e5284bdc2dcb718b4567",
      "5448e54d4bdc2dcc718b4568",
      "5448e53e4bdc2d60728b4567"
    ]
    const itemNames = ["Helmet", "Rig", "Armor", "Backpack"]

    for (let item in items)
    {

      for (let id in itemIDs)
      {

        if (itemIDs[id] === items[item]._parent)
        {
          let configOption = itemNames[id]

          for (let debuf in this.config[configOption])
          {

            if (this.config[configOption][debuf] === true)
            {
              let debufOption = debuf
              items[item]._props[debufOption] = 0
            }
          }
        }
      }
    }
  }
}

module.exports = {mod: new ArmorDebuffRemover()}