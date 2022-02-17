"use strict"

class FenceTweaks 
{

	static onLoadMod() 
	{

		const config = require("../config/config.json")
		const items = DatabaseServer.tables.templates.items
		const fenceAssort = DatabaseServer.tables.traders["579dc571d53a0658a154fbec"].assort
		const ragfairAssort = DatabaseServer.tables.traders.ragfair.assort
		const keys = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"]
		const parents = 
		[
			"5795f317245977243854e041", // Containers
			"5448bf274bdc2dfc2f8b456a", // Secure containers
			"543be5dd4bdc2deb348b4569" // Money
		]
		const IDs = 
		[
			"58ac60eb86f77401897560ff", // Dev balaclava
			"59e8936686f77467ce798647", // Test balaclava
			"5c0a794586f77461c458f892", // Secure Container Boss
			"56e294cdd2720b603a8b4575", // Mystery Ranch Terraplane backpack (Dev Backpack)
			"5732ee6a24597719ae0c0281", // Waist pouch
			"5fca13ca637ee0341a484f46", // SJ9 TGLabs combat stimulant injector (Thermal Stim)

			"590dde5786f77405e71908b2", // Bank Case
			"5a687e7886f7740c4a5133fb", // Blood Sample
			"5937fd0086f7742bf33fc198", // Bronze Pocket Watch
			"5910922b86f7747d96753483", // Carbon Case
			"5b4c81a086f77417d26be63f", // Chemical Container
			"5b43237186f7742f3a4ab252", // Chemical Container 2
			"5b4c81bd86f77418a75ae159", // Chemical Container 3
			"5ae9a3f586f7740aab00e4e6", // Clothes Design Handbook - Part 1
			"5ae9a4fc86f7746e381e1753", // Clothes Design Handbook - Part 2
			"5d3ec50586f774183a607442", // Encrypted Message
			"5c12301c86f77419522ba7e4", // Flash Drive with Fake Info
			"5eff135be0d3331e9d282b7b", // Flash drive marked with blue tape
			"5939a00786f7742fe8132936", // Zibbo Lighter
			"5ae9a0dd86f7742e5f454a05", // Goshan Cargo Manifests
			"5ae9a1b886f77404c8537c62", // IDEA Cargo Manifests
			"5efdaf6de6a30218ed211a48", // Marked Ophthalmoscope
			"60c080eb991ac167ad1c3ad4", // MBT Integrated Navigation System
			"608c22a003292f4ba43f8a1a", // Medical record #1
			"60a3b5b05f84d429b732e934", // Medical record #2
			"60915994c49cf53e4772cc38", // Military documents #1
			"60a3b6359c427533db36cf84", // Military documents #2
			"60a3b65c27adf161da7b6e14", // Military documents #3
			"5b4c72c686f77462ac37e907", // Motor Controller
			"5b4c72b386f7745b453af9c0", // Motor Controller 2
			"5af04c0b86f774138708f78e", // Motor Controller 3
			"5ae9a18586f7746e381e16a3", // OLI cargo manifests
			"5ae9a25386f7746dd946e6d9", // OLI cargo route documents
			"5ac620eb86f7743a8e6e0da0", // Package of graphics cards
			"5d357d6b86f7745b606e3508", // Photo album
			"5a294d8486f774068638cd93", // UAV SAS disk
			"5a294d7c86f7740651337cf9", // UAV SAS disk 2
			"5939e9b286f77462a709572c", // Sealed letter
			"591093bb86f7747caa7bb2ee", // Sealed letter 2
			"591092ef86f7747bb8703422", // Secure Folder 0022
			"5939e5a786f77461f11c0098", // Secure Folder 0013
			"5a6860d886f77411cd3a9e47", // Secure Folder 0060
			"593965cf86f774087a77e1b6", // Secure Folder 0048
			"5938188786f77474f723e87f", // Secure Folder 0031
			"5938878586f7741b797c562f", // Secure Folder 0052
			"5b4c72fb86f7745cef1cffc5", // Single-axis Fiber Optic Gyroscope
			"5af04e0a86f7743a532b79e2", // Single-axis fiber optic gyroscope 2
			"5a29357286f77409c705e025", // Sliderkey Flash drive
			"590c62a386f77412b0130255", // Sliderkey Secure Flash drive
			"5efdafc1e70b5e33f86de058", // Surgery kit marked with a blue symbol
			"593a87af86f774122f54a951", // Syringe with a chemical
			"609267a2bb3f46069c3e6c7d" // T-90M Commander Control Panel
		]

		var deleteItems = function (whichTrader) 
		{

			for (let eachId in whichTrader) 
			{

				if (Array.isArray(whichTrader)) //is it an array? we have to use splice
				{ 

					if (IDs.includes(whichTrader[eachId]._id)) 
					{
						whichTrader.splice(eachId, 1)
					}

				} else if (IDs.includes(eachId)) 
				{
					delete whichTrader[eachId] //if its an object we can use delete
				}
			}
		}

		if (config.removeKeys === true) //if you want to remove keys/keycards
		{ 
			keys.forEach(key => parents.push(key))
		}

		for (let eachItem in items) //push all the ID's from parent catogories to remove.
		{ 

			if (parents.includes(items[eachItem]._parent)) 
			{
				IDs.push(items[eachItem]._id)
			}
		}

		deleteItems(fenceAssort.barter_scheme) //They both have 3 parts we need to remove the id's from
		deleteItems(fenceAssort.loyal_level_items)
		deleteItems(fenceAssort.items) //array

		if (config.removeFromRagfair === true) //do we want to remove from fleamarket too?
		{ 
			deleteItems(ragfairAssort.barter_scheme)
			deleteItems(ragfairAssort.loyal_level_items)
			deleteItems(ragfairAssort.items) //array
		}
	}
}

module.exports = FenceTweaks