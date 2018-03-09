const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

//form EventListener
searchForm.addEventListener("submit", (e)=>{
    // get the search term
    const searchTerm = searchInput.value;
    // get the sorting from thr radio buttons
    const sortBy = document.querySelector("input[name='sortby']:checked").value;
    // get the limit from the drop down
    const limit = document.querySelector("#limit").value;

    if(searchTerm === ""){
        showMessage("please search for something", "alert-danger");
    }
    searchTerm.value = "";
    //search Reddit
    search(searchTerm, limit, sortBy)


    e.preventDefault();
});


// alet user
function showMessage(message, className){
    // create div
    const div = document.createElement("div");
    // add class
    div.className = 'alert '+ className;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent container
    const parent = document.querySelector("#search-container");
    parent.insertBefore(div, document.querySelector("#search"));
    //timeout alert in 2 seconds
    setTimeout(()=>{
        document.querySelector(".alert").remove();
    }, 2000);
}

// fetch data from redditApi
function search(searchTerm, searchLimit, sortBy){
    fetch("http://www.reddit.com/search.json?q=" + searchTerm +"&sort=" + sortBy +"&limit=" + searchLimit)
    .then(res => res.json())
    .then(data => data.data.children.map((data)=>data.data))
    .then((results) => {
        console.log(results);
        let output = "<div class='card-columns'>";
        // loop through post
        results.forEach((post)=>{
            let img = post.preview ? post.preview.images[0].source.url : "http://postmediaottawacitizen2.files.wordpress.com/2014/06/politifact-photos-reddit.jpg"

            output+=`
            <div class='card'>
              <img class='card-img-top' src='${img}' alt='Card image cap'>
              <div class='card-block'>
                <h4 class='card-title ml-2'>${post.title}</h4>
                <p class='card-text ml-2'>${truncate(post.selftext, 100)}</p>
                <a href='${post.url}' target="_blank" class='btn btn-primary ml-2'>Read More</a>
                <hr>
                    <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                    <span class="badge badge-dark">Score: ${post.score}</span>
                </hr>
              </div>
            </div>

            `
        });
        output+="</div>";
        document.querySelector("#results").innerHTML = output;
    })
    .catch(error => console.log(error));
}

// Truncate Text
function truncate(text, numOfChar){
    const shortend = text.indexOf(" ", numOfChar);
    return shortend === -1? text : text.substring(0, shortend);
}
