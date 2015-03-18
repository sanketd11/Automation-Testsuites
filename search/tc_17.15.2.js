    /*
     Author: Prateek
     Description:    This is a casperjs automated test script for showning that For the "Search" option, the text entered in the text box for
     'full-text search' will consist of Function names within double quotes for Search like "rnorm(23)", "print(hi)" etc. only
     */

    //Begin Tests

    casper.test.begin(" Function names within double quotes for Search ", 6, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var functions = require(fs.absolute('basicfunctions'));
        var item = '"xtabs"';//item to be searched
        var title;//get notebook title
        var combo;//store notebook author + title

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
            title = functions.notebookname(casper); //Source: basicfunctions.js
            this.echo("Notebook title : " + title);
            this.wait(2000);
            combo = github_username + ' / ' + title;
        });

        //Add a new cell and execute the contents
        functions.addnewcell(casper); //Source: basicfunctions.js

        // Add contents to cell
        functions.addcontentstocell(casper, item); //Source: basicfunctions.js

         //entering item to be searched
            casper.then(function () {
                this.sendKeys('#input-text-search', item);
                this.wait(6000);
                this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
                });

            casper.wait(5000);

            //counting number of Search results
            casper.then(function () {
                var counter = 0;
                do
                {
                counter = counter + 1;
                this.wait(2000);
                }
                while (this.visible(x('/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr[1]/td/a')));

                counter = counter - 1;
                this.echo("number of search results:" + counter);

                if (counter >0)
                {
                    this.test.pass("search feature is working fine for fulltext entered in double quotes ");
                }
                else {
                        this.test.fail("search feature is not working fine for full text entered in double quotes ");
                     }
            });

        casper.run(function () {
            test.done();
        });
    });
