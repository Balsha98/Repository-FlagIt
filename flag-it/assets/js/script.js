"use strict";

// VARIABLES
const workoutList = querySelector("#workout_list");
const workoutForm = querySelector("form");
const gridForms = querySelectorAll(".grid_layout");
const selectBox = querySelector("select");
const inputs = querySelectorAll("input");
const distIn = querySelector("#distance");
const cadIn = querySelector("#cadence");
const elevIn = querySelector("#elevation");
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// FUNCTIONS
function querySelector(idClass) {
    return document.querySelector(idClass);
}

function querySelectorAll(idClass) {
    return document.querySelectorAll(idClass);
}

function resetFields() {
    inputs.forEach((input) => {
        input.value = "";
    });
}

// OOP
// Using OOP to properly
// structure our code.
// In this case we have 3 Classes,
// that will be doing all the work.
// APP CLASS
class App {
    #map;
    #mapCoords;
    #workouts = [];
    #ZOOM = 15;

    constructor() {
        this._getPosition();

        setTimeout(this._loadFromLocalStorage.bind(this), 250);

        selectBox.addEventListener("change", this._toggleInputs);

        // Instead of having an key event listener attached to the
        // entire document, we will attach a submit event on the form.
        // Whenever the form is submitted, we will display a marker.
        // For some reason, the submit event is not working for my form.
        document.addEventListener("keydown", this._newWorkout.bind(this));
        workoutList.addEventListener("click", this._getIntoView.bind(this));
    }

