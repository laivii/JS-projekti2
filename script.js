//Global variable (will get the XML response as value)
var vastaus;

//Listener for the XML request to be made
document.getElementById("getData").addEventListener("click", loadDoc);

//Listener for enter to simulate click effect
document.getElementById("location").addEventListener("keypress", submitWithEnter);
document.getElementById("whatDay").addEventListener("keypress", submitWithEnter);

function loadDoc() {
    //Making the XML request
    var xhr = new XMLHttpRequest;

    //Defining information to be given to the url show we get specific data
    var location = getLocation();
    var date = todaysDate();

    xhr.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + location + "&dt=" + date, true);
    xhr.send();

    //When the request is ready
    xhr.onreadystatechange = function(){
        //If the response is valid
        if(this.readyState == 4 && this.status == 200){
            vastaus = xhr.responseXML;
            getInfo();
        }
    }
}

function getLocation(){
    //Getting the information about the select user has made
    var select = document.getElementById('location');
    var value = select.options[select.selectedIndex].value;
    var id;

    //Choosing/assigning the right id to use
    switch (parseInt(value)) {
        case 1:
            id = 1045; //Itis
            break;
        case 2:
            id = 1031; //Kinopalatsi
            break;
        case 3:
            id = 1032; //Maxim
            break;
        case 4:
            id = 1033; //Tennispalatsi
            break;
        default:
            
    }

    return id;
}

function todaysDate(){
    //Getting the information about the select user has made
    var select = document.getElementById('whatDay');
    var value = select.options[select.selectedIndex].value;

    //Variables
    const d = new Date();
    var päivä = d.getDate();
    var kuukausi = d.getMonth();
    var vuosi = d.getFullYear();

    //To get the right month we have to add 1 (parseing because kuukausi is type "str")
    kuukausi = parseInt(kuukausi) + 1;

    //Calculating the dates
    switch(parseInt(value)){
        case 1:
            päivä = päivä; //"Päivä" stays the same
            break;
        case 2:
            päivä = parseInt(päivä)+1; //Adding 1 to the day to get the date of tomorrow
            break;
        case 3:
            päivä = parseInt(päivä)+2; //Adding 2 to the day to get the day after tommorrows date
            break;
    }

    var päiväys = päivä + "." + kuukausi + "." + vuosi;

    //Changing elements with id "whatDate" innerHTML to have the text "Näytökset: " and the calculated date
    document.getElementById("whatDate").innerHTML = "Näytökset: " + päiväys;
    document.getElementById("whatDate").className = ""; //Removing it's class "hide" so it shows

    return päiväys;
}

function getInfo(){
    //Emptying the div incase there already is some movies so we can show new ones
    document.getElementById("movies").innerHTML = "";

    //Searching specific movies
    var movies = vastaus.getElementsByTagName("Show");

    //This loop goes through a list of all the movies and collects data we need
    for(var i = 0; i < movies.length; i++){
        
        var movie = movies[i];
    
        var title = movie.getElementsByTagName("Title")[0];
        var otsikko = title.innerHTML;

        var images = movie.getElementsByTagName("Images")[0];

        var poster = images.getElementsByTagName("EventMediumImagePortrait")[0];
        var portrait = poster.innerHTML;

        var language = movie.getElementsByTagName("SpokenLanguage")[0];
        var kieli = language.innerHTML;

        var showtime = movie.getElementsByTagName("dttmShowStart")[0];
        var alku = showtime.innerHTML;
        alku = alku.slice(11, alku.length-3);
    
        var genre = movie.getElementsByTagName("Genres")[0];
        var laji = genre.innerHTML;

        var movielength = movie.getElementsByTagName("LengthInMinutes")[0];
        var kesto = movielength.innerHTML;

        var tickets = movie.getElementsByTagName("ShowURL")[0];
        var liput = tickets.innerHTML;

        displayMovies(i,otsikko, portrait, kieli, alku, laji, kesto, liput);
    }
}

function displayMovies(i, otsikko, portrait, kieli, alku, laji, kesto, liput){
    //This function makes the display of the movies with data we have collected before

    var container = document.getElementById("movies"); //This is a grid-container that will have all the "moviecards"

    //Creating "div element" for the individual movie
    var show = document.createElement("div");
        show.id = "movie"+i;
        show.className = "grid-item row";
    container.appendChild(show);

    var header = document.createElement("div");
        header.className = "col-sm-12 header";
    show.appendChild(header);

    var title = document.createElement("h5");
        title.innerHTML = otsikko;
    header.appendChild(title);

    //Creating two columns to display data in
    var column1 = document.createElement("div");
        column1.className = "col-sm-4 column1";
    show.appendChild(column1);

    var column2 = document.createElement("div");column1
        column2.className = "col-sm-8 column2";
    show.appendChild(column2);

    //Appending data into columns
    var image = document.createElement("img");
        image.src = portrait;
    column1.appendChild(image);

    var startingTime = document.createElement("p");
        startingTime.innerHTML = "Aloitusaika: "+ alku;
    column2.appendChild(startingTime);

    
    var length = document.createElement("p");
        length.innerHTML = "Kesto: " + kesto + " min";
    column2.appendChild(length);

    var language = document.createElement("p");
        language.innerHTML = "Kieli: " + kieli;
        language.className = "kieli";
    column2.appendChild(language);

    var genre = document.createElement("p");
        genre.innerHTML = "Tyylilaji: " + laji;
    column2.appendChild(genre);

    var tickets = document.createElement("a");
        tickets.href = liput;
        tickets.innerHTML = "LIPUT";
        tickets.target = "_blank";
    column2.appendChild(tickets);
}

function submitWithEnter(enter){
    //If the key is not "Enter" then the code will not process
    if(enter.key != "Enter"){
        return;
    }

    enter.preventDefault();

    //Simulates a mouse click on "Submit"-button
    document.getElementById("getData").click();
    document.getElementById("whatDay").click();
}