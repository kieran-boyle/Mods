window.addEventListener('DOMContentLoaded', () => 
{//sets the initial values of the page to those in the config
    const config = require('./config.json')
    
    document.getElementById("debug").checked = config.debug
    
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


    if(config.ChangeAll === false)
    {
        ChangeAll.checked = config.ChangeAll
        ChangeAllAmount.setAttribute("type", "hidden")
        Standard.value = config.Standard
        LeftBehind.value = config.LeftBehind
        PrepareForEscape.value = config.PrepareForEscape
        EdgeOfDarkness.value = config.EdgeOfDarkness
    } 
    else
    {
        ChangeAll.checked = config.ChangeAll
        ChangeAllAmount.setAttribute("type", "number")
        ChangeAllAmount.value = config.ChangeAllAmount
        Standard.value = config.ChangeAllAmount
        Standard.setAttribute("disabled", "true")
        LeftBehind.value = config.ChangeAllAmount
        LeftBehind.setAttribute("disabled", "true")
        PrepareForEscape.value = config.ChangeAllAmount
        PrepareForEscape.setAttribute("disabled", "true")
        EdgeOfDarkness.value = config.ChangeAllAmount
        EdgeOfDarkness.setAttribute("disabled", "true")
        StandardReset.setAttribute("disabled", "true")
        LeftBehindReset.setAttribute("disabled", "true")
        PrepareForEscapeReset.setAttribute("disabled", "true")
        EdgeOfDarknessReset.setAttribute("disabled", "true")
    }
})