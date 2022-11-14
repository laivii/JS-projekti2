document.getElementById("loadDoc").addEventListener("click", loadDoc);

function loadDoc(name1, name2) {

    var hetkellinen = name1 + name2; //Tallennettu myöhempää käyttöä varten (nöihin siis tulee käytettävät nimet talteen) poistetaan myöhemmin kun saadaan nimet parametreina

    const xhttp = new XMLHttpRequest(); //Making a new XML request

    //When getting a response this function does the things we want it to do
    xhttp.onload = function() {
        var responseObj = JSON.parse(this.responseText); //Parsing the json we get as a response, so we can use it
        console.log(responseObj); //Console log so we can look what we get

        document.getElementById("infoHere").innerHTML = this.responseText; //This one is atm useless, but this one writes the thing into the site
    }

    //Here we are defining the names to be used in the calculation
    sname = "Kalle"; //name1; //First name to be used in the calculatio
    fname = "Pentti"; //name2; //Second name to be used in the calculation

    xhttp.open("GET", "https://love-calculator.p.rapidapi.com/getPercentage?sname="+sname+"&fname="+fname, true); //the site we are requesting
    xhttp.setRequestHeader("X-RapidAPI-Key", "5784b570e7msh46bcabeb3618464p179590jsn272f2a0f6e83"); //here we tell our API key
    xhttp.setRequestHeader("X-RapidAPI-Host", "love-calculator.p.rapidapi.com"); //Here is the host
    xhttp.send(); //Lastly we send the request
}