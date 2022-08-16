// makes a text node like this: 
//  <type>string<\type>
function text_element(type, string) {
    let element = document.createElement(type);
    element.appendChild(document.createTextNode(string));
    return element;
}
// makes a link
//  <a href="link">text<\a>
function link_element(link, text) {
    let element = document.createElement("a")
    element.setAttribute("href",link)
    element.textContent = text;
    return element
}
// makes an image
//  <img src="link"><\img>
function img_element(link) {
    let element = document.createElement("img")
    element.setAttribute("src", link)
    return element
}

// Generalized Fetch Function
function general_fetch(url) {
    return fetch(url).then(res => { return res.json() })
}
// Call with id of movie to patch and an object like {key: new_value}
function patch(id, patchObject) {
    return fetch(`http://localhost:3000/movies/${id}`, {
        method: "PATCH", headers: {  "Content-Type": "application/json" },
        body: JSON.stringify(patchObject)
    }).then(res => res.json())
}

// Wait for dom to be ready
addEventListener('DOMContentLoaded', (event) => {
    // Constant nodes from our HTML file
    const movieList = document.querySelector("nav#movie-list")
    let movieDetail = document.querySelector("div#movie-info")

    // ---------- #2 && #3 ----------
    // populate image, title, release_year, description, watched, and blood_amount
    // If the value of 'watched' is false, the button should say 'Unwatched'. 
    // If the value is true, then the button should say 'Watched'.
    function setFocusedMovie(movie) {
        // remove old event listeners
        movieDetail.parentElement.replaceChild(movieDetail.cloneNode(true), movieDetail)
        movieDetail = document.querySelector("div#movie-info")

        // set cover source
        movieDetail.querySelector("#detail-image").setAttribute("src", movie["image"])
        // set title
        movieDetail.querySelector("#title").textContent = movie["title"]
        // set year released
        movieDetail.querySelector("#year-released").textContent = movie["release_year"]
        // set description
        movieDetail.querySelector("#description").textContent = movie["description"]
        
        // set watched status
        let watchedButton = movieDetail.querySelector("#watched")
        watchedButton.textContent = movie["watched"]? "Watched" : "Unwatched"

        // ---------- #4 ----------
        // make watch button toggle on/off 
        watchedButton.addEventListener("click", () => {
            movie["watched"] = !movie["watched"]
            watchedButton.textContent = movie["watched"]? "Watched" : "Unwatched"
            console.log(`set ${movie["title"]} to ${movie["watched"]? "Watched" : "Unwatched"}`)

            // ---------- #6 ----------
            // make changes persist after refreshing
            patch(movie["id"], {watched : movie["watched"]})
        })

        // ---------- #5 ----------
        // BLOOD FOR THE BLOOD GOD
        let bloodCountNode = movieDetail.querySelector("#amount")
        // set blood count
        bloodCountNode.textContent = movie["blood_amount"]
        // make blood form add blood
        movieDetail.querySelector("#blood-form").addEventListener("submit", (event) => {
            event.preventDefault();
            // check if the blood input is actually a number
            let bloodInput = event.target.querySelector("input#blood-amount")
            if (!isNaN(parseInt(bloodInput.value))) {
                // add blood
                movie["blood_amount"] = parseInt(movie["blood_amount"]) + parseInt(bloodInput.value)
                bloodCountNode.textContent = parseInt(movie["blood_amount"])

                // ---------- #6 ----------
                // make changes persist after refreshing
                patch(movie["id"], {blood_amount : movie["blood_amount"]})
            }
            // clear form
            bloodInput.value = ""
        })
    }

    // ---------- #1 ----------
    // For each movie returned from http://localhost:3000/movies 
    // create an image and add it to the movie-list nav element.
    general_fetch("http://localhost:3000/movies").then((data) => {
        // ---------- #2 ----------
        // As soon as the page loads, we should see the details of the first movie in the dataset.
        setFocusedMovie(data[0])

        for (const movieKey in data) {
            if (Object.hasOwnProperty.call(data, movieKey)) {
                const movie = data[movieKey];
                
                let movieCover = img_element(movie["image"])

                // ---------- #2 ----------
                // Show details of clicked movies
                movieCover.addEventListener("click", (event) => {
                    setFocusedMovie(movie)
                })

                movieList.appendChild(movieCover)
            }
        }
    })

});
