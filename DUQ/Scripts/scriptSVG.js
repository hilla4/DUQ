﻿/*
 * Global variables:
 *
 * string lastID- a variable that contains the last clicked/searched ID for purposes of restoring its fill
 *                property on next click
 * currentFloor-when changing the select object or when routed to a new floor from search the current floor
 *              is set so it knows if it needs to route to a new floor at certain times
 * reD- regular expression that checks if an ID matches the appropriate format of a specific capital letter
 *      followed by 4 integers
 * */
var lastID;
var currentFloor;
var reD = /(D|M|S)[0-9]{4}/

/*
 * document.ready
 *
 * Jquery function used on page load.
 * currently sets the current floor based on url and adds an on click listener to all elements
 * with the ID of the format given by reD.
 * Also checks url for query parameters and if it exists calls the necessary functions
 */
$(document).ready(function () {
    const path = window.location.pathname;
    currentFloor = path[path.length - 1];
    if (currentFloor == "/") {
        currentFloor = "1";
    }
    $("*").each(function () {
        if (reD.test(this.id)) {
            isOccupied(this.id);
            $("#" + this.id).on("click", GetController);
        }
    });

    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    let ID = urlParams.get('ID');
    if (ID) {
        lastID = ID;
        setFill(ID);
        ajaxCall(ID);
    }
});

/*
 * document.addEventListener
 *
 * gets div containing SVG and attaches even listener that allows for click and drag functionality on map
 */
document.addEventListener('DOMContentLoaded', function () {
    const ele = document.getElementById('map');
    ele.style.cursor = 'grab';

    let pos = { top: 0.5, left: 0.5, x: 0.5, y: 0.5 };

    const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});

/*
 * Function GetController
 *
 * This is the function set  on all the clickable locations that changes fill on click and makes a call to the controller with the id
 */
function GetController() {
    let temp = $(this).attr('id');
    setFill(temp);
    ajaxCall(temp);
}

/*
 * Function setFill
 *
 * Function is called to restore the last ID to its proper fill and set the fill of the new object to the red shown when clicked
 */
function setFill(currentID) {
    if (lastID && occupyFill(lastID)) {
        $("#" + lastID).css("fill", "red");
    }
    else {
        $("#" + lastID).css("fill", "inherit");
    }
    lastID = currentID;
    $("#" + currentID).css("fill", "yellow");
}

/*
 * Function ajaxCall
 *
 * Called when making a call to the controller sends an alert if controller responds with Json
 */
function ajaxCall(ID) {
    //checks if default page or regular floor page so that it can route to the right controller method
    let urlPath;
    let path = window.location.pathname;
    if (path == "/") {
        urlPath = 'Home/GetController';
    }
    else {
        urlPath = 'GetController'
    }

    $.ajax({
        type: "GET",
        url: urlPath,
        data: {
            id: ID
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            onSuccess(result, ID);
        },
        error: function (response) {
            alert('error');
        }
    });
}

/*
 * function onSuccess
 *
 * called on ajaxCall success to assign a desk or send to isAuth to determine if user has permission to remove occupant
 */
function onSuccess(result, ID) {
    if (result == "True") {
        var add = confirm("Not occupied. Assign someone to this desk?");
        if (add) {
            let code1 = prompt("Enter Code 1")

            if (code1) {
                deskFill(ID, code1);
            }
        }
    }
    else {
        isAuth(result, ID)
    }
}

/*
 * function removeOccupant
 *
 * removes the desk from the assigned user and clears the desk DB for that desk
 */
function removeOccupant(ID) {
    let urlPath;
    let path = window.location.pathname;
    if (path == "/") {
        urlPath = 'Home/RemoveOccupant';
    }
    else {
        urlPath = 'RemoveOccupant'
    }

    $.ajax({
        type: "GET",
        url: urlPath,
        data: {
            id: ID
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var v = document.getElementById(id);
            v.classList.remove("occupied");
            alert(result);
        },
        error: function (response) {
            alert('error');
        }
    });
}

