# jade-tool
The tool is written in javascript and executed with nodejs. It compares two build test results for a openQA job group and looks for improvements and regressions. It retrieves all failed tests of two builds via OpenQA rest API and compare their flavor, arc, test, module, machine and test result.The comparison result will be shown in a tree table on the web page.

Required modules:
request-promise, express, debug

# i.e. npm install express

How to use

1. cd jade-tool;
2. jade-tool # node jade-express.js
3. Open http://ip:8088/jade.html with your web browser


The diff table:

The dark red color round icon: known failure, which means that test module failed in both builds
The red: new failure which means test module passed in previous build but failed in current build (later build). regressions could be triggered.
The green: improvement which means test module passed in current build but failed in previous build.
The whole table is actually a union for all failed test of the two builds. dark + red are the all of failed test for current build. dark + green are the all for previous build.

The "Show difference only" checkbox will filter away dark red, which only show improvements and regressions.

Noted: a test module which failed in previous build but was not executed or cancelled (no test result) in current build is also marked green.


tyuan@suse.com
