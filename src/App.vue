<template>
  <div id="app">
    <main>

      <div class="grid-container">
        <div class="location">{{ city }}</div>

        <div class="left">{{ format_day(date) }}, {{ format_date(date) }} {{ holidayName }}</div>
        <div class="date-picker">
          <datepicker class="datepick" v-model="date" :monday-first="true" :highlighted="highlighted"
          calendar-class="cal-class"
          :value="date"
          @selected="selectedDate"
          format="dd/MM/yyyy"></datepicker>
        </div>

        <div class="left">{{ myTime2 }}</div>
        <div class="time-picker">
          <timeselector class="timepick" v-model="myTime" :h24="true" displayFormat="HH" :interval="{h:1, m:60}" @selectedHour="selectedTime"></timeselector>
        </div>

        <div class="left">{{ capitalizeDescription(description) }}</div>
        <div class="weather_info">Precipitation: {{ precipitation }}&#37;</div>

        <div class="temp">{{ Math.round(temp) }}&#176;C{{item}} <img v-bind:src="'http://openweathermap.org/img/wn/' + iconId + '@2x.png' "  /> </div>
        <div class="weather_info">Humidity: {{ humidity }}&#37;</div>        

        <div class="weather_info">Wind speed: {{ Math.round(wind*3.6) }}km/h</div>
        <div class="weather_info">Feels like: {{ Math.round(feels_like) }}&#176;C</div>

      </div> <!-- end grid-container -->
      
      <button class="btn" @click="callModel">Predict</button>
      <div class="weather_info">{{ prediction }}</div>
      <hr class="hr1">

      <horizontal-scroll>
        <ul class="future-weather">
          <li v-for="w in futureWeather" v-bind:key="w.date">
            <div class="fw">{{item}} <img v-bind:src="'http://openweathermap.org/img/wn/' + w.icon + '@2x.png' "  /></div>
            <div class="fw">{{ format_day(w.date) }}</div>
            <div class="fw">{{ Math.round(w.temp) }}&#176;C</div>
          </li>
        </ul>
      </horizontal-scroll>
      <router-view/>
    </main>

  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import Timeselector from 'vue-timeselector';

import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'

