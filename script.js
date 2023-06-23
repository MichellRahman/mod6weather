var apiKey = 'a368afa54846105309be86486a4d7b0c';
function getCity(){
    var city = document.getElementById('city').value;
    var p = document.createElement('p');
    p.textContent = city;
    p.onclick = function() {
        getCoords(city);
    }
    document.getElementById('cities').appendChild(p); 
    var cities = localStorage.getItem('cities');
    if (cities == null){
        localStorage.setItem('cities', city);
    } else {
        localStorage.setItem('cities', cities + ';' + city);
    }
    getCoords(city);
}
function getCoords(city) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + apiKey;
    fetch (url).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var temp = data.main.temp;
                var humidity = data.main.humidity;
                var windSpeed = data.wind.speed;
                var date = new Date();
                var month = date.getMonth()+1;
                var day = date.getDate();
                var year = date.getFullYear();
                var dateString = month+'/' + day + '/' + year;
                var output = '<h2>'+city+' ('+dateString+')</h2>';
               output +='<p><img src="http://openweathermap.org/img/wn/'+data.weather[0].icon+'.png"></p>';
                output +='<p>Temp: ' + temp + '&deg; F</p>';
                output +='<p>Humidity: ' + humidity + '%</p>';
                output +='<p>Wind Speed: ' + windSpeed + ' mph</p>';
                document.getElementById('today').innerHTML=output;
                document.getElementById('today').style.display='block';
                getWeather(data.coord.lat, data.coord.lon);
            })
        }
    })
}
function getWeather(lat, lon){
    var url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=' + apiKey;
    fetch (url).then(function(response){
        if(response.ok){
            response.json().then(function(data){
               var output = '';
               for (let index = 0; index < 40; index+=8) {
                output += '<div>';
                var date = data.list[index].dt_txt;
                var month = date.substring(5,7);
                var day = date.substring(8,10);
                var year = date.substring(0,4);
                var dateString = month+'/' + day + '/' + year;
                output += '<p class="date">' + dateString + '</p>';
                output +='<p><img src="http://openweathermap.org/img/wn/'+data.list[index].weather[0].icon+'.png"></p>';
                var temp = data.list[index].main.temp;
                var humidity = data.list[index].main.humidity;
                var windSpeed = data.list[index].wind.speed;
                output +='<p>Temp: ' + temp + '&deg; F</p>';
                output +='<p>Humidity: ' + humidity + '%</p>';
                output +='<p>Wind Speed: ' + windSpeed + ' mph</p>';
                output += '</div>';
                
               }
               document.getElementById('forecast').innerHTML=output;
               document.getElementById('fiveDay').style.display='block';
            })
        }
    })
}
document.getElementById('search').addEventListener('click', getCity);
var cities = localStorage.getItem('cities');
if (cities != null){
    var cityArray = cities.split(';');
    for (let index = 0; index < cityArray.length; index++) {
        var p = document.createElement('p');
        p.textContent = cityArray[index];
        p.onclick = function() {
            getCoords(cityArray[index]);

        }
        document.getElementById('cities').appendChild(p); 
        
    }
}