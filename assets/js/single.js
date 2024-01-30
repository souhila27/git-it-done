var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");


var getRepoName = function () {
     // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    
    if(repoName){
         // display repo name on the page
        repoNameEl.textContent= repoName;
        getRepoIssues(repoName);
    }else{
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};


var displayWarning = function (repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "see more issues on GitHub.com ";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    // append to warning container
    limitWarningEl.appendChild(linkEl);
}

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
                if (response.headers.get("link")) {
                    displayWarning(repo);
                }

            })
        } else {
             // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    })
};



var displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "this repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //apppend to container
        issueEl.appendChild(titleEl);

        //create a type element 
        var typeEl = document.createElement("span");
        // check if issue is an actual issue or pull request

        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container 
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}
getRepoName();