export default {
  name: "App",
  components: {
    Datepicker,
    Timeselector,
    HorizontalScroll
  },
  data () {
    return {      
      highlighted: {
        dates: [                  
         ],      
        },
      holidaysDates: [
      ],
      semesterDates: [
        "01-17","01-18","01-19","01-20","01-21","01-22","01-23","01-24","01-25","01-26","01-27","01-28","01-29","01-30","08-24","08-25",
        "08-26","08-27","08-28","08-29","08-30","08-31","09-01","09-02","09-03","09-04","09-05","09-06","09-07","09-08"
      ],
      myTime: '',
      myTime2: '',
      date: '',
      temp: '',
      feels_like: '',
      humidity: '',
      wind: '',
      precipitation: '',
      description: '',
      holiday: '',
      holidayName: '',
      item: '',
      iconId: '',
      futureWeather: [],
      base_url: 'https://api.openweathermap.org/data/2.5/',
      APIkey: "3dd52f411c1cd3bfdebc566e4b72cd61",
      city: "Athlone",
      weather: {},
      time: '',
      theTime: '',
      modelDayOfMonth: '',
      modelDayOfWeek: '',
      modelHour: '',
      modelTemp: '',
      modelMonth: '',
      modelIsWeekend: '',
      modelDuringSemester: '',
      prediction: '',
      days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],      
    };
  },
  created() {
    this.getCurrentWeather();
    this.getHolidaysApi();
    this.startOfSemester();
  },
  methods: {
    getCurrentWeather() {
      axios
      .get(`${this.base_url}forecast?q=${this.city}&units=metric&appid=${this.APIkey}`)
      .then((res) => {
        this.weather = res.data;
        this.date = this.weather.list[0].dt_txt.split(" ")[0];
        this.temp = this.weather.list[0].main.temp;
        this.time = this.weather.list[0].dt_txt.split(" ")[1];
        this.description = this.weather.list[0].weather[0].description;
        this.myTime2 = this.time.split(":")[0] + ":00";
        this.highlighted.dates.push(new Date(this.weather.list[0].dt_txt))    
        this.iconId = this.weather.list[0].weather[0].icon;
        this.feels_like = this.weather.list[0].main.feels_like;
        this.humidity = this.weather.list[0].main.humidity;
        this.wind = this.weather.list[0].wind.speed;
        this.precipitation = this.weather.list[0].pop;

        this.weather.list.forEach(list => {
          if (list.dt_txt.split(" ")[1] == this.time) {
           const data = {
             'date': list.dt_txt,
             'temp': list.main.temp,
             'icon': list.weather[0].icon       
          }
          this.futureWeather.push(data);
        }
      })
      });
    },
    selectedTime() {
      this.$nextTick(function() {     
        this.time = this.myTime.toString().split(" ")[4];
        this.myTime2 = this.time.split(":")[0] + ":00";
        this.getDayOfWeek();
      })
    },
    selectedDate() {
      this.$nextTick(function() {
        this.date = this.format_date2(this.date);
        this.findHoliday(this.date);
        this.getDayOfWeek();
        this.startOfSemester();
      })
    },
    startOfSemester() {
      let d = this.date.split("-")[1] + "-" + this.date.split("-")[2];
      let s = this.semesterDates.find(x => x == d);
      if(s) {
        this.modelDuringSemester = 1;
      } else {
        this.modelDuringSemester = 0;
      }
    },
    getHolidaysApi() {
      // FIRST KEY: 7d4a2067b3aee38d58f4e26a844feed457f74c83
      axios
      .get('https://calendarific.com/api/v2/holidays?&api_key=a3d1e3174afdd6ae7165046e0322153345409b2b&country=IE&year=2021')
      .then((res) => {
        this.holiday = res.data;
        this.getHolidays();
      });
    },
    dateBuilder() {
      let d = new Date();
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let day = this.days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();

      return `${day} ${date} ${month} ${year}`;
    },
    format_date(date) {
      if (date) {
        return moment(String(date)).format("DD/MM/YYYY");
      }
    },
    format_day(date) {
      if(date) {
        return moment(String(date)).format("dddd");
      }
    },
    format_date2(date) {
      if (date) {
        return moment(String(date)).format("YYYY-MM-DD");
        }
    },
    capitalizeDescription() {
      const arr = this.description.split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      const capitalized = arr.join(" ");
      this.description = capitalized;
      return this.description;
    },
    callModel() {
      this.getDayOfWeek();
      this.splitTime();
      this.checkDayOfWeek(this.date);
      this.checkWeekend();
      this.loadDoc();
    },
    getDayOfWeek() {
      this.weather.list.forEach(list => {
        this.theTime = this.date + " " + this.time;
        if (list.dt_txt == this.theTime) {
          this.modelTemp = Math.round(list.main.temp);
          this.temp = list.main.temp;
          this.description = list.weather[0].description;
          this.iconId = list.weather[0].icon;
          this.precipitation = list.pop;
          this.humidity = list.main.humidity;
          this.wind = list.wind.speed;
          this.feels_like = list.main.feels_like;
        }
        this.futureWeather.date = list.dt_txt;
        this.futureWeather.temp = list.main.temp;
        this.futureWeather.icon = list.weather[0].icon;
        this.futureWeather.splice(0);
        this.weather.list.forEach(list => {
          if (list.dt_txt.split(" ")[1] == this.time) {
            const data = {
              'date': list.dt_txt,
              'temp': list.main.temp,
              'icon': list.weather[0].icon       
            }
            this.futureWeather.push(data);
          }
        })
      })
    },
    getHolidays() {
      this.holiday.response.holidays.forEach(el => {
        const data = {
          'date': el.date.iso.split('T')[0],
          'name': el.name
        }
        this.holidaysDates.push(data)
        this.highlighted.dates.push(new Date(el.date.iso.split('T')[0]))
      })      
    },
    findHoliday() {
      const h = this.holidaysDates.find( ({ date }) => date == this.date);
      if(h) {
        this.holidayName = "(" + h.name + ")";
      } else {
        this.holidayName = "";
      }
    },
    splitTime() {
      this.modelHour = parseInt(this.time.split(':')[0]);
      this.modelDayOfMonth = parseInt(this.date.split('-')[2]);
      this.modelMonth = parseInt(this.date.split('-')[1]);
    },
    checkDayOfWeek(date) {
      const d = moment(String(date)).format("dddd");
      this.modelDayOfWeek = (this.days.indexOf(d) + 1);
    },
    checkWeekend() {
      if (this.modelDayOfWeek == 6 || this.modelDayOfWeek == 7) {
        this.modelIsWeekend = 1;
      } else {
        this.modelIsWeekend = 0;
      }
    },
    loadDoc() {
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "https://sri-app-backup.herokuapp.com/";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var p = JSON.parse(this.responseText);
          comp.prediction = "Gym crowd size prediction: " + p["Gym crowd size prediction "];
        }
      };
      var data = JSON.stringify({
        "day_of_week":[this.modelDayOfWeek],
        "is_weekend":[this.modelIsWeekend],
        "temperature_celcius":[this.modelTemp],
        "is_during_semester":[this.modelDuringSemester],
        "month":[this.modelMonth],
        "hour":[this.modelHour],
        "day_of_month":[this.modelDayOfMonth] 
        });
      xhr.send(data);
      console.log("Data sent:", data);
	},
  },
};
</script>

