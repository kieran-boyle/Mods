const fs = require('fs')
const fileName = './config.json'
const config = require(fileName)

const ChangeAll = document.getElementById("ChangeAll")
const ChangeAllAmount =  document.getElementById("ChangeAllAmount")
const Standard = document.getElementById("Standard")
const LeftBehind = document.getElementById("LeftBehind")
const PrepareForEscape = document.getElementById("PrepareForEscape")
const EdgeOfDarkness = document.getElementById("EdgeOfDarkness")
const StandardReset = document.getElementById("StandardReset")
const LeftBehindReset = document.getElementById("LeftBehindReset")
const PrepareForEscapeReset = document.getElementById("PrepareForEscapeReset")
const EdgeOfDarknessReset = document.getElementById("EdgeOfDarknessReset")
const aboutButton = document.getElementById("aboutButton")
var modal = document.getElementById("myModal")
var span = document.getElementsByClassName("close")[0]

const writeConfigValue = function(input)//writes any changes to the config to the file.
{
    if(input === debug || input === ChangeAll) config[input.id] = input.checked
    else config[input.id] = parseInt(input.value)
    
    fs.writeFile(fileName, JSON.stringify(config, null, 2), function writeJSON(err) 
    {
        if (err) return console.log(err)
    })
}

const verifyValues = function()//stops it being possible for the stash size to not ascend in value
{
    if(PrepareForEscape.value > EdgeOfDarkness.value)
    {
        EdgeOfDarkness.value = PrepareForEscape.value
        config.EdgeOfDarkness = parseInt(PrepareForEscape.value)
    }    
    if(LeftBehind.value > PrepareForEscape.value)
    {
        PrepareForEscape.value = LeftBehind.value
        config.PrepareForEscape = parseInt(LeftBehind.value)
    }
    if(Standard.value > LeftBehind.value )
    {
        LeftBehind.value = Standard.value
        config.LeftBehind = parseInt(Standard.value)
    }
}

setInterval(verifyValues, 50)

debug.addEventListener('change', () =>
{
    writeConfigValue(debug)
})


ChangeAll.addEventListener('change', () =>
{
    writeConfigValue(ChangeAll)
    if(ChangeAll.checked === true)
    {
        ChangeAllAmount.type = "number"
        ChangeAllAmount.value = config.ChangeAllAmount
        Standard.value = config.ChangeAllAmount
        Standard.disabled = true
        LeftBehind.value = config.ChangeAllAmount
        LeftBehind.disabled = true
        PrepareForEscape.value = config.ChangeAllAmount
        PrepareForEscape.disabled = true
        EdgeOfDarkness.value = config.ChangeAllAmount
        EdgeOfDarkness.disabled = true
        StandardReset.disabled = true
        LeftBehindReset.disabled = true
        PrepareForEscapeReset.disabled = true
        EdgeOfDarknessReset.disabled = true
    }
    else 
    {
        ChangeAllAmount.type = "hidden"
        Standard.value = config.Standard
        Standard.disabled = false
        LeftBehind.value = config.LeftBehind
        LeftBehind.disabled = false
        PrepareForEscape.value = config.PrepareForEscape
        PrepareForEscape.disabled = false
        EdgeOfDarkness.value = config.EdgeOfDarkness
        EdgeOfDarkness.disabled = false
        EdgeOfDarkness.disabled = false
        StandardReset.disabled = false
        LeftBehindReset.disabled = false
        PrepareForEscapeReset.disabled = false
        EdgeOfDarknessReset.disabled = false
    }
})


ChangeAllAmount.addEventListener('change', () =>
{
    writeConfigValue(ChangeAllAmount)
    Standard.value = config.ChangeAllAmount
    LeftBehind.value = config.ChangeAllAmount
    PrepareForEscape.value = config.ChangeAllAmount
    EdgeOfDarkness.value = config.ChangeAllAmount
})

Standard.addEventListener('change', () =>
{
    writeConfigValue(Standard)
})

StandardReset.addEventListener('click', () =>
{
    Standard.value = 28
    writeConfigValue(Standard)
})

LeftBehind.addEventListener('change', () =>
{
    writeConfigValue(LeftBehind)
})

LeftBehindReset.addEventListener('click', () =>
{
    LeftBehind.value = 38    
    writeConfigValue(LeftBehind)
})

PrepareForEscape.addEventListener('change', () =>
{    
    writeConfigValue(PrepareForEscape)
})

PrepareForEscapeReset.addEventListener('click', () =>
{
    PrepareForEscape.value = 48    
    writeConfigValue(PrepareForEscape)
})

EdgeOfDarkness.addEventListener('change', () =>
{    
    writeConfigValue(EdgeOfDarkness)
})

EdgeOfDarknessReset.addEventListener('click', () =>
{
    EdgeOfDarkness.value = 68    
    writeConfigValue(EdgeOfDarkness)
})

aboutButton.onclick = function()
{
    modal.style.display = "block"
}

span.onclick = function() 
{
    modal.style.display = "none"
}

window.onclick = function(event) 
{
    if (event.target == modal) modal.style.display = "none"
}