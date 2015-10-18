"use strict";
/*var jqxhr = $.getJSON( "data.json", function() {
  console.log( "success" );
});*/
//var obj = JSON.parse(text);
//var actual_JSON = JSON.parse(data.json);
//var actual_JSON= $.getJSON("data.json",myFunction);

//  xml http
/*var req = new XMLHttpRequest();
req.open("GET", "data.json", true);
req.onreadystatechange = myCode;   // the handler
req.send(null);
function myCode()
{
   if (req.readyState == 4)
   {
        var doc = eval('(' + req.responseText + ')');
   }
}
var myList;
$.getJSON('data.json')
.done(function (data) {
myList = data;
});*/
//alert(myList.length);

//var actual_JSON = JSON.parse(data.json);
//alert(actual_JSON.length);

var rental={
  "cars": [
    {"id": "p306", "vehicule": "peugeot 306","pricePerDay": 20,"pricePerKm": 0.10},
    {"id": "rr-sport","pricePerDay": 60,"pricePerKm": 0.30},
    {"id": "p-boxster","pricePerDay": 100,"pricePerKm": 0.45}
    ],
  "rentals": [
    {"id": "1-pb-92","driver": {"firstName": "Paul","lastName": "Bismuth"},
                    "carId": "p306","pickupDate": "2015-09-12","returnDate": "2015-09-14","distance": 150,"deductibleReduction": true}, //deductible reduction is added in this par of rentals
    {"id": "2-rs-92","driver": {"firstName": "Rebecca","lastName": "Solanas"},
                    "carId": "rr-sport","pickupDate": "2015-09-09","returnDate": "2015-09-13","distance": 550,"deductibleReduction": false},
    {"id": "3-sa-92","driver": {"firstName": " Sami","lastName": "Ameziane"},
      "carId": "p-boxster","pickupDate": "2015-09-12","returnDate": "2015-09-14","distance": 100,"deductibleReduction": true}
  ]
};
var rentalModif={"rentalModifications": [
  {"id": 1,"rentalId": "1-pb-92" ,"returnDate": "2015-09-13","distance": 150},
  {"id": 2,"rentalId": "3-sa-92","pickupDate": "2015-09-01"}
  ]
};
var ii=0;
var tableR=document.getElementById("myTable1");
initialization();
//initialization2();
function initialization(){
  var distancePrice=0, timePrice=0;
  var table = document.getElementById("myTable1");
  for (var i = 0; i < rental.rentals.length; i++) {
    for (var j = 0; j < rental.cars.length; j++) {
      if(rental.rentals[i].carId===rental.cars[j].id){  //find the correct information of car for each rental object
        distancePrice=rental.rentals[i].distance*rental.cars[j].pricePerKm;
        //find number of date
        var differenceDate= diffdate(rental.rentals[i].pickupDate,rental.rentals[i].returnDate);
        var total=(differenceDate*rental.cars[j].pricePerDay)+distancePrice;
        //total is the totality of rental without reduction
        var total2=reduction(differenceDate,total);
        //document.write("<p>"+rental.rentals[i].driver.firstName+" with "+rental.cars[j].id +". Rental prices is : "+total2+"</p>");
        var info=[rental.cars[j].id,rental.rentals[i].driver.firstName,differenceDate,rental.rentals[i].distance,rental.rentals[i].deductibleReduction,total, total2];
        var commision= calculCommision(differenceDate,total2,rental.rentals[i].deductibleReduction);
        var allElemenetOfTable=info.concat(commision);
        //document.write("<p>"+commision+"</p>");
        var row = table.insertRow(table.rows.length);
        for (var k = 0; k < 11; k++)
        {
          var cell = row.insertCell(k);
          cell.innerHTML =allElemenetOfTable[k];
        }
      }
    }
  }
}

