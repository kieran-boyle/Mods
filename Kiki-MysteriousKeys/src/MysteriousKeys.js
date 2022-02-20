"use strict"

class MysteriousKeys
{

  static onLoadMod()
  {

    const items = DatabaseServer.tables.templates.items
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

module.exports = MysteriousKeys