import type { DependencyContainer } from "tsyringe"
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import { InraidController } from "@spt-aki/controllers/InraidController"
import { InRaidHelper } from "@spt-aki/helpers/InRaidHelper"

class MarkFIR implements IPreAkiLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")

  public preAkiLoad(container: DependencyContainer): void
  {
    this.container = container

    if(this.config.markShopFIR === true) 
    if(this.config.markFleaFIR === true) 

    container.afterResolution("InraidController", (_t, result: InraidController) => 
    {
      result.markOrRemoveFoundInRaidItems = (offraidData: ISaveProgressRequestData, pmcData: IPmcData, isPlayerScav: boolean): void => 
      {
        return this.InRaidControllerReplacement(offraidData, pmcData, isPlayerScav)
      }
    }, {frequency: "Always"})
    
    if(this.config.markEVERYTHING === true){
      container.afterResolution("InRaidHelper", (_t, result: InRaidHelper) => 
      {
        result.addSpawnedInSessionPropertyToItems = (preRaidProfile: IPmcData, postRaidProfile: IPmcData, isPlayerScav: boolean): IPmcData => 
        {
          return this.InRaidHelperReplacement(preRaidProfile, postRaidProfile, isPlayerScav)
        }
      }, {frequency: "Always"})
    }
  }

  private InRaidControllerReplacement(offraidData: ISaveProgressRequestData, pmcData: IPmcData, isPlayerScav: boolean): void
  {
    const InRaidHelper = this.container.resolve<InRaidHelper>("InRaidHelper")
    offraidData.profile = InRaidHelper.addSpawnedInSessionPropertyToItems(pmcData, offraidData.profile, isPlayerScav)
  }

  private InRaidHelperReplacement(preRaidProfile: IPmcData, postRaidProfile: IPmcData, isPlayerScav: boolean): IPmcData
  {
    for (const item of postRaidProfile.Inventory.items)
    {
      if ("upd" in item)
      {
        item.upd.SpawnedInSession = true
      }
      else
      {
        item.upd = { SpawnedInSession: true }
      }
    }

    return postRaidProfile;
  }
}

module.exports = {mod: new MarkFIR()}