/*function initialization2(){
  for (var i = 0; i < rentalModif.rentalModifications.length; i++) {
    for (var j = 0; j < rental.rentals.length; j++) {
      if(rentalModif.rentalModifications[i].rentalId==rental.rentals[j].id){
        var newRental={"id": rental.rentals[j].id,"driver": {"firstName": rental.rentals[j].firstName,"lastName": rental.rentals[j].lastName},
                        "carId": rental.rentals[j].carId,"pickupDate": rental.rentals[j].pickupDate,"returnDate": rental.rentals[j].returnDate,"distance": 150,"deductibleReduction": rental.rentals[j].deductibleReduction};
        if(rentalModif.rentalModifications[i].distance!=null){
          newRental.distance=rentalModif.rentalModifications[i].distance;
        }
        if(rentalModif.rentalModifications[i].pickupDate!=null){
          newRental.pickupDate=rentalModif.rentalModifications[i].pickupDate;
        }
        if(rentalModif.rentalModifications[i].returnDate!=null){
          newRental.returnDate=rentalModif.rentalModifications[i].returnDate;
        }
      }
    }
  }
}*/
//the function which calculate the commision, insurance,roadside assistance and Drivy of rental cars :
function calculCommision(differenceDate,total2,Deduction)
{
  var comm=Math.round(total2*0.3 );
  var insurance =comm/2;
  var assistance=differenceDate;
  var Drivy=Math.round(total2*0.3 - (((total2*0.3)/2 )+differenceDate));
  if(Deduction)
  {
    comm=Math.round(total2*0.3 )+4*differenceDate;
    Drivy  = comm/2-differenceDate;
    insurance =comm/2;
    //return "<p>&nbsp;&nbsp;&nbsp;&nbsp;"+"commision : " +comm+" insurance: " + Math.round(comm/2) + " ,roadside assistance: " + differenceDate + " and Drivy: " +Drivy+"</p>";
  }
  //else{return "<p>&nbsp;&nbsp;&nbsp;&nbsp;"+"commision : " +Math.round(total2*0.3 )+" insurance: " + Math.round((total2*0.3)/2) + " ,roadside assistance: " + differenceDate + " and Drivy: " +Drivy+"</p>";}
  var Commision = [comm,insurance,assistance,Drivy];
  return Commision;
}

function diffdate(date1,date2) {
    var diff= Date.parse(date2)-Date.parse(date1);
    return diff/(1000*24*60*60) +1;
}

function reduction(differenceDate,total)
{
  if(differenceDate>10)
    {
      return total*0.5;
    }
    else if(differenceDate>4)
    {
      return total*0.7;
    }
    else if(differenceDate>1)
    {
      return total*0.9;
    }
    else
    {
      return total;
    }
}
//fill option in the html select
var select = document.getElementById("rentalSelect");
var options = [];
for (var l = 0; l < rental.rentals.length; l++) {
  options[l]=rental.rentals[l].id;
}
//set values on html
for(var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
//function which call when the option changed
function combo(thelist, theinput) {
    theinput = document.getElementById(theinput);
    var idx = thelist.selectedIndex;
    var content = thelist.options[idx].innerHTML;
    for (var i = 0; i < rental.rentals.length; i++) {
      if(rental.rentals[i].id==content){
        var dis=rental.rentals[i].distance.toString();
        document.getElementById("theinput2").value=dis;
        document.getElementById("theinput").value=content;
        document.getElementById("theinput3").value=rental.rentals[i].pickupDate.toString();
        document.getElementById("theinput4").value=rental.rentals[i].returnDate.toString();
      }
    }
}

function saveChanges(){
  var rentalBefore;
  for (ii = 0; ii < rental.rentals.length; ii++) {
    if(rental.rentals[ii].id==document.getElementById("theinput").value){
      document.getElementById("theinput5").value=tableR.rows[ii+1].cells[5].innerHTML;
    }
  }
  var date1 = document.getElementById("theinput3").value;
  var date2 = document.getElementById("theinput4").value;
  if(diffdate(date1,date2)<0){
    alert("Wrong Date input!");
  }
  else{
    var ddl = document.getElementById("rentalSelect");
    var selectedValue = ddl.selectedIndex;
    if(selectedValue==0){
      alert("Please first choose an item and modify it...");
    }
    else {
      for (var i = 0; i < rental.rentals.length; i++) {
        if(rental.rentals[i].id==document.getElementById("theinput").value){
          rental.rentals[i].distance=document.getElementById("theinput2").value;
          rental.rentals[i].pickupDate=document.getElementById("theinput3").value;
          rental.rentals[i].returnDate=document.getElementById("theinput4").value;
        }
      }
      var table = document.getElementById("myTable1");
      for(var i = 1; i < table.rows.length;)
      {
         table.deleteRow(i);
      }
      initialization();
    }
  }
}
