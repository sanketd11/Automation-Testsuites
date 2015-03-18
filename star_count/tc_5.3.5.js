    /*
     Author: Arko
     Description:    This is a casperjs automated test script for showing that If a notebook is added in the list of 'All Notebooks' and its respective star is not
     selected and count=0, then selecting the star of that notebook should also add it to the 'Notebooks I Starred' list with count=1
     and also star the notebook under 'People I Starred' list with count=1
    */

    //Begin Tests

    casper.test.begin("If a notebook is added in the list of 'All Notebooks' and its respective star is not selected and count=0, then selecting the star of that notebook should also add it to the 'Notebooks I Starred' list", 7, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var functions = require(fs.absolute('basicfunctions'));
        var title;

        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js');
        });
        casper.wait(10000);

        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url);
        });

        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper); //Source: basicfunctions.js

        });

        //Create a new Notebook.
        functions.create_notebook(casper); //Source: basicfunctions.js

        // Getting the title of new Notebook
        casper.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(2000);

        });

        //checking if notebook is starred and hence unstarring it
        functions.checkstarred(casper); //Source: basicfunctions.js
        casper.then(function () {
            var z = casper.evaluate(function () {
                $('#star-notebook .icon-star').click();

            });
            this.wait(3000);
            this.echo('Notebook is unstarred now');
        });

        //checking if Notebook is present in the All Notebooks list
        functions.allnotebooks(casper); //Source: basicfunctions.js

        casper.viewport(1024, 768).then(function () {
            this.echo("Notebook found under All Notebooks and is unstarred. Hence checking if it is present under People I Starred and absent under Notebooks I Starred");
            functions.notebooksIstarred(casper); //Source: basicfunctions.js
            functions.peopleIstarred(casper); //Source: basicfunctions.js
        });

        //Now starring the notebook and checking if the Notebook is present in Notebooks I Starred list
        casper.then(function () {
            this.click({type: 'css', path: '#star-notebook > i:nth-child(1)'});
            this.wait(3000);
        });
        functions.checkstarred(casper); //Source: basicfunctions.js

        //Now checking that after starring whether the notebook is present in Notebooks I starred list
        functions.notebooksIstarred(casper); //Source: basicfunctions.js
        casper.then(function () {
            this.echo("Hence proved that after starring the notebook is now present in Notebooks I Starred list");
        });

        casper.run(function () {
            test.done();
        });
    });
