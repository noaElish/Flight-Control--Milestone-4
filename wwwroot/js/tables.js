//the timer for the function
var myvar = setInterval(myTimer, 3000);
let i = 0;
//the function that sets the data for the table on the side.
function myTimer() {
    //create the path
    var today = new Date().toISOString();
    var time = today.substring(0, today.length - 5);
    var time = today.substring(0, today.length - 5);
    var apiU = "../api/Flights?relative_to=" + time + "Z&sync_all";

    $.getJSON(apiU, function (data) {
        data.forEach(function (flight) {
            console.log(flight.flight_id);
            //create the 3 variables for each of the flight so they have there unique names.
            let deleteName = "deleteMe " + flight.flight_id;
            let companyName = "company " + flight.flight_id;
            let idName = "id  " + flight.flight_id;

            let companyExt = "company " + flight.flight_id;
            let idNameExt = "id  " + flight.flight_id;


            //if the flight is external- show thw data on the buttom table.
            if (flight.is_external == true) {
                console.log("is external");


                var apppendEx = ("<tr><td><input type='button'id='" + companyExt + "' style='border: 2px solid #808080;background-color:#808080;color:white'   value='" + flight.flight_id + "'>" + "</td>"
                    + "<td><input type='button' id='" + idNameExt + "' style='border: 2px solid #808080;background-color:#808080;color:white' value='" + flight.company_name + "'>" + "</td>" +
                    + "<tr><td>");


                //$("#ex").append("<tr><td>" + flight.flight_id + "</td>"
                //    + "<td>" + flight.company_name + "<tr><td>");
                $("#ex").append(apppendEx);
                //delete the data from the append value.
                apppendEx = undefined;
            
           
                //if click on id-
                document.getElementById(idName).onclick = function () {
                    //show the data on the buttom table, and the flight lane, and change its icon.
                    downTable(flight);
                    showRoute(flight);
                    fixIcon();
                }
                //if click on company-
                document.getElementById(companyName).onclick = function () {
                    //show the data on the buttom table, and the flight lane, and change its icon.
                    downTable(flight);
                    showRoute(flight);
                    fixIcon();
                }


            }
            //if the flight is internal- show thw data on the buttom table.
            if (flight.is_external == false) {
                //make sure the data is empty before every insertion.
                $('#deleteV').remove(companyName);
                $("#deleteV").remove(deleteName);
                $("#deleteV").remove(idName);
                //create the append value to each flight.
                var app = ("<tr><td><input type='button'id='" + idName + "' style='border: 2px solid #808080;background-color:#808080;color:white'   value='" + flight.flight_id + "'>" + "</td>"
                    + "<td><input type='button' id='" + companyName + "' style='border: 2px solid #808080;background-color:#808080;color:white' value='" + flight.company_name + "'>" + "</td>" +
                    "<td><input type='button' id='" + deleteName + "' value='delete ' /*<img src='https://image.flaticon.com/icons/svg/60/60761.svg'*/  height='20px'></button></td > "
                    + "<tr><td>");
                //append the data to the table.
                $("#my").append(app);
                //delete the data from the append value.
                app = undefined;
                //if click on delete-
                document.getElementById(deleteName).onclick = function () {
                    //remove the row from the table.
                    $(this).closest('tr').remove();
                    //delete the flight from our data.
                    myDeleteFunction(flight.flight_id);
                }
                //if click on id-
                document.getElementById(idName).onclick = function () {
                    //show the data on the buttom table, and the flight lane, and change its icon.
                    downTable(flight);
                    showRoute(flight);
                    fixIcon();
                }
                //if click on company-
                document.getElementById(companyName).onclick = function () {
                    //show the data on the buttom table, and the flight lane, and change its icon.
                    downTable(flight);
                    showRoute(flight);
                    fixIcon();
                }
            }
        });

    }).done(function () { console.log('getJSON request succeeded!'); })
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

    //clean the tables each time.
    $('#my tbody > tr').remove();
    $('#ex tbody > tr').remove();

}

//if we pressed on delete.
function myDeleteFunction(id) {
    if (id != undefined) {
        //delete the lane and the icon.
        deleteOnMap();
        //deleteIcon();

        let del = "../api/Flights/" + id;
        console.log(del);
        $.ajax({
            type: 'DELETE',
            url: del,
            success: function (data) {
                console.log("ajax delete succeed")
            },
            error: function (jqXhr, textstatuse, errorMessage) {

                //let a = getElementById("warning");
                //a.innerHTML = 'error' + jqXhr.responseJSON.status;
                generalError = true;
                let element = document.getElementById("warning");
                element.innerHTML = "Error getting data from the server - error " + jqXhr.responseJSON.status;
                element.style.visibility = 'visible';

                element.style.opacity = "1.0";
                setTimeout(function () {
                    document.getElementById("warning").style.opacity = "0.0"
                }, 5000);

            }
        });
    }
}

