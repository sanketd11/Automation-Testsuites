    /*
     Author: Prateek
     Description:    This is a casperjs automated test script for showing that For the "Search" option,
     Username to which notebook belongs should be displayed

     */

    //Begin Tests

    casper.test.begin(" Notebook Description is displayed for each result notebook ", 6, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var functions = require(fs.absolute('basicfunctions'));
        var item = '"asia"';//item to be searched
        var title;//get notebook title
        var combo;//store notebook author + title

        casper.start(rcloud_url, function () {
            casper.page.injectJs('jquery-1.10.2.js');
        });
        casper.wait(10000);

        casper.viewport(1024, 768).then(function () {
            functions.login(casper, github_username, github_password, rcloud_url); //Source:basicfunctions.js
        });

        casper.viewport(1024, 768).then(function () {
            this.wait(9000);
            console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
            functions.validation(casper); //Source:basicfunctions.js

        });

        //Create a new Notebook.
        functions.create_notebook(casper); //Source:basicfunctions.js

        // Getting the title of new Notebook
        casper.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(2000);
            combo = github_username + ' / ' + title;
        });


        //Added a new cell and execute the contents
        functions.addnewcell(casper); //Source:basicfunctions.js


        //Add contents to this cell and then execute it using run option
        functions.addcontentstocell(casper, item); //Source:basicfunctions.js

        //Search div is open or not
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

            //verify that the searched item is found in the local user's div
            casper.viewport(1366, 768).then(function () {
                //this.echo("Combo= "+combo);
                var flag = 0;//to check if searched item has been found
                for (var i = 1; i <= counter; i++) {
                    this.wait(5000);
                    var result = this.fetchText(x('/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ' ]/tbody/tr[1]/td/a'));
                    this.echo(result);
                    if (result == combo) {
                        var temp = result.split("/");
                        var username = temp[0].substring(0, temp[0].length - 1);
                        this.test.assertEquals(username, github_username, 'Searched item has been found');
                        break;
                    }//outer if closes
                }//for closes
            });//function closes
        });

        casper.run(function () {
            test.done();
        });
    });
