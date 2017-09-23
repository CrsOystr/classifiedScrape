//imports
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var fs = require("fs");
var dater = new Date();

if(process.env.SEARCH_URL) {
    var config = require('./config');
}else{
    var config = require('./localconfig');
}

/* variables
 *
 */
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.emailpassword
    }
  });
var URL = config.url;
var baseURL = "http://www.ksl.com";
var isFirstPass = 1;
var httpInterval = config.minutes * 60 * 1000;
var listingList = [];

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

            if(listingList.indexOf(topURL) == -1){
                listingList.push(topURL);
                console.log(topURL);
                if(isFirstPass == 0){
                    let mess = ('Yo check it out ' + baseURL + topURL + ' Cool Huh.                   \n\n');
                    sendText(mess);
                }
            }
        });

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

function sendText(body) {
    let mailOptions = {
        from: config.email,
        to: config.gateway,
        subject: '',
        text: body
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
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

sendText('starting service');
enter();
