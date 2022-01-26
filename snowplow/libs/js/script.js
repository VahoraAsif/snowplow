//Preloader
$(window).load(function() {
	$('#preloader').delay(2000).fadeOut('slow');
 });

//Leaflet Map
let mymap = L.map('map').setView([51.5465589, 0.0352543], 12);
let  OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

}).addTo(mymap);

//Dropdwon Menu
$(function(){
    $.ajax({
        url: "libs/php/dropDown.php",
        type: 'GET',
        dataType: "json",
        
        success: function(result) {
            
            for (const [name, iso_a2] of Object.entries(result.data)) {
                $('#chooseCountry').append($('<option>', {
                    text: name,
                    value: iso_a2,
                }));
            }
               sortDropDownListByText();
            },
            error: function(result) {
                
                console.log(result);
            }
        });
        function sortDropDownListByText() {
        
            $("select").each(function() {
                 var selectedValue = $(this).val();
                 $(this).html($("option", $(this)).sort(function(a, b) {
                    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                }));
                $(this).val(selectedValue);
            });
        };
        navigator.geolocation.getCurrentPosition(userLocation);
    });

//User's location
function userLocation(position) {
        let userPositionlat = position.coords.latitude;
        let userPositionlng = position.coords.longitude;
        
        $.ajax({
            url: 'libs/php/userLocation.php',
            type: 'POST',
            dataType: 'json',
            data: {
                lat: userPositionlat,
                lng: userPositionlng
            },
    
            success: function(result) {
    
                isoa2 = result['data'];
                $('#chooseCountry option[value=' + isoa2 + ']').prop("selected", true).change();
    
            },
    
            error: function(result) {
                console.log(result);
            }
        })
    };

    //countryInfo
    var countryInfo = L.easyButton({
        states: [{
                stateName: 'open-country-modal',        
                icon:      'fa-globe-asia fa-2x',               
                title:      'Country Infomation',      
                onClick: function onEachFeature(f, l) {
                    var countryCode = $('#chooseCountry option:selected').val(); 
                    modalCountry(countryCode);
                }
        
        }]
    }); 
   
    //Weather
    var weatherInfo = L.easyButton({
        states: [{
                stateName: 'open-weather-modal',        
                icon:'fa-cloud-moon-rain fa-2x',              
                title: 'Weather Information',      
                onClick: function onEachFeature(f, l) {
                    var countryName = $('#chooseCountry option:selected').text(); 
                    modalWeather(countryName);
                }
        
        }]
    }); 
    

    //Covid
    var covidInfo = L.easyButton({
        states: [{
                stateName: 'open-covid-modal',        
                icon:      'fa-viruses fa-2x',               
                title:      'Covid Information',      
                onClick: function onEachFeature(f, l) {
                    var countryCode = $('#chooseCountry option:selected').val();
                    modalCovid(countryCode);
                }
        
        }]
    }); 
    

    //Holiday
    var holidayInfo = L.easyButton({
        states: [{
                stateName: 'open-covid-modal',        
                icon:      'fa-calendar-day fa-2x',               
                title:      'Holiday Information',      
                onClick: function onEachFeature(f, l) {
                    var countryCode = $('#chooseCountry option:selected').val();
                    modalHoliday(countryCode);
                }
        
        }]
    }); 
   


    countryInfo.button.style.cssText = "height:35px;width:37px;padding:5px;color: skyblue;";
    weatherInfo.button.style.cssText = "height:35px;width:37px;padding:5px;color: green;";
    covidInfo.button.style.cssText = "height:35px;width:37px;padding:5px;color: black;";
    holidayInfo.button.style.cssText = "height:35px;width:37px;padding:5px;color: red;";

//cityLayer
var layerGroup = new L.layerGroup()   

//Borders
let GeoJSONLayer =new L.GeoJSON();
let style = {
    "color": "#cc6699",
    "weight": 3,
    "opacity": 1,
};


