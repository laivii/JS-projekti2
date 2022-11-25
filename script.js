//Making a global variable which value will be later assigned (this.value will be the XML response)
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

    //
    xhr.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + location + "&dt=" + date, true);
    xhr.send();

    //When the request is ready
    xhr.onreadystatechange = function(){
        //If the response is valid
        if(this.readyState == 4 && this.status == 200){
            //Set global variable as responseXML
            vastaus = xhr.responseXML;

            //Do the next step which is to get the information we want with this function
            getInfo();
        }
    }
}

function getLocation(){
    //Assigning variables
    var select = document.getElementById('location'); //as the dropdown where you choose location
    var value = select.options[select.selectedIndex].value; //as the value of the option which is selected

    //Formatting id
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

    //Returning the id to be used in the request
    return id;
}

function todaysDate(){
    //Asiigning variables
    var select = document.getElementById('whatDay'); //As the dropdown where we choose which day ("today", "tomorrow" or "the day after tomorrow")
    var value = select.options[select.selectedIndex].value; //As the value of the option which is selected

    //Constructin todays date
    const d = new Date();

    var päivä = d.getDate(); //the day
    var kuukausi = d.getMonth(); //the month
    var vuosi = d.getFullYear(); //The year
    var päiväys;

    kuukausi = parseInt(kuukausi) + 1; //to get the right month we have to add 1 (parseing so we can add the 1 else you add one to the type on str)

    //Calculating the dates all have same month and year
    switch(parseInt(value)){
        case 1:
            päiväys = päivä + "." + kuukausi + "." + vuosi;
            break;
        case 2:
            päiväys = parseInt(päivä)+1 + "." + kuukausi + "." + vuosi; //Adding 1 to the day to get the date of tomorrow
            break;
        case 3:
            päiväys = parseInt(päivä)+2 + "." + kuukausi + "." + vuosi; //Adding 2 to the day to get the day after tommorrows date
            break;
    }

    //Changing elements with id "whatDate" innerHTML to have the text "Näytökset: " and the calculated date
    document.getElementById("whatDate").innerHTML = "Näytökset: " + päiväys;
    document.getElementById("whatDate").className = ""; //Removing it's class "hide" so it shows

    //Returning "päiväys" to be used in the XML request
    return päiväys;
}

function getInfo(){
    //Emptying the div incase there already is some movies so we can show new ones
    document.getElementById("movies").innerHTML = "";

    //Searching specific movies (the "vastaus" is a global variable that we have formatted before and which we assign value in function named "loadDoc")
    var movies = vastaus.getElementsByTagName("Show");

    //This loop goes through a list of all the movies
    for(var i = 0; i < movies.length; i++){
        //Selecting movies one by one 
        var movie = movies[i]; //"Movie" is item index "i" of the list "movies"

        //Getting the title
        var title = movie.getElementsByTagName("Title")[0];
        var otsikko = title.innerHTML; //Getting the title as text only

        //Searching for the movie posters
        var images = movie.getElementsByTagName("Images")[0];

        //Getting the right sized poster
        var poster = images.getElementsByTagName("EventMediumImagePortrait")[0];
        var portrait = poster.innerHTML; //Getting the text only (the url inside that tagname)

        //Getting the Spoken langueage
        var language = movie.getElementsByTagName("SpokenLanguage")[0];
        var kieli = language.innerHTML;
        //console.log(kieli);

        //Getting the starting time of the screening
        var showtime = movie.getElementsByTagName("dttmShowStart")[0];
        var alku = showtime.innerHTML;
        alku = alku.slice(11, alku.length-3); //Deleting not relevant information, we want only the hour and minute (format: HH:MM)
        
        //Getting the genres/genre of the movie
        var genre = movie.getElementsByTagName("Genres")[0];
        var laji = genre.innerHTML;

        //Getting the length of the movie in minutes
        var movielength = movie.getElementsByTagName("LengthInMinutes")[0];
        var kesto = movielength.innerHTML;

        //Getting the URL to buy the ticket to this screening
        var tickets = movie.getElementsByTagName("ShowURL")[0];
        var liput = tickets.innerHTML;

        //This function makes the display of the movies with given parametres that we got the values/information in this function
        displayMovies(i,otsikko, portrait, kieli, alku, laji, kesto, liput);
    }
}

function displayMovies(i, otsikko, portrait, kieli, alku, laji, kesto, liput){
    //Getting the "div" element where we want to display the movies
    var container = document.getElementById("movies"); //This is a grid-container

    //Creating "div element"
    var show = document.createElement("div");
        show.id = "movie"+i; //Assigning id
        show.className = "grid-item row"; //Creating "div element"
    container.appendChild(show); //Appending it to the div with id "movies"

    //Creating "div element"
    var col12 = document.createElement("div");
        col12.className = "col-sm-12 col12"; //Assigning id
    show.appendChild(col12); //Appending to div with class "grid-item"

    var title = document.createElement("h5");
        title.innerHTML = otsikko; //Giving the innerHTML value
    col12.appendChild(title); //Appending to col12

    //Creating "div element"
    var col1 = document.createElement("div");
        col1.className = "col-sm-4 col1"; //Assigning id
    show.appendChild(col1); //Appending to the grid-item

    //Creating "div element"
    var col2 = document.createElement("div");
        col2.className = "col-sm-8 col2"; //Assigning id
    show.appendChild(col2); //Appending to the grid-item

    //Creating "img" element to show the movie's poster
    var image = document.createElement("img");
        image.src = portrait; //Giving the source of the picture (Here it's an URL)
    col1.appendChild(image); //Appenging to col1

    //Creating "p" element for starting time
    var startingTime = document.createElement("p");
        startingTime.innerHTML = "Aloitusaika: "+ alku; //Giving the innerHTML value
    col2.appendChild(startingTime); //Appending to col2

    //Creating "p" element for the length of the movie
    var length = document.createElement("p");
        length.innerHTML = "Kesto: " + kesto + " min"; //Giving the innerHTML value
    col2.appendChild(length); //Appending to col2

    //Creating "p" element for the language of the movie
    var language = document.createElement("p");
        language.innerHTML = "Kieli: " + kieli; //Giving the innerHTML value
        language.className = "kieli"; //Assigning id
    col2.appendChild(language); //Appending to col2

    //Creating "p" element for the genre(s) of the movie
    var genre = document.createElement("p");
        genre.innerHTML = "Tyylilaji: " + laji; //Giving the innerHTML value
    col2.appendChild(genre); //Appending to col2

    //Creating a "a" element (a link)
    var tickets = document.createElement("a");
        tickets.href = liput; //Giving the href as in the URL for this link
        tickets.innerHTML = "LIPUT"; //Giving the innerHTML value
        tickets.target = "_blank"; //Formating the target (this one says to open a new blank window)
    col2.appendChild(tickets); //Appending to col2
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