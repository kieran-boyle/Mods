import type { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class MysteriousKeys implements IPostDBLoadMod
{
  private container: DependencyContainer

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container    
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const parents = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"]

    for (const i in items)
    {
      let item = items[i]
      parents.includes(item._parent) ?
        item._props.ExaminedByDefault = false :
        item._props.ExaminedByDefault = true
    }
  }
}

module.exports = {mod: new MysteriousKeys()}