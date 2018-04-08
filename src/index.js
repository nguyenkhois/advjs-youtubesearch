import $ from "jquery";

$(document).ready(function () {
    //Get HTML elements
    let btnAuth = $("#btnAuth");
    let txtSearchContent = $("#txtSearchContent");
    let btnSearch = $("#btnSearch");
    let dspSearchResults = $("#dspSearchResults");

    //Functions
    function getParamFromUrl(param){
        try{
            let sQueryString = document.URL.split("#")[1] || document.URL.split("?")[1];
            let searchParams = new URLSearchParams(sQueryString);

            if (searchParams.has(param))
                return searchParams.get(param);
            else
                return false;
        }catch(e){
            return false;
        }
    }
    function showErrorMessages(objError) {
        console.log(objError);
        dspSearchResults.html("Data not found!")
    }
    function showResults(objResults) {
        dspSearchResults.html("");
        for(let i in objResults.items)
            dspSearchResults.append(renderResult(objResults.items[i]));
    }
    function renderResult(objResult) {
        let thumbnail;
        if (objResult.snippet.thumbnails.medium.url)
            thumbnail = objResult.snippet.thumbnails.medium.url;
        return `<article>
                    <h3>${objResult.snippet.title}</h3>
                    <p><img src="${thumbnail}" alt="" class="image"></p>
                    <p>Description: ${objResult.snippet.description}</p>
                    <p><a href="https://www.youtube.com/watch?v=${objResult.id.videoId}">View on Youtube</a></p>
                </article>`;
    }

    //MAIN
    //-----Authorization the user-----
    //let client_id = "YOUR_CLIENT_ID";
    //let redirect_uri = encodeURIComponent("YOUR_URI");
    let client_id = "50523264751-9vi8klbs55hcfu8h3d3g9h2uv8kli0b2.apps.googleusercontent.com";
    let redirect_uri = encodeURIComponent("http://localhost:3000");
    let response_type = "token";

    let urlAuth = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&response_type=${response_type}&client_id=${client_id}`;

    let accessToken = getParamFromUrl('access_token') || "";
    if (accessToken === ""){
        btnAuth.prop('disabled', false);
        btnSearch.prop('disabled', true);
    }else{
        btnAuth.prop('disabled', true);
        btnSearch.prop('disabled', false);
    }


    btnAuth.click(function (event) {
        event.preventDefault();
        $(location).attr('href', urlAuth);
    });
    //-----End of authorization the user-----

    //-----Begin search from API-----
    btnSearch.click(function () {
        let searchContent = encodeURIComponent(txtSearchContent.val());
        let maxResults = 10;
        let part = "snippet";

        let urlSearch = `https://www.googleapis.com/youtube/v3/search?q=${searchContent}&part=${part}&maxResults=${maxResults}`;

        console.log(urlSearch);
        $.ajax({url: urlSearch,
            accepts: 'application/json',
            contentType: 'application/json',
            headers: {'Authorization': 'Bearer ' + accessToken},
            method: 'GET',
            success: function(result){
                console.log(result);
                showResults(result);
            },
            error: function (error) {
                showErrorMessages(error);
            }
        });
    });
    //-----End of search from API-----
});