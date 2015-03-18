    /*
     Author: Arko
     Description:    This is a casperjs automated test script for showning that For the "Search" option, the text entered in the text box for
     'full-text search' will consist of Comments From a Notebook like Comment1 only
    */

    //Begin Tests

    casper.test.begin(" Comments From a Notebook as Search Text like Comment1", 7, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var comment = 'bottle';
        var item = '2+4';
        var title;
        var combo;
        var functions = require(fs.absolute('basicfunctions'));
        var flag;

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
            combo = github_username + ' / ' + title;
        });
        casper.then(function () {
            this.wait(3000);
            this.echo('Notebook title: ' + this.fetchText(x('/html/body/div[2]/div/div[2]/ul/li[6]/a/span')));

        });


        //Add a new cell
        functions.addnewcell(casper); //Source: basicfunctions.js

        // Add contents to cell
        functions.addcontentstocell(casper, item); //Source: basicfunctions.js


        casper.viewport(1366, 768).then(function () {
            if (this.visible('#comments-wrapper')) {
                this.echo('Comment div is open');
                this.wait(5000);

            }
            else {
                this.echo('Comment div is not open,hence opening it');
                this.wait(5000);
                this.click({type: 'xpath', path:('/html/body/div[3]/div/div[4]/div/div/div[2]/div[3]/div/a/div/i')});
                this.wait(5000);
            }

             functions.comments(casper,comment);

        });


        //checking if Search div is open
        casper.then(function(){
            if (this.visible('#input-text-search')) {
                    console.log('Search div is already opened');
                }
            else {
                    var z = casper.evaluate(function () {
                        $(' .icon-search').click();
                    });
                    this.echo("Opened Search div");
                }
            });

        //entering item to be searched

            casper.then(function () {
                this.sendKeys('#input-text-search', comment);
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
                    this.test.pass("searched item has been found ");
                }
                else {
                        this.test.fail("search item didnot find ");
                     }
            });

        casper.run(function () {
            test.done();
        });
    });
