//Get HTML elements
let btnAuth = document.getElementById("btnAuth");
let txtSearchContent = document.getElementById("txtSearchContent");
let btnSearch = document.getElementById("btnSearch");
let dspSearchResults = document.getElementById("dspSearchResults");
let imageNotFound = "images/imagenotfound.png";

//Functions
function getParamFromUrl(param){
    try{
        let sQueryString = document.URL.split("#")[1] || document.URL.split("?")[1];
        let searchParams = new URLSearchParams(sQueryString);

        if (searchParams.has(param))
            return searchParams.get(param);
        else
            return "";
    }catch(e){
        return false;
    }
}
function showErrorMessages(objError) {
    console.log(objError);
    dspSearchResults.innerHTML = "Data not found!";
}
function showResults(objResults) {
    dspSearchResults.innerHTML = "";
    try{
        for(let i in objResults.items)
            dspSearchResults.appendChild(renderResult(objResults.items[i]));
    }catch(e){
        console.log(e);
    }
}
function renderResult(objResult) {
    let thumbnail;
    objResult.snippet.thumbnails.medium.url ? thumbnail = objResult.snippet.thumbnails.medium.url : thumbnail = imageNotFound;
    let node = document.createElement("article");
    node.innerHTML = `<h3>${objResult.snippet.title}</h3>
                      <p><img src="${thumbnail}" alt="" class="image"></p>
                      <p>Description: ${objResult.snippet.description}</p>
                      <p><a href="https://www.youtube.com/watch?v=${objResult.id.videoId}">View on Youtube</a></p>`;
    return node;
}

//MAIN
//-----Authorization the user-----
let client_id = "YOUR_CLIENT_ID";
let redirect_uri = encodeURIComponent("YOUR_REDIRECT_URI");
let response_type = "token";

let urlAuth = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&response_type=${response_type}&client_id=${client_id}`;

let accessToken = getParamFromUrl('access_token') || "";
if (accessToken === ""){
    btnAuth.disabled = false;
    btnSearch.disabled = true;
}else{
    btnAuth.disabled = true;
    btnSearch.disabled = false;
}

btnAuth.addEventListener("click",event=>{
    event.preventDefault();
    window.location.href = urlAuth;
});
//-----End of authorization the user-----

//-----Begin search from API-----
btnSearch.addEventListener("click",()=>{
    let searchContent = encodeURIComponent(txtSearchContent.value);
    let maxResults = 10;
    let part = "snippet";

    let urlSearch = `https://www.googleapis.com/youtube/v3/search?q=${searchContent}&part=${part}&maxResults=${maxResults}`;

    fetch(urlSearch,{
        method:'GET',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
            })
        })
        .then(data=>{
            data.json().then(result=>{
                showResults(result);
            })
        })
        .catch(error=>{
            showErrorMessages(error);
        });
});
//-----End of search from API-----
