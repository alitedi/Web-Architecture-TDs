var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio'); //working with the elements and classe etc on a given url
var fs = require('fs');
var modules = require('./allModules');
var url = require('url');
var app = express();





app.use(express.static(path.resolve(__dirname)));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname +'/index.html'));
});
app.use(bodyParser.urlencoded({ extended: true }));
//all functions
app.post('/parse', function(req, res) {
         //res.send('Watch your terminal for the Prices on lecentrale site, You sent the name "' + req.body.url3 + '".');
         //console.log(req.body.url3);
         /*scraping(req, res,req.body.url3,function() {
            findingResult(req, res,function(){
                  findPrices(req, res)
                             });
                          });*/
         modules.first(req, res,req.body.url3,function() {
               modules.second(req, res,function(){
                      modules.third(req, res,function(){
                            res.writeHead(200, {"Content-Type": "text/plain"});
                            //res.end(sum/newPrices.length);
                            res.end("good");})
                 });
          });
         
});

//starting to listen to port 8000
app.listen(8000, function() {
    console.log('Server running at http://127.0.0.1:8000/');
});



















/*


//functions:
function scraping(req, res, givenUrl, callback){
    console.log("start scraping");
    request({
            uri: givenUrl,
            }, function(error, response, body) {
            var $ = cheerio.load(body);
            price = $("span.price").attr('content');
            console.log("Price : ",price);
            city=$('[itemprop=addressLocality]').text();
            console.log("City : ",city);
            PostalCode=$('[itemprop=postalCode]').text();
            console.log("PostalCode : ",PostalCode);
            Brand = $('[itemprop=brand]').text();
            console.log("Brand : ",Brand);
            Model = $('[itemprop=model]').text().replace(/ /g,'');
            console.log("Model : ",Model);
            ReleaseDate = $('[itemprop=releaseDate]').text();
            ReleaseDate = ReleaseDate.replace(/\s+/g, '');
            console.log("ReleaseDate : ",ReleaseDate);
            var table=$('.lbcParams.criterias').each(function(){
               var data = $(this);
               km = (data.find("td").eq(3).text()).replace(/ /g,'');
               km = km.replace(/KM/,'');//we have to remove also 'KM' character of string
               console.log("km : ",km);
               fuel = (data.find("td").eq(4).text()).replace(/ /g,'');
               console.log("fuel : ",fuel);
               gearbox = (data.find("td").eq(5).text()).replace(/ /g,'');
               console.log("gearbox : ",gearbox);
            });
            newCar={
            "cars":
            {
            "Price" : price ,
            "City" : city ,
            "PostalCode" : PostalCode ,
            "Brand" : Brand ,
            "Model" : Model ,
            "ReleaseDate" : ReleaseDate,
            "KM" : km ,
            "Fuel" : fuel,
            "Gearbox" : gearbox
            }

            };
            //write data of new car on a JSON file
            var path = __dirname + "/car.json";
            fs.writeFile(path,JSON.stringify(newCar, null, 4), function(err) {
               if(err) {
               console.log(err);
               } else {
               console.log("JSON saved to " + path);
               }
               });
            });
    console.log("end scraping");
    callback(null);
}
function findingResult(req,res,callback){
  fs.readFile(__dirname + "/car.json", 'utf8', function (err, data) {
    if (err)
      console.log(err);
    obj = JSON.parse(data);
    newUrl = newUrl +obj.cars.Brand+ "-" + obj.cars.Model+ "--"+ obj.cars.ReleaseDate+"-.html";
    console.log(newUrl);
    request({
      uri: newUrl,
    }, function(error, response, body) {
      var $ = cheerio.load(body);
      var j=0;
      var fuelArray=new Array();
      var gearboxArray=new Array();
      var a=0;
      //verifying the conditions : FIRST FUEL
      $('.QuotNrj').each(function(){
        var data = $(this);
        var newFuel=data.find('a').text();
        if((newFuel.toLowerCase()).indexOf(obj.cars.Fuel.toLowerCase()) > -1){
          //console.log(newFuel.toLowerCase());
          fuelArray.push(a);
        }
        a++;
      });
      var b=0;
      $('.QuotBoite').each(function(){
        var data = $(this);
        var newGearbox=data.find('a').text();
        if((newGearbox.toLowerCase()).indexOf(obj.cars.Gearbox.toLowerCase()) > -1){
          gearboxArray.push(b);
          //console.log(newGearbox.toLowerCase());
        }
        b++;
      });
      var c=0;
      //if its match then :
      $('.QuotMarque').each(function(){
        //links.push($(this).find('a').attr('href'));
        var data = $(this);
        //console.log("http://www.lacentrale.fr/"+(data.find('a').attr('href')));
        if((fuelArray.indexOf(c)>-1) && (gearboxArray.indexOf(c)>-1))
        {
          allResults.push("http://www.lacentrale.fr/"+(data.find('a').attr('href')));
          //console.log("http://www.lacentrale.fr/"+(data.find('a').attr('href')));
        }
         c++;
          });
       });
    });
    callback(null);
}


function findPrices(req,res,callback){
    console.log(allResults.length+" result found with these prices : ");
    //var cheerio2 = require("cheerio");
    for (var i = 0; i < allResults.length; i++) {
        request({
                uri: allResults[i],
                }, function(error, response, body) {
                $ = cheerio.load(body);
                var newPrice = $(".Result_Cote.arial.tx20").text().replace(/ /g,'');
                newPrice = newPrice.replace(/€/,'');
                newPrices.push(newPrice);
                console.log("newPrice : ",newPrice);
                if(i== (newPrices.length-1))
                {
                for( var k = 0; k < newPrices.length; k++ ){
                sum += newPrices[k];
                }
                var avg = sum/newPrices.length;
                //console.log(avg);
                }
                });
    }
    callback(null);
}*/
