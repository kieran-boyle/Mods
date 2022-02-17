"use strict"

class ArmorDebuffRemover 
{

	static onLoadMod() 
	{

		const config = require("../config/config.json")
		const items = DatabaseServer.tables.templates.items
		const itemIDs = 
		[
			"5a341c4086f77401f2541505",
			"5448e5284bdc2dcb718b4567",
			"5448e54d4bdc2dcc718b4568",
			"5448e53e4bdc2d60728b4567"
		]
		const itemNames = ["Helmet", "Rig", "Armor", "Backpack"]

		for (let item in items) 
		{

			for (let id in itemIDs) 
			{

				if (itemIDs[id] === items[item]._parent) 
				{
					let configOption = itemNames[id]

					for (let debuf in config[configOption]) 
					{

						if (config[configOption][debuf] === true) 
						{
							let debufOption = debuf
							items[item]._props[debufOption] = 0
						}
					}
				}
			}
		}
	}
}

module.exports = ArmorDebuffRemover;