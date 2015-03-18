    /*
     Author: Arko
     Description:    This is a casperjs automated test script to modify a comment for the currently loaded notebook
     */

    //Begin Tests


    casper.test.begin("Modify comment for a notebook", 5, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var title;//get notebook title
        var functions = require(fs.absolute('basicfunctions'));
        var comment = "First comment";//the comment to be entered

        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js');  //Injects JQuery
        });
        casper.wait(10000);

        //Login to GitHub and RCloud
        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url);   //source: basicfunctions.js
        });

        //Validating RCloud page to be loaded
        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper);   //source: basicfunctions.js

        });

        //Create a new Notebook.
        functions.create_notebook(casper);  //source: basicfunctions.js

        //Get notebook title
        casper.then(function () {
            title = functions.notebookname(casper);
            this.echo("New Notebook title : " + title);
            this.wait(3000);
        });

        //enter the comment
        functions.comments(casper, comment);   //source: basicfunctions.js

        //edit the comment
        casper.then(function () {
            var z = casper.evaluate(function triggerKeyDownEvent() {
                jQuery(".comment-body-text").text("Modified comment");
                var e = jQuery.Event("keydown");
                e.which = 13;
                e.keyCode = 13;
                jQuery(".comment-body-text").trigger(e);
                return true;
            });
            this.wait(7000);
        });

        //verify if comment has been edited successfully
        casper.then(function () {
            var temp = this.fetchText({type: 'css', path: '.comment-body-text'});
            this.test.assertNotEquals(temp, comment, "Confirmed that comment has been edited successfully");
        });

        casper.run(function () {
            test.done();
        });
    });
