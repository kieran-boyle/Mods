import path from "path"
import { DependencyContainer } from "tsyringe"
import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"

class EZPreset2Assort implements IPostDBLoadMod
{
  private container: DependencyContainer
  private logger :ILogger
  private fs = require('fs')

  public postDBLoad(container: DependencyContainer):void
  {
    //Put the ID of your profile here
    const profileID = ""
    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")

    //read the profile
    this.fs.readFile(path.resolve(__dirname, `../../../profiles/${profileID}.json`), (err, data) => 
    {
      if (err) throw err
      //import your presets
      let builds = JSON.parse(data).userbuilds.weaponBuilds
      //setup objects to hold our data as we build it
      let newAssort = {}
      let newSetup = {}

      for(let gun in builds)
      {
        //The data structure differs between profile presets, assorts, and globals presets
        let newStruct = 
        {
          "_changeWeaponName": true,
          "_encyclopedia": builds[gun].id,
          "_id": builds[gun].id,
          "_items": [...builds[gun].items],
          "_name": builds[gun].name,
          "_parent": builds[gun].items[0]._id,
          "_type": "Preset"
        }

        //Push to our data objects
        newAssort[builds[gun].name] = JSON.parse(JSON.stringify(newStruct))
        //Set initial values for trade requirements here
        newSetup[builds[gun].name] = {
          "addMoneyCost" : 20000,
          "addBuyRestriction" : 3,
          "addLoyaltyLevel" : 1
        }
      }

      //write the output files
      this.fs.writeFile(path.resolve(__dirname, '../output/assort.json'), JSON.stringify(newAssort, null, "\t"), (err) => 
      { 
        if (err) throw err
      })

      this.fs.writeFile(path.resolve(__dirname, '../output/setup.json'), JSON.stringify(newSetup, null, "\t"), (err) => 
      { 
        if (err) throw err
      })
    })
  }
}
module.exports = {mod: new EZPreset2Assort()}