$('#chooseCountry').change(function() {
    let countryCode = $('#chooseCountry option:selected').val();
    $.ajax({
        url: "libs/php/borders.php",
        type: 'POST',
        dataType: 'json',
        data: {
            iso_a2: countryCode
        },
        
        success: function(result) {
            if (result.status.name == "ok") {
                GeoJSONLayer.clearLayers();
                layerGroup.clearLayers();
                var latlng = result['data'];
                GeoJSONLayer.addData( latlng ).setStyle( style ).addTo( mymap );
                mymap.fitBounds(GeoJSONLayer.getBounds());
                cityMarkers(countryCode);
                layerGroup.addTo(mymap);
                countryInfo.addTo(mymap);
                weatherInfo.addTo(mymap);
                covidInfo.addTo(mymap);
                holidayInfo.addTo(mymap);
               
            }
               
            },
        error: function(jqXHR, textStatus, errorThrown) {
               
                console.log(errorThrown);
       
    
        }
        });
});
    
//CountryInfo
var modalCountry = function(countryCode){
    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            code: countryCode
        },
        
        success: function(result) {
           
          country= $('#chooseCountry option:selected').text(); 
          var number = numeral(result['data'][0]['area']);
          var area = number.format('0,0'); 
          var number_people = numeral(result['data'][0]['population']);
          var population = number_people.format('0,0'); 
            
            if (result.status.name == "ok") {
                var superText = "2";
                $('#countryFlag').html("<img src='" + result['data'][0]['flag']+"' style='height:50px;width:50px'>");
                $('#countryName').html(result['data'][0]['name']);
                wikiInfo(country);
                $('#countryCapital').html(result['data'][0]['capital']);
                $('#countryRegion').html(result['data'][0]['region']);
                $('#countryArea').html(area + "km"+superText.sup());
                $('#countryPopulation').html(population +" people");
                $('#countryLanguages').html(result['data'][0]['languages'].map(lang => lang.name).join(", ") + ".") ;
                $('#countryCurrency').html(result['data'][0]['currencies'][0]['symbol'] +" " + result['data'][0]['currencies'][0]['name']);
               
                $('#modalCountry').modal('show');
               
            }
               
            },
        error: function(result) {
               
                console.log(result);
            }
        });
    }


//Weather
var modalWeather = function(countryName){   
    $.ajax({
        url: "libs/php/weather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: countryName
        },
        
        success: function(result) {
            var currentDate = new Date();
            var date = currentDate.toDateString();
            var temp = Math.round(result['data'][0]['main']['temp']);
            var temp1 = Math.round(result['data'][1]['main']['temp']);
            var temp2 = Math.round(result['data'][2]['main']['temp']);
            var temp3 = Math.round(result['data'][3]['main']['temp']);
            var temp4 = Math.round(result['data'][4]['main']['temp']);
            var feels_like = Math.round(result['data'][0]['main']['feels_like']);
            var temp_min = Math.round(result['data'][0]['main']['temp_min']);
            var temp_max = Math.round(result['data'][0]['main']['temp_max']);
            var date1= result['data'][1]['dt_txt'];
            var d = new Date(date1);
            var dd = d.getUTCDay();
            
            day = [];
            for(var i=1; i<result.data.length; i++) {
                var weekday=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                var dt_txt = (result['data'][i]['dt_txt']);
                var dt = new Date(dt_txt);
                var day1 = weekday[dt.getDay()];
                day.push(day1);

            }
            if (result.status.name == "ok") {
                $("#weather-date").html(date);
                $("#temp").html(temp + "&deg;C");
                $("#type").html(result['data'][0]['weather'][0]['main']);
                $('#icon').html("<img src='http://openweathermap.org/img/wn/"+ result['data'][0]['weather'][0]['icon'] + "@2x.png'>");
                $("#feels_like").html("Feels Like: " + feels_like + "&deg;C");
                $("#temp_min").html("Minimum Temp: " + temp_min + "&deg;C");
                $("#temp_max").html("Maximum Temp: " + temp_max + "&deg;C");
                $("#weather-day1").html(day[0]);
                $("#weather-day2").html(day[1]);
                $("#weather-day3").html(day[2]);
                $("#weather-day4").html(day[3]);
                $("#temp1").html(temp1 + "&deg;C");
                $("#temp2").html(temp2 + "&deg;C");
                $("#temp3").html(temp3 + "&deg;C");
                $("#temp4").html(temp4 + "&deg;C");
                
                $('#modalWeather').modal('show');

            }
        },
        error: function(result) {
               
                console.log(result);
            }
        });
}


