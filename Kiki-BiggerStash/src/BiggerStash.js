"use strict"

class BiggerStash
{

  static onLoadMod()
  {

    const config = require("../config/config.json")
    const items = DatabaseServer.tables.templates.items
    const stashes = [
      "566abbc34bdc2d92178b4576", //Standard stash 10x28
      "5811ce572459770cba1a34ea", //Left Behind stash 10x38
      "5811ce662459770f6f490f32", //Prepare for escape stash 10x48
      "5811ce772459770e9e5f9532" //Edge of darkness stash 10x68
    ]

    if (config.ChangeAll !== false)
    {

      for (let stash of stashes)
      {
        items[stash]._props.Grids[0]._props.cellsV = config.ChangeAll
      }
      Logger.log(`[kiki-BiggerStash] : All stash sizes changed to ${config.ChangeAll}`, "yellow", "black")
    }
    else
    {

      for (let stash of stashes)
      {
        items[stash]._props.Grids[0]._props.cellsV = config[stash].size
        Logger.log(`[kiki-BiggerStash] : ${config[stash].name} stash size changed to ${config[stash].size}`, "yellow", "black")
      }
    }
  }
}
module.exports = BiggerStash