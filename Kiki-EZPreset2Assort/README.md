This mod is a tool for taking presets that you have built in your profile, and exports them into a format compatable with trader assorts, whilst preserving locales tags.

Useage.  
Put the ID of your profile in const profileID.
Run the server, then close the server.
Copy the assort.JSON and setup.JSON files that have been created in the output folder, and paste them into the src folder of your trader mod.

In your trader mod you will require the following to be pasted into its mod.ts.postDBLoad

//Bring in your assorts
const newAssort = require("../res/assort.json")
const newSetup = require("../res/setup.json")

//Add your assorts

for(let item in newAssort)
{
    //add assort to trader
    this.fluentTraderAssortHeper.createComplexAssortItem(newAssort[item]._items)
                                .addUnlimitedStackCount()
                                //would have to handle differnt currency / barters seperately
                                .addMoneyCost(Money.ROUBLES, newSetup[item].addMoneyCost)
                                .addBuyRestriction(newSetup[item].addBuyRestriction)
                                .addLoyaltyLevel(newSetup[item].addLoyaltyLevel)
                                .export(tables.traders[baseJson._id]);

    //add assort name to locales
    for(let local in tables.locales.global)
    {
        let thisLocal = tables.locales.global[local]
        thisLocal[newAssort[item]._id] = newAssort[item]._name
    }

    //add to globals presets 
    tables.globals.ItemPresets[newAssort[item]._id] = newAssort[item]
}

You can then set your prices and requirements in setup.JSON.
This works with roubles only currently, you can repeat with different sets of presets with aditional currencies / barters if required.  (Or you could add a prefix to your builds names to determin type of currency and strip it at import, go wild)