//Covid
var modalCovid = function(countryCode) {
    $.ajax({
        url: "libs/php/covid.php",
        type: 'POST',
        dataType: 'json',
        data: {
            code: countryCode
        },
        
        success: function(result) {
            
            var date = result['data'][0]['updated_at'];
            var dateFormat = new Date(date).toLocaleDateString("en-UK");
            var death = numeral(result['data'][0]['today']['deaths']);
            var today_death = death.format('0,0'); 
            var confirmed = numeral(result['data'][0]['today']['confirmed']);
            var today_confirmed = confirmed.format('0,0'); 
            var death_total = numeral(result['data'][0]['latest_data']['deaths']);
            var total_death = death_total.format('0,0'); 
            var confirmed_total = numeral(result['data'][0]['latest_data']['confirmed']);
            var total_confirmed = confirmed_total.format('0,0'); 
            var recovered_total = numeral(result['data'][0]['latest_data']['recovered']);
            var total_recovered = recovered_total.format('0,0'); 
            var critical_total = numeral(result['data'][0]['latest_data']['critical']);
            var total_critical = critical_total.format('0,0'); 
            
            if (result.status.name == "ok") {
                $('#updateOn').html("<mark>" + dateFormat + "</mark>");
                $('#name').html(result['data'][0]['name']);
                $("#todayDeath").html(today_death);
                $("#todayConfirm").html(today_confirmed);
                $('#deaths').html(total_death);
                $('#confirm').html(total_confirmed);
                $('#recover').html(total_recovered);
                $('#critical').html(total_critical);
                
                $('#modalCovid').modal('show');
               
            }
               
            },
        error: function(result) {
                console.log(result);
       }
        });
}


//Wiki
var wikiInfo = function(e) {
    $.ajax({
        url: "libs/php/wikiInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: e
        },
        
        success: function(result) {
           
            document.getElementById('citySummary').innerText = result['data'][0]['summary'];
            document.getElementById('countrySummary').innerText = result['data'][0]['summary'];
            document.getElementById('countryWikiLink').href = 'https://' + result['data'][0]['wikipediaUrl'];
            document.getElementById('cityWikiLink').href = 'https://' + result['data'][0]['wikipediaUrl'];
            }
       
        });
    
}

//Holidays
var modalHoliday = function(countryCode){   
    $.ajax({
        url: "libs/php/holidays.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: countryCode
        },
        
        success: function(result) {
            var holidayTable = $("<tbody></tbody>").appendTo('#holidayTable');
            var holidayList = result['data']['holidays'];
            document.getElementById('holidayTitle').innerText =  $('#chooseCountry option:selected').text();
            holidayList.forEach(function (holiday){
                    var rowHeader = $("<tr></tr>").appendTo(holidayTable);
                    var holidayDate = new Date(holiday.date.iso).toLocaleDateString("en-UK");
                    
                    if (result.status.name == "ok") {
                       $('<td></td>').text(holiday.name).appendTo(rowHeader);
                       $('<td></td>').text(holidayDate).appendTo(rowHeader);
                       
                    }
                });
                $('#modalHoliday').modal('show');   
               },
            error: function(result) {
                console.log(result);
            }
        });
    };



  
//ExtraMarkers
function cityMarkers() {
    var countryCode = $('#chooseCountry option:selected').val();
    $.ajax({
        url: "libs/php/cityMarkers.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: countryCode
        },
        success: function(result) {
           
            for(var i=0; i<result.data.length; i++) {
                let latlng = [result.data[i].lat, result.data[i].lng];
                let cityName = result.data[i].name;
                var pop = numeral( result.data[i].population);
                var population= pop.format('0,0'); 
               
                var redMarker = L.ExtraMarkers.icon({
                icon: 'fa-city',
                markerColor: 'blue',
                shape: 'square',
                prefix: 'fa'
              });  
              let marker = (L.marker(latlng, {icon: redMarker}).addTo(layerGroup)); 
            
              marker.on('click', function() {
              document.getElementById('cityName').innerText = cityName;
              document.getElementById('featureType').innerText = "City";
              document.getElementById('cityPopulation').innerText = population;
              wikiInfo(cityName);
              
              $('#modalCityMarker').modal('show');
                
            });
        }
    },
       
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    })
};




  