    _getPosition() {
        // GEOLOCATION API
        // Modern API; as parameters, it takes in 2 call-back
        // functions, one for a successful retrieval of coords,
        // and the other one in case an error occurs.
        if (navigator.geolocation) {
            // For the 1st callback, we are manually binding our method, as the
            // this keyword for a regular function always ends up being undefined.
            // In this case, we are binding it to the App object.
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this._noMap);
        }
    }

    // Geolocation's 1st
    // callback parameter func.
    _loadMap(currPosition) {
        const { latitude, longitude } = currPosition.coords;
        const coords = [latitude, longitude];

        this.#map = L.map("map").setView(coords, this.#ZOOM);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.#map);

        this.#map.on("click", this._showForm.bind(this));
    }

    _noMap() {
        alert("Cannot access your current location.");
    }

    _showForm(mapEvent) {
        const { lat, lng } = mapEvent.latlng;
        this.#mapCoords = [lat, lng];

        workoutForm.classList.remove("hide_form");
        gridForms.forEach((gridForm) => gridForm.classList.remove("hide_data"));
        distIn.focus();
    }

    _hideResetForm() {
        workoutForm.classList.add("hide_form");
        gridForms.forEach((gridForm) => gridForm.classList.add("hide_data"));
        inputs.forEach((input) => {
            input.value = "";
        });
    }

    _toggleInputs() {
        cadIn.closest(".grid_layout").classList.toggle("switch_inputs");
        elevIn.closest(".grid_layout").classList.toggle("switch_inputs");
        [cadIn, elevIn].forEach((input) => (input.value = ""));
    }

    // Getting the form inputs.
    _newWorkout(keyPressed) {
        if (keyPressed.key === "Enter") {
            // Get data from form.
            const boxValue = selectBox.value;
            const dataArr = [];

            // Check if data is valid.
            for (let input of inputs) {
                if (!input.closest(".grid_layout").classList.contains("switch_inputs")) {
                    if (input.value !== "") {
                        // Checking the input values.
                        // For this check, Jonas used a new Array
                        // method, every(), that checks each
                        // Array value, and returns true if 'every'
                        // check is true, but returns false if
                        // only one of them is false.
                        if (!isNaN(input.value)) {
                            if (input.getAttribute("id") !== "elevation") {
                                if (+input.value <= 0) {
                                    alert("Please insert only positive values.");
                                    return;
                                }
                            }
                        } else {
                            alert("Only number values are allowed.");
                            return;
                        }
                    } else {
                        alert("Each input field must be filled.");
                        return;
                    }

                    dataArr.push(+input.value);
                }
            }

            // Check the type of workout.
            let workObj;
            if (boxValue === "Running") workObj = new Running(this.#mapCoords, dataArr);
            else workObj = new Cycling(this.#mapCoords, dataArr);

            // Add workout to workouts array.
            this.#workouts.push(workObj);
            // this.#workouts.push(workObj._toJSON());

            // Add workouts arrays to localStorage.
            this._saveToLocalStorage();

            // Show marker on map.
            this._createMarker(workObj);

            // Show workout in list.
            this._generateAfterForm(workObj);

            // Hide & reset workout form.
            this._hideResetForm();
        }
    }

    // Generating a
    // marker on our map.
    _createMarker(wObj) {
        const workType = wObj.name;

        L.marker(wObj.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    className: `${workType.charAt(0).toLowerCase()}_popup`,
                    autoClose: false,
                    closeOnClick: false,
                })
            )
            .setPopupContent(`${wObj.emoji} ${wObj.description}`)
            .openPopup();
    }

    // Generating the workout
    // within our list.
    _createFlaggedDiv(wObj) {
        const workType = wObj.name;
        const checkType = workType === "Running";

        // Flagged workout div
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "flagged_workout");
        newDiv.setAttribute("data-id", `${wObj.id}`);
        newDiv.classList.add(`${workType.charAt(0).toLowerCase()}_border`);

        // The div's title.
        const divTitle = document.createElement("p");
        divTitle.textContent = `${wObj.description}`;
        newDiv.appendChild(divTitle);

        // Workout data div.
        const divContent = document.createElement("div");
        divContent.setAttribute("class", "content_div");

        // Checking the type of workout.
        const paceOrSpeed = checkType ? wObj.pace : wObj.speed;
        const stepOrElev = checkType ? wObj.cadence : wObj.elevation;

        // Workout value arrays.
        const emojiValues = [wObj.emoji, "⏱️", "⚡", checkType ? "🦶🏻" : "🗻"];
        const numValues = [wObj.distance, wObj.duration, paceOrSpeed, stepOrElev];
        const metricValues = ["KM", "MIN", checkType ? "MIN/KM" : "KM/H", checkType ? "SPM" : "M"];

        // Getting the appropriate values.
        emojiValues.forEach((emoji, i) => {
            // Paragraph, the parent of span.
            const dataP = document.createElement("p");
            dataP.textContent = `${emoji} ${numValues[i]}`;

            // Span for each value.
            const metricSpan = document.createElement("span");
            metricSpan.setAttribute("class", "metrics");
            metricSpan.textContent = ` ${metricValues[i]}`;

            dataP.appendChild(metricSpan);
            divContent.appendChild(dataP);
        });

        newDiv.appendChild(divContent);
        return newDiv;
    }

    _generateAfterForm(wObj) {
        workoutForm.after(this._createFlaggedDiv(wObj));
    }

    _getIntoView(event) {
        // No matter where we click inside the .flagged_workout div,
        // with closest() we always get the parent div.
        // In this case, we are using upwards DOM traversal.
        const clickedWorkout = event.target.closest(".flagged_workout");

        // Must check that
        // the div exists.
        if (clickedWorkout) {
            // In this case, we are using the data attribute
            // with the workout id; there is also another
            // way we could have done this. Have data attributes
            // for the lat & lng, fetch them, and passed them
            // into the setView() method as an array.
            // By using the id, were able to use our
            // workouts array, as well.
            const currWorkID = clickedWorkout.dataset.id;

            // Using the find() method to get the workout we need.
            const currWorkCoords = this.#workouts.find((workout) => {
                if (currWorkID === workout.id) return workout;
            });

            // We can also use panTo() method, which
            // only takes in the coords as a param.
            this.#map.setView(currWorkCoords.coords, this.#ZOOM, {
                animate: true,
                pan: {
                    duration: 0.5,
                },
            });
        }
    }

    _saveToLocalStorage() {
        // API that the browser
        // provides for us to use.
        // Best works if used to store
        // small amounts of data,
        // as large chunks of data will
        // badly impact the device's performance.
        // In this case, we are saving
        // our workouts as a String using
        // the stringify() method, by using
        // the toJSON() method we declared
        // for the 2 workout classes.
        localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }

    _loadFromLocalStorage() {
        const parsedArray = JSON.parse(localStorage.getItem("workouts"));

        // Cannot check for the
        // length, because at the
        // beginning, our localStorage
        // contains NOTHING!
        if (parsedArray) {
            // Great tips from Jonas!
            this.#workouts = parsedArray;
            this.#workouts.forEach((wObj) => {
                this._generateAfterForm(wObj);
                this._createMarker(wObj);
            });
        }
    }

    // Cool final tip from Jonas.
    // Created the clearStorage() method,
    // a public one, which could be accessed
    // from the console in order to clear our
    // localStorage and reload the page afterwards.
    clearStorage() {
        // localStorage.removeItem("workouts");
        localStorage.clear();
        location.reload();
    }
}

