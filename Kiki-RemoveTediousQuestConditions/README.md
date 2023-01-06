# Mod RemoveTediousQuestConditions

This mod gives you a config file which enables you to remove certain requirements from quests.
(full explanation below
 All option are disabled by default!)

This is based on @Toasty remove tedious quests
 but uses non of their code.

#toDo
Add more conditions ie. time
 map number of kills required..
Add options for other annoying quests ie. kill killa 100 times.

***Detailed config explanation with lists of effected quests (at time of writing)***

For each option
 set to true to enable
 false to disable.

weaponModsInclusive = Requires you to use a specific attachment when you get kills.

    The Punisher Part 2
    Wet Job Part 1
    The Tarkov shooter Part 7
    Silent caliber
    Test drive Part 1
    Hunting trip

weaponModsExclusive = Requires you to NOT use a specific attachment when you get kills.

    The Tarkov shooter Part 1

weapon = Requires you to use a specific weapon when you get kills.
    
    Stirrup
    The Punisher Part 1
    The Punisher Part 3
    The Punisher Part 4
    The Punisher Part 6
    Spa Tour Part 1
    Wet Job Part 1
    The Tarkov shooter Part 1
    The Tarkov shooter Part 3
    The Tarkov shooter Part 5
    The Tarkov shooter Part 6
    The Tarkov shooter Part 7
    The Tarkov shooter Part 8
    Silent caliber
    Test drive Part 1
    Grenadier
    Peacekeeping mission
    Setup
    Hunting trip
    Compensation For Damage - Wager
    Letters
	

equipmentInclusive = Requires you to use specific equipment when you get kills.

    The Punisher Part 4
    The Punisher Part 5
    Humanitarian Supplies
    Decontamination service
    Peacekeeping mission
    Setup

equipmentExclusive = Requires you to NOT use specific equipment when you get kills.

    The survivalist path Unprotected but dangerous
    The survivalist path Eagle-owl
    Swift One

distance = Requires you to make kills from a minimum distance.

    The Tarkov shooter Part 1
    The Tarkov shooter Part 3
    The Tarkov shooter Part 7
    Test drive Part 1
    A Shooter Born in Heaven
    Decontamination service
    Hunting trip
    Calibration

bodyPart = Requires you to kill by hitting a certain body part (leg
 head etc)

    Spa Tour Part 1
    Insomnia
    A Shooter Born in Heaven
    Grenadier
    The survivalist path Cold blooded
    Intimidator

Locations = Requires you to perform actions on a specific map

    Shootout picnictrueDelivery from the past
    Bad rep evidence
    Postman Pat Part 1
    Operation Aquarius Part 1
    Operation Aquarius Part 2
    Supply plans
    Polikhim hobo
    Chemical Part 4
    Out of curiosity
    Big customer
    BP depot
    The Punisher Part 1
    The Punisher Part 2
    The Punisher Part 3
    The Punisher Part 4
    The Punisher Part 6
    Spa Tour Part 1
    Spa Tour Part 2
    Spa Tour Part 4
    Fishing Gear
    Tigr Safari
    Scrap Metal
    Humanitarian Supplies
    The Cult Part 1
    Cargo X Part 3
    Wet Job Part 1
    Wet Job Part 2
    Wet Job Part 3
    Health Care Privacy Part 1
    Health Care Privacy Part 2
    Health Care Privacy Part 3
    Health Care Privacy Part 5
    Farming Part 1
    Signal Part 1
    Signal Part 3
    Scout
    Make ULTRA Great Again
    Big sale
    The Blood of War
    Sales Night
    Minibus
    Chumming
    The Tarkov shooter Part 5
    The Tarkov shooter Part 8
    Insomnia
    A Shooter Born in Heaven
    Decontamination service
    Peacekeeping mission
    The guide
    The Blood of War Part 3
    Setup
    The survivalist path Unprotected but dangerous
    The survivalist path Zhivchik
    The survivalist path Tough guy
    The survivalist path Eagle-owl
    Huntsman path Secured perimeter
    Huntsman path Evil watchman
    Courtesy visit
    The survivalist path Junkie
    Anesthesia
    Colleagues Part 1
    Rigged game
    Bunker Part 1
    Bunker Part 2
    The chemistry closet
    Search Mission
    No place for renegades
    Safe corridor
    Inventory check
    Fuel matter
    Escort
    The Cleaner
    Swift One
    Lost Contact
    Our Own Land
    Counteraction
    Cargo X Part 4
    Reconnaissance

InZone = requires you to kill within a specific zone in a map
 	
    Huntsman path Secured perimeter
    Huntsman path Evil watchman
    No place for renegades
    Back door
    Safe corridor
    Pest control
    Capturing Outposts
    Long Line
    Easy Job Part 2
    Overpopulation
    Long Road


VisitPlace = Go to a certain place in a map

    Bad rep evidence
    Ice cream cones
    Shaking up teller
    Sanitary Standards Part 1
    Operation Aquarius Part 1
    Pharmacist
    The Extortionist
    Chemical Part 1
    Chemical Part 4
    Out of curiosity
    Big customer
    Spa Tour Part 4
    Fishing Gear
    Eagle Eye
    Humanitarian Supplies
    The Cult Part 1
    Cargo X Part 2
    Cargo X Part 3
    Wet Job Part 2
    Wet Job Part 3
    Health Care Privacy Part 3
    Health Care Privacy Part 5
    Farming Part 3
    Signal Part 1
    Scout
    Big sale
    Courtesy visit
    Nostalgia
    Reserv
    Colleagues Part 1
    TerraGroup employee
    Bunker Part 1
    Bunker Part 2
    The chemistry closet
    Search Mission
    Revision
    Back door
    Inventory check



HealthEffect = requires you to have specific debuffs

	The survivalist path Zhivchik
    The survivalist path Wounded beast
    The survivalist path Cold blooded
    The survivalist path Junkie 

setPMC = There is one quest which requires you to kill USEC (this can be an issue if you are playing USEC with all AI PMC set to Bear)
    If true this will allow any PMC kills to count.

     Friend from the West Part 1

debug = will show in the console the condition affectedand all the quests impacted by this.