"use strict"

class smallTweaks
{

  static onLoadMod()
  {

    const database = DatabaseServer.tables.templates.items
    const globals = DatabaseServer.tables.globals
    const locations = DatabaseServer.tables.locations
    const lootConfig = //from AIO but mini
      {
        "globalsMul": 3,
        "bigmap": 1,
        "factory4_day": 1,
        "factory4_night": 1,
        "interchange": 1,
        "laboratory": 1,
        "shoreline": 1,
        "woods": 1,
        "rezervbase": 1
      }

    //set the 5 second deploy counter to be instant.
    globals.config.TimeBeforeDeploy = 1
    globals.config.TimeBeforeDeployLocal = 1

    for (const i in database)
    {
      let item = database[i]

      //set baground colour of ammo depending on pen
      if (item._parent === "5485a8684bdc2da71d8b4567")
      {
        let pen = item._props.PenetrationPower
        let colour = ""

        pen > 60 ? colour = "red" : //SuperPen 
          pen > 50 ? colour = "yellow" : //HighPen 
          pen > 40 ? colour = "violet" : //MedHighPen 
          pen > 30 ? colour = "blue" : //MedPen 
          pen > 20 ? colour = "green" : //LowMedPen 
          colour = "grey" //LowPen 
        item._props.BackgroundColor = colour
      }
    }

    //Changing maps loots spawn chances multiplier
    for (let [k, v] of Object.entries(lootConfig))
    {

      k === "globalsMul" ?
        DatabaseServer.tables.globals.config.GlobalLootChanceModifier = v :
        locations[k].base.GlobalLootChanceModifier = v
    }
  }
}

module.exports = smallTweaks