/*
 * Function setFloor
 *
 * called from view on selector submit, gets the value from the selector and redirects to the appropriate floor
 */
function setFloor() {
    var floorValue = document.getElementById("floors").value;
    if (floorValue && floorValue != currentFloor) {
        window.location.href = '/Home/Floor' + floorValue;
    }
}

/*
 * Function setZoom
 *
 * takes the level of zoom given in view and the element in the mapContainer and performs transform to enlarge
 */
function setZoom(zoom, el) {
    transformOrigin = [0, 0];
    el = el || instance.getContainer();
    var p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;
}

/*
 * Function showVal
 *
 * function called from view to use the value given for zoom to enlarge div
 */
function showVal(a) {
    var zoomScale = Number(a) / 10;
    setZoom(zoomScale, document.getElementsByClassName('mapContainer')[0])
}

/*
 * Function fillDB
 *
 * function called from view to repopulate Db with all the locations from the current floor to
 * be used after a floor plan change
 */
function fillDB() {
    //checks if default page or regular floor page so that it can route to the right controller method
    var bool = confirm("This will remove all users from their desks on this floor. Would you like to continue?")
    if (bool) {
        let urlPath;
        let path = window.location.pathname;
        if (path == "/") {
            urlPath = 'Home/refillDB';
        }
        else {
            urlPath = 'refillDB'
        }
        $.ajax({
            type: "GET",
            url: urlPath,
            data: {
                floor: currentFloor
            },
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                alert(result)
            },
            error: function (response) {
                alert("error");
            }
        });
    }
}

/*
 * Function deskFill
 *
 * function called when an registered user desires to fill a desk they clicked in view.
 * uses information provided by user to add a user to DB and assign them to the desk
 */
function deskFill(ID, userId) {
    let urlPath;
    let path = window.location.pathname;
    if (path == "/") {
        urlPath = 'Home/deskFill';
    }
    else {
        urlPath = 'deskFill'
    }

    $.ajax({
        type: "GET",
        url: urlPath,
        data: {
            id: ID,
            userId: userId
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result)
        },
        error: function (response) {
            alert("error");
        }
    });
}

/*
 * Function isOccupied
 *
 * function called on every location to check in the desk DB if the desk has an occupant. If so it
 * adds a css class to the element that changes its color to purple to indicate that the desk is occupied
 */
function isOccupied(id) {
    let urlPath;
    let path = window.location.pathname;
    if (path == "/") {
        urlPath = 'Home/isOccupied';
    }
    else {
        urlPath = 'isOccupied'
    }

    $.ajax({
        type: "GET",
        url: urlPath,
        data: {
            id: id
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result == "Occupied") {
                var v = document.getElementById(id);
                v.classList.add("occupied");
            }
        },
        error: function (response) {
            //alert("Cannot determine Occupancy");
        }
    });
}

/*
 * function occupyFill
 *
 * checks to see if a location contains the occupied css class. if it does return true else false.
 * this allows the setfill to determine if it should inherit or fill with purple if it is occupied.
 */
function occupyFill(id) {
    var v = document.getElementById(id);
    return v.classList.contains("occupied");
}

/*
 * function isAuth
 *
 * calls a function to check if user has permissions then is so allows occupant removal
 */
function isAuth(print, ID) {
    let urlPath;
    let path = window.location.pathname;
    if (path == "/") {
        urlPath = 'Home/isAuth';
    }
    else {
        urlPath = 'isAuth'
    }

    $.ajax({
        type: "GET",
        url: urlPath,
        data: {},
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result == "True") {
                alert(print);
                var remove = confirm("Would you like to remove this desk occupant? (Ok = yes)")
                if (remove) {
                    removeOccupant(ID);
                }
            }
            else {
                alert(print);
            }
        },
        error: function (response) {
            alert("Error");
        }
    });
}