"use strict"

class CameraRecoilRemover
{

  static onLoadMod()
  {

    const config = require("../config/config.json")
    const items = DatabaseServer.tables.templates.items
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
        items[eachItem]._props.CameraRecoil *= config.CameraRecoil
      }
    }

    if (config.debug === true)
    {
      Logger.log(`[Kiki-CameraRecoilRemover] : Camera recoil is multiplied by ${config.CameraRecoil}`, "yellow", "black")
    }
  }
}

module.exports = CameraRecoilRemover