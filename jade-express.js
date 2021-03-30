//curl  -s -H "Accept: application/json" "https://openqa.suse.de/api/v1/jobs?groupid=110&build=148.1&latest=1&version=15-SP3"|jq '.jobs|group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): ([group_by(.settings.MACHINE)|.[]|{(.[0].settings.MACHINE): (.|length)}]|add)}'
//
//curl  -s -H "Accept: application/json" "https://openqa.suse.de/api/v1/jobs?groupid=265&build=148.1&latest=1&version=15-SP3"|jq '.jobs|group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): (group_by(.settings.MACHINE)|sort_by(length)|.[-1]|{(.[0].settings.MACHINE): (length)})}'
//
//curl  -s -H "Accept: application/json" "https://openqa.suse.de/api/v1/jobs?groupid=265&build=148.1&latest=1&version=15-SP3"|jq '.jobs|[group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): (group_by(.settings.MACHINE)|sort_by(length)|.[-1]|.[0].settings.MACHINE)}]|add'
//
//The commands above are used for debuging and testing.
//
var qString = { latest: 1, scope: "current", result: "failed" };
var openqa_url = "https://openqa.suse.de/api/v1/jobs";
var openqa_opensuse_url = "https://openqa.opensuse.org/api/v1/jobs";
var express = require("express");
var app = express();
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/json", function (req, res) {
    console.log("Got a " + JSON.stringify(req.query));
    if (req.query.distri == "opensuse") {
        openqa_url = openqa_opensuse_url;
    }
    const request = require("request-promise");
    //const urls = ["https://openqa.suse.de/api/v1/jobs?groupid=308&build=20210101-1&latest=1&scope=current&result=failed", "https://openqa.suse.de/api/v1/jobs?groupid=308&build=20210101-1&latest=1&scope=current&result=failed"];
    const { lastBuild, firstBuild, ...qstr } = { ...req.query, ...qString };
    console.log(qstr);

    let build_ids = [req.query.firstBuild.trim(), req.query.lastBuild.trim()].map((id) => {
        let option = { url: openqa_url, qs: { build: id, ...qstr }, rejectUnauthorized: false };
        return option;
    });
    const promises = build_ids.map((url) => request(url));
    Promise.all(promises)
        .then((data) => {
            let a01 = JSON.parse(data[0]);
            let a02 = JSON.parse(data[1]);
            if (a01.jobs.length === 0) {
                res.status(404).send(req.query.firstBuild + ": has no failed test or no data. Please give another build ID or check if other inputs are correct.");
            } else if (a02.jobs.length === 0) {
                res.status(404).send(req.query.lastBuild + ": has no failed test or no data. Please give another build ID or check if other inputs are correct.");
            } else {
                //	console.log(a03.jobs[1].test);
                res.send(JSON.stringify([a01, a02]));
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

var server = app.listen(8088, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});