<style>
* {
  background-repeat: no-repeat;
  background-attachment: fixed;  
  background-size: cover;
  color: #0d1a26;
}
body {
  background-image: url('./assets/background.png');
}
.grid-container {
  display: grid;
  grid-template-columns: auto;
}
.temp {
  grid-row: 2/2;
}
.date-picker {
  text-align: center;
  width: 100%;
}
.time-picker {
  max-width: 173px;
  padding-bottom: 3px;
}
.location {
  color: #172d44;
  font-size: 30px;
  font-weight: 500;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}
.left {
  padding-bottom: 3px;
  color: #172d44;
  font-size: 20px;
  font-weight: 500;
}
.weather_info {
  font-size: 20px;
  font-weight: 500;
}
.temp {
  font-size: 60px;
  font-weight: 500;
  text-shadow: 1px 4px rgba(0, 0, 0, 0.25);
}
.temp img {
  vertical-align: middle;
  padding-bottom: 12px;
}
main {
  border-radius: 4px;
  padding: 30px;
  max-width: 800px;
  font-family: "Quicksand", sans-serif;
}
.btn {
  padding: 4px 8px;
  margin: 10px 0;
  border: 1px solid #1569C7;
  background-color: #fff;
  font-family: "Quicksand", sans-serif;
  font-weight: 600;
  font-size: 20px;
  border-radius: 5px;
  box-shadow: 1px 2px rgba(0, 0, 0, 0.15);
}
hr.hr1 {
  border: 1px solid #6599cb;
}
.future-weather {
  display: grid;
  grid-template-columns: repeat(5, 100px [col-start]);
  list-style: none;
  }
li {
  text-align: center;
}
.fw {
  font-weight: 500;
}

@media screen and (min-width: 480px) {
  .date-picker .datepick {
    font-size: 18px;
  }
  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 10px;
  }
  .location {
    grid-column: 1/4;
  }
  .left {
    grid-column: 1/3;
    padding-bottom: 0;
  }
  .weather_info {
    grid-column: 3/4;
  }
  .temp {
    grid-column: 1/3;
    grid-row: 5/9;
  }
  main {
    background-color: #cdddee;
    margin: 50px auto;
  }
  ul.future-weather li {
    display: inline;
  }
  .future-weather {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(5, 100px [col-start]);
    list-style: none;
    }
}

</style>