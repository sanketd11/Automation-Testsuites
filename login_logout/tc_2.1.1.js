    /*
     Author: Arko
     Description:    This is a casperjs automated test script for showing that on clicking the "logout" link present on the top-right corner of  the main page,
     "goodbye.R" page is loaded with a message "You are now logged out of Rcloud" and a link for "Log back in" is
     present


     */

    //Begin Tests

    casper.test.begin("Logout of RCloud", 5, function suite(test) {

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
            this.wait(7000);
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
            this.echo("The url after logging out of RCloud: " + this.getCurrentUrl());
            this.test.assertTextExists('Log back in', "Log Back In option exists");
            this.test.assertTextExists('You are now logged out of RCloud', "Confirmed that message saying user has logged out of RCloud is displayed");
        });

        casper.run(function () {
            test.done();
        });
    });
