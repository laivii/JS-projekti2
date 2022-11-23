document.getElementById("getData").addEventListener("click", loadDoc);

/*class Movie {
    constructor(otsikko) {
        this.otsikko = otsikko;
    }
    
    createDiv() {
        let newdiv = createElement("div");
        let hone = createElement("h1")

        hone.innerHTML(this.otsikko)
        document.getElementById()
    }
}*/

function loadDoc() {
    var xhr = new XMLHttpRequest;

    var location = getLocation();
    var date = todaysDate();

    xhr.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + location + "&dt=" + date, true);
    xhr.send();

    xhr.onload = function(){
        //GEtting the response
        var vastaus = xhr.responseXML;

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
            var poster = images.getElementsByTagName("EventMediumImagePortrait")[0];
            var portrait = poster.innerHTML; //Getting the text only (the url inside that tagname)

            /*let new_movie = new Movie(otsikko);
            new_movie.createDiv();
            console.log(new_movie);*/

            document.write(`
                <div id='movie[i]'>
                    <h1> ${otsikko} </h1>
                    <img src='${portrait}'>
                </div>
            `);
        }
    }
}

function getLocation(){
    var select = document.getElementById('location');
    var value = select.options[select.selectedIndex].value;
    var id = 0;

    switch (parseInt(value)) {
        case 1:
            id = 1002;
            break;
        case 2:
            id = 1012;
            break;
        case 3:
            id = 1021;
            break;
    }

    console.log(id);

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