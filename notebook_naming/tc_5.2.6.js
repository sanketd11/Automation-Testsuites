    /*
     Author: Arko
     Description:    This is a casperjs automated test script to enter both numbers and special characters(e.g- ^,&,#,@) while changing the
     title a given notebook
     */

    //Begin Tests

    casper.test.begin(" Notebook rename:Numbers and special characters", 4, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var functions = require(fs.absolute('basicfunctions'));
        var title;   //variable to store initial title of a notebook
        var newtitle; //variable to store modified title of a notebook

        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js');  //Injects JQuery
        });

        casper.wait(10000);

        //Login to GitHub and RCloud
        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url); //source: basicfunctions.js
        });

        //Validating for RCloud page to be loaded
        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper);  //source: basicfunctions.js
            this.wait(4000);
        });

        //Create a new Notebook.
        functions.create_notebook(casper);

        //getting the notebook title and modifying it
        casper.viewport(1024, 768).then(function () {
            title = functions.notebookname(casper);   //source: basicfunctions.js
            this.echo("Present title of notebook: " + title);
            var z = casper.evaluate(function triggerKeyDownEvent() {
                jQuery("#notebook-title").text("43%$#87");
                var e = jQuery.Event("keydown");
                e.which = 13;
                e.keyCode = 13;
                jQuery("#notebook-title").trigger(e);
                return true;
            });
        });

        //Confirming for the Notebook title to be modified
        casper.viewport(1366, 768).then(function () {
            newtitle = functions.notebookname(casper);   //source: basicfunctions.js
            this.echo("Modified notebook title: " + newtitle);
            this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
        });

        casper.run(function () {
            test.done();
        });
    });
