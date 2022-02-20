"use strict"

class AntigravArmbands
{

  static onLoadMod()
  {

    const config = require("../config/config.json")
    const items = DatabaseServer.tables.templates.items
    let armbands = [
      "5b3f16c486f7747c327f55f7",
      "5b3f3af486f774679e752c1f",
      "5b3f3b0186f774021a2afef7",
      "5b3f3ade86f7746b6b790d8e",
      "5b3f3b0e86f7746752107cda"
    ]

    armbands.forEach(band =>
    {
      items[band]._props.Weight = config[band].weight
      items[band]._props.StackMaxSize = config[band].stackSize

      if (config.debug === true)
      {
        Logger.log(`[kiki-AntigravArmbands] : ${config[band].colour} armband gives ${config[band].weight} weight and stacksize is increased to ${config[band].stackSize}`, "yellow", "black")
      }
    })
  }
}
module.exports = AntigravArmbands