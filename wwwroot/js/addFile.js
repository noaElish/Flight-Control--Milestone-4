//create main and initialize the function to recieve a flight plan
main();


function main() {
    fileInizial();
}
function fileInizial() {
    const uploadFiles = document.getElementById("uploadFiles"),
        fileE = document.getElementById("fileE");
    //add the function of click on the button to upload files
    uploadFiles.addEventListener("click", function (e) {
        if (fileE) {
            fileE.click();
        }
    }, false);
    //add new listener to the button
    fileE.addEventListener("change", handleFiles, false);
}

function handleFiles() {
    console.log("inJson");
    if (this.files[0] == null) {
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const text = event.target.result;
        sendToPost(text);
        //for the change will happen
        this.files[0] = null;
    });
    reader.readAsText(this.files[0]);

}
//send the flight plan to post
function sendToPost(text) {

    $(document).ready(function () {
        $.ajax({
            type: 'POST',
            url: 'api/FlightPlan',
            data: text,
            contentType: 'application/json',
            success: function () {
                generalError = false;
                console.log("ajax post succeed");
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback 
                generalError = true;
                let element = document.getElementById("warning");
                element.innerHTML = "Error getting data from the server - error " + jqXhr.responseJSON.status; //show the error play
                element.style.visibility = 'visible';

                element.style.opacity = "1.0";
                setTimeout(function () {
                    document.getElementById("warning").style.opacity = "0.0"
                }, 5000);
            }
        });
    });
}