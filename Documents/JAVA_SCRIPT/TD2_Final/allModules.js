var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio'); //working with the elements and classe etc on a given url
var fs = require('fs');
var modules = require('./allModules');
var sum = 0;
var url = require('url');
//var modules = require('./allModules'); //i have to delete it
var app = express();
//all variables
var price, city, PostalCode, Brand, Model, ReleaseDate, km,fuel, gearbox,newCar;
var allResults=new Array();
var newPrices=new Array;
var sum;
var newUrl="http://www.lacentrale.fr/cote-voitures-";


function first(req, res, givenUrl,callback){
    console.log("fisrt");
    console.log("start scraping");
    var url4= givenUrl;
    request(url4, function(error, response,body){
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
                                                     if(gearbox=="Manuelle")
                                                     {gearbox="Mécanique";}
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
            fs.writeFile(path,JSON.stringify(newCar));
            console.log("end scraping");
            callback(null);
            });
    
}
exports.first = first;
function second(req, res, callback){
    fs.readFile(__dirname + "/car.json", 'utf8', function (err, data) {
                if (err)
                console.log(err);
                obj = JSON.parse(data);
                newUrl = newUrl +obj.cars.Brand+ "-" + obj.cars.Model+ "--"+ obj.cars.ReleaseDate+"-.html";
                console.log(newUrl);
                request(newUrl, function(error, response,body){
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
                        //console.log(allResults.length);
                        callback(null);
                        });
                });
    
}
exports.second = second;
function third(req, res,callback){
    console.log(allResults.length+" result found with these prices : ");
    async.forEachOf(allResults, function(value, key, callback) {
                    request(allResults[key],function(error, response,body){
                            $ = cheerio.load(body);
                            var newPrice = $(".Result_Cote.arial.tx20").text().replace(/ /g,'');
                            newPrice = newPrice.replace(/€/,'');
                            newPrices[key]=newPrice;
                            sum =sum+parseInt(newPrices[key]);
                            console.log("newPrice : ",newPrice," and " ,sum);
                            callback(null);
                            });
                    
                    }, function(err){
                    
                    if( err ) {
                    
                    
                    
                    } else {
                    
                    console.log(sum/newPrices.length);
                    sum=0;//if we put another input
                    
                    }
                    });
   
}
exports.third = third;
