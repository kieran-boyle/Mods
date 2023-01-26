const fs = require('fs')
const fileName = '../config.json'
const config = require(fileName)

const ChangeAll = document.getElementById("ChangeAll")
const ChangeAllAmount =  document.getElementById("ChangeAllAmount")
const Standard = document.getElementById("Standard")
const LeftBehind = document.getElementById("LeftBehind")
const PrepareForEscape = document.getElementById("PrepareForEscape")
const EdgeOfDarkness = document.getElementById("EdgeOfDarkness")


const write = function(input)//writes any changes to the config to the file.
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
    if(EdgeOfDarkness.value < PrepareForEscape.value)
    {
        PrepareForEscape.value = EdgeOfDarkness.value
        config.PrepareForEscape = parseInt(EdgeOfDarkness.value)
    }    
    if(PrepareForEscape.value < LeftBehind.value)
    {
        LeftBehind.value = PrepareForEscape.value
        config.LeftBehind = parseInt(PrepareForEscape.value)
    }
    if(LeftBehind.value < Standard.value)
    {
        Standard.value = LeftBehind.value
        config.Standard = parseInt(LeftBehind.value)
    }
}

debug.addEventListener('change', () =>
{
    write(debug)
})


ChangeAll.addEventListener('change', () =>
{
    write(ChangeAll)
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
    }
})


ChangeAllAmount.addEventListener('change', () =>
{
    write(ChangeAllAmount)
    Standard.value = config.ChangeAllAmount
    LeftBehind.value = config.ChangeAllAmount
    PrepareForEscape.value = config.ChangeAllAmount
    EdgeOfDarkness.value = config.ChangeAllAmount
})

Standard.addEventListener('change', () =>
{
    verifyValues()
    write(Standard)
})

LeftBehind.addEventListener('change', () =>
{
    verifyValues()
    write(LeftBehind)
})

PrepareForEscape.addEventListener('change', () =>
{
    verifyValues()
    write(PrepareForEscape)
})

EdgeOfDarkness.addEventListener('change', () =>
{
    verifyValues()
    write(EdgeOfDarkness)
})