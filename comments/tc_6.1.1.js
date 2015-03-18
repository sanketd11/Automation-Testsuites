    /*

     Author: Arko
     Description:This is casperjs test script to test when new notebook is created, no comments will present in the right-side of the page

     */

    //Begin Test

    casper.test.begin(" Count of comments =0 when no comments are written ", 4, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var title;
        var functions = require(fs.absolute('basicfunctions'));

        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js'); //injects JQuery
        });

        casper.wait(10000);

        //Login to GitHub and RCloud
        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url); //source: basicfunctions.js
        });

        //Validating whether RCloud page is loaded completely
        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper);   //source: basicfunctions.js

        });

        //Create a new Notebook.
        functions.create_notebook(casper);   //source: basicfunctions.js

        //Get notebook title
        casper.then(function () {
            title = functions.notebookname(casper);   //source: basicfunctions.js
            this.echo("New Notebook title : " + title);
            this.wait(3000);
        });

        //open comments div if not open
        casper.then(function () {
            if (this.visible('#comments-wrapper')) {
                this.echo('Comment div is open');
                this.wait(5000);
            }
            else {
                this.echo('Comment div is not open,hence opening it');
                this.wait(5000);
                var z = casper.evaluate(function () {
                    $('.icon-comments').click();
                });
                this.wait(5000);
            }
        });

        //Verify that no comments are present in comments div for newly created notebook
        casper.then(function () {
            this.test.assertNotVisible({type : 'xpath' , path : '/html/body/div[3]/div/div[3]/div[1]/div/div/div[5]/div[2]/div/div/div/div[1]/div[3]/div[2]/div/div'},'Verified for no comments to be present  ');
        });

        casper.run(function () {
            test.done();
        });
    });
