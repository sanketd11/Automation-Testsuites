/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that on clicking the GitHub Logout button present in 
 "goodbye.R" page, the user gets a notification if he/she wants to log out of GitHub,confirming which,the user
 gets logged out from GitHub and Sign-In page of github.com opens


 */

//Begin Tests

casper.test.begin("Logout of Github", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url); //Source: basicfunctions.js
    });


    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper); //Source: basicfunctions.js
        this.wait(4000);
    });

    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of RCloud');
        this.click({ type : 'xpath' , path : '/html/body/div[2]/div/div[2]/ul[2]/li[3]/a'});
        this.wait(7000);
    });

    casper.viewport(1366, 768).then(function () {
        this.echo("The url after logging out of RCloud : " + this.getCurrentUrl());
        this.test.assertTextExists(
            'Log back in', "Log Back In option exists"
        );
    });

    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of Github');
        this.test.assertTruthy(this.click({type: 'css', path: '#main-div > p:nth-child(2) > a:nth-child(2)' }), "Logged out of Github");
        this.wait(10000);
    });

    casper.viewport(1366, 768).then(function () {
        this.echo("The url where the user can confirm logging out from Github : " + this.getCurrentUrl());
        this.test.assertTextExists(
            'Are you sure you want to sign out?', "Option to Sign Out of GitHub exists"
        );
    });

    casper.viewport(1366, 768).then(function () {
        this.click("form input[type=submit][value='Sign out']");
        console.log('logged out of Github');
        this.wait(7000);
        this.echo("The url after logging out of Github : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that successfully logged out of Github");

    });

    casper.run(function () {
        test.done();
    });
});