const app = new App();

// WORKOUT CLASS
class Workout {
    id = String(new Date().getTime()).slice(-5);
    date = new Date();

    constructor(coo, dist, dur) {
        this.distance = dist;
        this.duration = dur;
        this.coords = coo;
    }

    // Makes more sense to
    // have this here,
    // as Jonas explained.
    // This method is reserved
    // for the child classes.
    _getWorkoutInfo() {
        this.description = `${this._getName()} On: ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

// RUNNING WORKOUT CLASS
class Running extends Workout {
    constructor(coo, workData) {
        super(coo, workData[0], workData[1]);
        this.name = "Running";
        this.emoji = "🏃";
        this._getWorkoutInfo();
        this.cadence = workData[2];
        this._calcPace();
    }

    _getName() {
        return this.name;
    }

    _calcPace() {
        // Data shown in min/km.
        this.pace = (this.duration / this.distance).toFixed(1);
    }

    // I DECIDED TO SWITCH MY
    // ATTRIBUTES TO 'PUBLIC'!
    // // Created a method for
    // // saving objects as Strings.
    // // Was not able to do it as Jonas
    // // did, since my attributes are all
    // // private. Instead, I was advised to
    // // create a method that will return this
    // // type of String directly from each
    // // one of the classes. Great suggestion
    // // by Aleksander.
    // _toJSON() {
    //     return {
    //         id: this._getID(),
    //         name: this.#name,
    //         emoji: this.#emoji,
    //         coords: this._getCoords(),
    //         description: this._getWorkoutInfo(),
    //         distance: this._getDistance(),
    //         duration: this._getDuration(),
    //         cadence: this.#cadence,
    //         pace: this.#pace,
    //     };
    // }
}

// CYCLING WORKOUT CLASS
class Cycling extends Workout {
    constructor(coo, workData) {
        super(coo, workData[0], workData[1]);
        this.name = "Cycling";
        this.emoji = "🚴";
        this._getWorkoutInfo();
        this.elevation = workData[2];
        this._calcSpeed();
    }

    _getName() {
        return this.name;
    }

    _calcSpeed() {
        // Data shown in km/h.
        this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    }

    // I DECIDED TO SWITCH MY
    // ATTRIBUTES TO 'PUBLIC'!
    // // Created a method for
    // // saving objects as Strings.
    // // Was not able to do it as Jonas
    // // did, since my attributes are all
    // // private. Instead, I was advised to
    // // create a method that will return this
    // // type of 'String' directly from each
    // // one of the classes. Great suggestion
    // // by Aleksander!
    // _toJSON() {
    //     return {
    //         id: this._getID(),
    //         name: this.#name,
    //         emoji: this.#emoji,
    //         coords: this._getCoords(),
    //         description: this._getWorkoutInfo(),
    //         distance: this._getDistance(),
    //         duration: this._getDuration(),
    //         elevation: this.#elevation,
    //         speed: this.#speed,
    //     };
    // }
}
