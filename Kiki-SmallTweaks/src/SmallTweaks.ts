import { DependencyContainer } from 'tsyringe'
import { IPostDBLoadMod } from '@spt/models/external/IPostDBLoadMod'
import { DatabaseServer } from '@spt/servers/DatabaseServer'
import { ProfileHelper } from "@spt/helpers/ProfileHelper"
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService"
import Config from "../config/config.json"

class smallTweaks implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = Config
  
  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    const database = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().templates.items
    const globals = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().globals
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations    
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items

    const keyParents = ['5c99f98d86f7745c314214b3', '5c164d2286f774194c5e69fa']
    const containers = ["5448e53e4bdc2d60728b4567", "5448bf274bdc2dfc2f8b456a"]



    //remove inraid restriction.
    if(this.config.removeInraidRestriction === true)
      globals.config.RestrictionsInRaid = []

    //set the 5 second deploy counter to be instant.
    if(this.config.fastDeploy === true)
    {
      globals.config.TimeBeforeDeploy = 1
      globals.config.TimeBeforeDeployLocal = 1
    }

    //Raise flea level to 99.
    globals.config.RagFair.minUserLevel = this.config.fleaLevel
    
    //Open extracts.
    if(this.config.openExtracts === true)
    {
      for (let i in locations)
      {
        if (i !== 'base') 
        {
          this.setLocations(locations[i], this.findEntrances(locations[i]))        
        }
      }
    }
    
    for (let i in database)
    {
      let item = database[i]
      
      //set baground colour of ammo depending on pen
      if (item._parent === '5485a8684bdc2da71d8b4567' && this.config.colourAmmo === true)
      {
        let pen = item._props.PenetrationPower
        let colour = ''

        pen > 60 ? colour = 'red' : //SuperPen 
          pen > 50 ? colour = 'yellow' : //HighPen 
            pen > 40 ? colour = 'violet' : //MedHighPen 
             pen > 30 ? colour = 'blue' : //MedPen 
               pen > 20 ? colour = 'green' : //LowMedPen 
                colour = 'grey' //LowPen 
        item._props.BackgroundColor = colour
      }

      //remove container restrictions
      if(containers.includes(item._parent) && this.config.removeContainerRestrictions === true)
      {
        item._props.Grids[0]._props.filters[0].ExcludedFilter = []
      }

      //give keys unlimited uses
      if(keyParents.includes(item._parent) && this.config.giveKeysUnlimitedUses === true)
      {
        item._props.MaximumNumberOfUsage = 0
      }
    }

   //Changing maps loots spawn chances multiplier and set raid time to 2 hours
    for (let [k, v] of Object.entries(this.config.lootConfig))
    {

      if (k === 'globalsMul')
      {
        globals.config.GlobalLootChanceModifier = this.config.lootConfig.globalsMul
      }
      else
      {
        locations[k].base.GlobalLootChanceModifier = this.config.lootConfig[k]
        locations[k].base.EscapeTimeLimit = this.config.raidLength
      }
    }
  }

  public preSptLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")

    if(this.config.setStrength === true)
    {
      staticRouterModService.registerStaticRouter(
        "SetStrToEnd",
        [{
          url: "/client/match/offline/end",
          action: (url :string, info :any, sessionId :string, output :string) => 
          {
            const profileHelper = this.container.resolve<ProfileHelper>("ProfileHelper")

            this.setStrLevel(profileHelper.getPmcProfile(sessionId))
            return output
          }
        }], "spt"
      )
    }
  }

  //sets strengths skill stats to equal that of endurance at raid end
  private setStrLevel(profile):void
  {
    let skills = profile.Skills.Common

    const strength = skills.find(obj => obj.Id === "Strength")
    const endurance = skills.find(obj => obj.Id === "Endurance")

    strength.Progress = endurance.Progress
    strength.PointsEarnedDuringSession = endurance.PointsEarnedDuringSession
    strength.LastAccess = endurance.LastAccess
  }

  /**
   * Find all entery points in map
   * @param loc database locations
   * @returns comma seperated string of all entery points in map
   */
  findEntrances(loc :any):string
  {
    var enterences :string[] = []

    for (let exfil in loc.base.exits)
    {
      let thisLoc = loc.base.exits[exfil].EntryPoints.split(',')

      for (let entry in thisLoc)
      {
        if (!enterences.includes(thisLoc[entry]))
        {
          enterences.push(thisLoc[entry])
        }
      }
    }

    return enterences.join(',') 
  }

  /**
   * Opens extracts to make available under all conditions
   * @param loc database locations
   * @param ent comma seperated string of all entery points in map
   */
  setLocations(loc :any, ent :string):void
  {
    for (let x in loc.base.exits) 
    {
      let eachLocation = loc.base.exits[x]

      if (eachLocation.Name !== 'EXFIL_Train') 
      {
        if (eachLocation.Chance !== 100) 
        {
          eachLocation.Chance = 100;
        }

        if (eachLocation.PassageRequirement === 'ScavCooperation')
        {
          eachLocation.PassageRequirement = 'None'
          eachLocation.RequirementTip = ''
        }
        eachLocation.EntryPoints = ent
      }
    }
  }
}

module.exports = {mod: new smallTweaks()}
