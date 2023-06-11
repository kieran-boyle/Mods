import type { DependencyContainer } from 'tsyringe'
import type { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod'
import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer'

class ArmorDebuffRemover implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require('../config/config.json')

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    const items = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().templates.items
    const parentIDs = {
      '5a341c4086f77401f2541505' : 'Helmet' ,
      '5448e5284bdc2dcb718b4567' : 'Rig',
      '5448e54d4bdc2dcc718b4568' : 'Armor',
      '5448e53e4bdc2d60728b4567' : 'Backpack'
    }

    //Loops through items and sends any whose parents are in parentIDs to removeDebuffs()
    for (let item in items)
    {
      if(Object.keys(parentIDs).includes(items[item]._parent))
      {
        this.removeDebuffs(items[item], parentIDs[items[item]._parent])
      }
    }
  }

  /**
   * Sets requested debuffs on found item to 0
   * @param item Item to remove debuffs from
   * @param configOption Item type
   */
  private removeDebuffs(item :any, configOption :string) :void
  {
    for (let debuf in this.config[configOption])
    {
      if (this.config[configOption][debuf] !== 1)
      {
        item._props[debuf] *= this.config[configOption][debuf];
      }
    }
  }
}

module.exports = {mod: new ArmorDebuffRemover()}