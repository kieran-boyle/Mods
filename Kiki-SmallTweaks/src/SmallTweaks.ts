import { DependencyContainer } from 'tsyringe'
import type { IPostDBLoadMod } from '@spt-aki/models/external/IPostDBLoadMod'
import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer'

class smallTweaks implements IPostDBLoadMod
{
  private container: DependencyContainer
  
  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    const database = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().templates.items
    const globals = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().globals
    const locations = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().locations

    const lootConfig = //from AIO but mini
    {
      'globalsMul': 1,
      'bigmap': 1,
      'factory4_day': 1,
      'factory4_night': 1,
      'interchange': 1,
      'laboratory': 1,
      'shoreline': 1,
      'woods': 1,
      'rezervbase': 1,
      'lighthouse': 1
    }

    //set the 5 second deploy counter to be instant.
    globals.config.TimeBeforeDeploy = 1
    globals.config.TimeBeforeDeployLocal = 1
    
    //Open extracts.
    for (let i in locations)
    {
      if (i !== 'base') 
      {
        this.setLocations(locations[i], this.findEnterences(locations[i]))        
      }
    }

    //set baground colour of ammo depending on pen
    for (let i in database)
    {
      let item = database[i]
      
      if (item._parent === '5485a8684bdc2da71d8b4567')
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
    }

   //Changing maps loots spawn chances multiplier and set raid time to 2 hours.
    for (let [k, v] of Object.entries(lootConfig))
    {

      if (k === 'globalsMul')
      {
        globals.config.GlobalLootChanceModifier = v 
      }
      else
      {
        locations[k].base.GlobalLootChanceModifier = v
        locations[k].base.EscapeTimeLimit = 120
      }
    }
  }

  findEnterences(loc):string
  {
    var enterences = []

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

  setLocations(loc, ent)
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
