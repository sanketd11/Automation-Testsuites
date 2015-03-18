    /*

     Author: Kunal
     Description:Creating a new notebook using the + icon on the top left corner of the Notebook div

     */

    //Begin Test

    casper.test.begin(" Creating New Notebook", 4, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var functions = require(fs.absolute('basicfunctions'));
        var initialcounter = 0;//store initial count of notebooks
        var newcounter = 0;//store new count of notebooks


        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js');   //Injects JQuery
        });
        casper.wait(10000);

        //Login to GitHub and RCloud
        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url);  //source: basicfunctions.js
        });

        //Validating for RCloud page to be loaded
        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper);  //source: basicfunctions.js

        });

        //Get initial count of notebooks
        casper.then(function () {
            do
            {
                initialcounter = initialcounter + 1;
                this.wait(2000);
            } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + initialcounter + ') > div:nth-child(1) > span:nth-child(1)'}));
            initialcounter = initialcounter - 1;
            this.echo("Initial count of notebooks = " + initialcounter);
        });

        //Create a new Notebook.
        functions.create_notebook(casper);   //source: basicfunctions.js

        //Get new count of notebooks
        casper.then(function () {
            do
            {
                newcounter = newcounter + 1;
                this.wait(2000);
            } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + newcounter + ') > div:nth-child(1) > span:nth-child(1)'}));
            newcounter = newcounter - 1;
            this.echo("New count of notebooks = " + newcounter);
            this.test.assertNotEquals(newcounter, initialcounter, "Confirmed that new notebook has been created");
        });

        casper.run(function () {
            test.done();
        });
    });
