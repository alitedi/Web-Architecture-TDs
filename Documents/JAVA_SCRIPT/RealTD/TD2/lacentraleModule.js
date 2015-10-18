var lacentraleModule = function() {
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

}
//export the module
exports.lacentraleModule = lacentraleModule;
