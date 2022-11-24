var vastaus;

document.getElementById("getData").addEventListener("click", loadDoc);

function loadDoc() {
    var xhr = new XMLHttpRequest;

    var location = getLocation();
    var date = todaysDate();

    xhr.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + location + "&dt=" + date, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            vastaus = xhr.responseXML;
            getInfo();
        }
    }
}

function getLocation(){
    var select = document.getElementById('location');
    var value = select.options[select.selectedIndex].value;
    var id = 0;
    console.log(value);

    switch (parseInt(value)) {
        case 1:
            id = 1045;
            break;
        case 2:
            id = 1031;
            break;
        case 3:
            id = 1032;
            break;
        case 4:
            id = 1033;
            break;
        default:
            
    }

    return id;
}

function todaysDate(){
    //Kokoaa päivän muotoa DD.MM.YYYY

    const d = new Date();

    var päivä = d.getDate();
    var kuukausi = d.getMonth();
    var vuosi = d.getFullYear();

    kuukausi = parseInt(kuukausi) + 1;

    var päiväys = päivä + "." + kuukausi + "." + vuosi;
    console.log(päiväys);

    return päiväys;
}

function getInfo(){
    document.getElementById("movies").innerHTML = "";
    //Searching specific movies
    var movies = vastaus.getElementsByTagName("Show");

    for(var i = 0; i < movies.length; i++){
        var movie = movies[i];
        //Getting the title
        var title = movie.getElementsByTagName("Title")[0];
        var otsikko = title.innerHTML; //Getting the title as text only

        //Searching for the movie posters
        var images = movie.getElementsByTagName("Images")[0];
        //Getting the right sized poster
        var poster = images.getElementsByTagName("EventSmallImagePortrait")[0];
        var portrait = poster.innerHTML; //Getting the text only (the url inside that tagname)

        var language = movie.getElementsByTagName("SpokenLanguage")[0];
        var kieli = language.innerHTML;
        //console.log(kieli);

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
    var container = document.getElementById("movies");

    var show = document.createElement("div");
        show.id = "movie"+i;
        show.className = "grid-item";
    container.appendChild(show);

    var title = document.createElement( "h4");
        title.innerHTML = otsikko;
    show.appendChild(title);

    var image = document.createElement("img");
        image.src = portrait;
    show.appendChild(image);

    var length = document.createElement("p");
        length.innerHTML = "Kesto: " + kesto + " min";
    show.appendChild(length);

    var language = document.createElement("p");
        language.innerHTML = "Kieli: " + kieli;
    show.appendChild(language);

    var startingTime = document.createElement("p");
        startingTime.innerHTML = "Aloitusaika: "+ alku; 
    show.appendChild(startingTime);

    var genre = document.createElement("p");
        genre.innerHTML = "Tyylilaji: " + laji;
    show.appendChild(genre);

    var tickets = document.createElement("a");
        tickets.href = liput;
        tickets.innerHTML = "Liput";
        tickets.target = "_blank";
    show.appendChild(tickets);
}