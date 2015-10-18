var async = require('async');
//export the module
exports.leboncoinModule = function() {
  //requerements
  var request = require("request");
  var cheerio = require("cheerio"); //working with the elements and classe etc on a given url
  var fs = require("fs"); //for file using
  var price, city, PostalCode, Brand, Model, ReleaseDate, km,fuel, gearbox,newCar;
  request({
    uri: "http://www.leboncoin.fr/voitures/869170515.htm?ca=12_s",
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
};
exports.lacentraleModule = function() {
  //requerements
  var request = require("request");
  var cheerio = require("cheerio"); //working with the elements and classe etc on a given url
  var fs = require("fs"); //for file using
  var price, city, PostalCode, Brand, Model, ReleaseDate, km,fuel, gearbox,newCar;
  var newUrl="http://www.lacentrale.fr/cote-voitures-";
  var obj;
  fs.readFile(__dirname + "/car.json", 'utf8', function (err, data) {
    if (err)
      console.log(err);
    obj = JSON.parse(data);
    newUrl = newUrl +obj.cars.Brand+ "-" + obj.cars.Model+ "--"+ obj.cars.ReleaseDate+"-.html";
    console.log(newUrl);
  });

};
