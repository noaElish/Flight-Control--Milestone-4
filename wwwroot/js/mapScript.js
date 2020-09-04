//making a map and tiles.
var mymap = L.map('viewMap').setView([34.4666, 36.5555], 1);
L.tileLayer('http://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=f8r453uR6vELlt49X1ng', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(mymap);

//creating the icon for the map.
var myIcon = L.icon({
    iconUrl: 'airplane2.png',
    iconSize: [50, 50],
    iconAnchor: [53, 35]

});

//the layers for the map.
let layerLine = L.layerGroup();
layerLine.addTo(mymap);
let layerIcon = L.layerGroup();
layerIcon.addTo(mymap);
let line = [];
var other = 0;

//timer function for the map- every 3 seconds.
var myvar = setInterval(mapTimer, 3000);
function mapTimer() {
    //clean the layes every time
    layerIcon.clearLayers();
    //put the string fot the function.
    var today = new Date().toISOString();
    var time = today.substring(0, today.length - 5);
    var apiFlight = "../api/Flights?relative_to=" + time + "Z&sync_all";
    console.log(apiFlight);
    $.getJSON(apiFlight, function (data) {
        data.forEach(function (flight) {
            console.log(flight.flight_id);
            //create the market for the flight.
            const marker = L.marker([flight.latitude, flight.longitude], { icon: myIcon }).addTo(mymap).on('click', function (e) {
                other = flight.flight_id;
                clearInterval(stop);
                layerLine.clearLayers();

                //set the icon to show we pressed the airplain.
                var myIcon3 = L.icon({
                    iconUrl: 'airplane4.png',
                    iconSize: [50, 50],
                    iconAnchor: [53, 35]
                });
                marker.setIcon(myIcon3);


                //erase the last table
                $('#table tbody > tr').remove();
                //show the dat of the plain in the buttom table.
                downTable(flight);

                //show the line of the flight.
                showRoute(flight);


            });
            //add the marker to the map each time.
            marker.addTo(layerIcon);
        });
    })
        .done(function () { console.log('getJSON request succeeded!'); })
        .fail(function (jqXhr, textStatus, errorThrown) {
            generalError = true;
            let element = document.getElementById("warning");
            element.innerHTML = "Error getting data from the server - error " + jqXhr.responseJSON.status;
            element.style.visibility = 'visible';

            element.style.opacity = "1.0";
            setTimeout(function () {
                document.getElementById("warning").style.opacity = "0.0"
            }, 5000);
        });


    //delete the map if we press on the map
    mymap.on('click', function () {
        deleteOnMap();
    });
}



//var myCheck = setInterval(checkFlight(flight), 1000);
let stop = setInterval(function checkFlight(flight) {

    var today = new Date().toISOString();
    var time = today.substring(0, today.length - 5);
    var apiForCheck = "../api/Flights?relative_to=" + time + "Z&sync_all";

    let check = 0;
    $.getJSON(apiForCheck, function (allTheFlights) {
        allTheFlights.forEach(function (f) {
            if (f.flight_id == flight.flight_id) {
                check = 1;
            }
        });
        if (check == 0) {
            deleteOnMap();
        }
    });

}, 3000);



//delete the line and flight details.
function deleteOnMap() {
    layerLine.clearLayers();
    $('#table tbody > tr').remove();
}


//the function that shows the details of the flight.
function downTable(flight) {
    //work only if we got real value.
    if (flight != undefined) {
        var apil = "../api/FlightPlan/" + flight.flight_id;
        $.getJSON(apil, function (f) {
            //append the flight data to the table.
            let i = f.segments;
            $("#table").append("<tr><td>" + flight.flight_id + "</td>"
                + "<td>" + f.passengers + "</td>"
                + "<td>" + f.company_name + "</td>"
                + "<td>" + f.loc.date_time + "</td>"
                + "<td>" + "(" + f.loc.latitude + " , " + f.loc.longitude + ")" + "</td>"
                + "<td>" + "(" + f.segments[i.length - 1].latitude + " , " + f.segments[i.length - 1].longitude + ")" + "<tr><td>");
        })

            .done(function () { console.log('getJSON request succeeded!'); })
            .fail(function (jqXhr, textStatus, errorThrown) {
                generalError = true;
                let element = document.getElementById("warning");
                element.innerHTML = "Error getting data from the server - error " + jqXhr.responseJSON.status;
                element.style.visibility = 'visible';

                element.style.opacity = "1.0";
                setTimeout(function () {
                    document.getElementById("warning").style.opacity = "0.0";
                }, 5000);
            });


    }
    //make sure to take the currect longtitud and latitude from the data.
    $('#table tbody > tr').remove();
}

//the function that shows the flight routh
function showRoute(flight) {
    layerLine.clearLayers();
    //work only if we got real value.
    if (flight != undefined) {
        var apiU = "../api/FlightPlan/" + flight.flight_id;
        $.getJSON(apiU, function (data) {
            let o = 0;
            //add the first point of flight
            line.push([data.loc.latitude, data.loc.longitude]);
            o = o + 1;
            //add the segments
            data.segments.forEach(function (seg) {
                line.push([seg.latitude, seg.longitude]);
                o = o + 1;
            });
            var polyline = L.polyline(line, { color: '#e03434' }, { lineJoin: 'round' }, { stroke: false }).addTo(layerLine);
            //clear the objext
            while (o != 0) {
                line.pop();
                o = o - 1;
            }
            
        })
            .done(function () { console.log('getJSON request succeeded!'); })
            .fail(function (jqXhr, textStatus, errorThrown) {
                generalError = true;
                let element = document.getElementById("warning");
                element.innerHTML = "Error getting data from the server - error " + jqXhr.responseJSON.status;
                element.style.visibility = 'visible';

                element.style.opacity = "1.0";
                setTimeout(function () {
                    document.getElementById("warning").style.opacity = "0.0";
                }, 5000);
            });
    }

}

//when press on the flight icon- change its color.
function fixIcon() {
    var myIcon3 = L.icon({
        iconUrl: 'airplane4.png',
        iconSize: [50, 50],
        iconAnchor: [53, 35]
    });
    marker.setIcon(myIcon3);
}

//when deleting flight- delete its icon right away.
function deleteIcon() {
    var myIcon4 = L.icon({
        iconUrl: 'airplane4.png',
        iconAnchor: [53, 35],
        iconSize: [0, 0]

    });
    marker.setIcon(myIcon4);
}