//export the module
exports.leboncoinModule = function(urlGiven) {
  //requerements
  var request = require("request");
  var cheerio = require("cheerio"); //working with the elements and classe etc on a given url
  var fs = require("fs"); //for file using
  var price, city, PostalCode, Brand, Model, ReleaseDate, km,fuel, gearbox,newCar;
  request({
    uri: urlGiven,
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
  var async = require("async");
  var allResults=new Array();
  var newPrices=new Array;
  var newUrl="http://www.lacentrale.fr/cote-voitures-";
  var obj;
  //var links=new Array();

  async.series([function(callback) {
    //console.log("1st line<br />");
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
        callback(null);
      });
    });
  },
    function(callback) {
      var sum = 0;
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
    }
  ],
  function(err, results) {
    console.log(newPrices.length);
  }
  );
};
