# jade-tool
The tool compares two build test results for a openQA job group and looks for improvements and regressions. It retrieves all failed tests of two builds via OpenQA rest API and compare their flavor, arc, test, module, machine and test result.The comparison result will be shown in a tree table on the web page.

How to use

1. cd jade-tool;
2. jade-tool # node jade-express.js
3. Open http://ip:8088/jade.html with your web browser

