//imports
var request = require('request');
var cheerio = require('cheerio');
var Nexmo = require('nexmo');
var fs = require("fs");
var dater = new Date();

if(process.env.API_KEY) {
    var config = require('./config');
}else{
    var config = require('./localconfig');
}

/* variables
 *
 */
var URL = config.url;
var baseURL = "http://www.ksl.com";
var isFirstPass = 1;
var httpInterval = config.minutes * 60 * 1000;
var listingList = [];

var nex = new Nexmo({
    apiKey: config.apiKey,
    apiSecret: config.apiSecret
});

//ENTER HERE IF YOU DARE


function enter() {
    console.log("Entering Main Function");

    request(URL, function (error, response, body) {
      if (!error) {
        let $ = cheerio.load(body);
        $('div.listing-group > div.listing').each(function( index ){
            var title = $(this).find('h2.title').text().trim();
            var price = $(this).find('h3.price').text().trim();
            var topURL = $(this).find('a').attr('href');
            //console.log("\nTitle: " + title);
            //console.log("Price: " + price);
            //console.log("URL: " + baseURL + topURL)
            if(listingList.indexOf(topURL) == -1){
                listingList.push(topURL);
                if(isFirstPass == 0){
                    console.log("SendSMS");
                    nex.message.sendSms(config.fromNumber, config.toNumber, 'Yo check it out ' + baseURL + topURL + ' Cool Huh.                   \n\n');
                }
            }
        });
        //writeToDisk();
        if(isFirstPass == 0){
            console.log("SendSMS");
            nex.message.sendSms(config.fromNumber, config.toNumber, 'Yo check it out Cool Huh.                   \n-\n');
        }
        if(isFirstPass == 1){
            isFirstPass = 0;
            console.log("First Pass");
        }
      } else {
        console.log("We’ve encountered an error: " + error);
      }
    });


    setTimeout(enter, httpInterval);
}


function writeToDisk() {
    let listingData;
    listingList.forEach(function(element){
        console.log(element);
        listingData = listingData + element + '\n';
    });
    fs.writeFile('AsOf-' + dater.getTime() + '.txt', listingData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('The file was saved!');
    });
}




enter();
