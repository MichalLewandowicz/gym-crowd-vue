<template>
  <div id="app">
    <main>

      <h4>Select date:</h4>
      <datepicker class="datepick" v-model="date" :monday-first="true" :highlighted="highlighted"
      :value="date"
      @selected="selectedDate"
      format="dd/MM/yyyy"></datepicker>

      <h4>Select time:</h4>
      <timeselector v-model="myTime" :h24="true" displayFormat="HH" :interval="{h:1, m:60}" @selectedHour="selectedTime" placeholder="Select time"></timeselector>

      <button class="btn" @click="callModel">Predict</button>

      <div class="date">{{ prediction }}</div>


      <div class="weather-wrap">
        <div class="location-box">
          <div class="location">Athlone, IE</div>
          <div class="date">{{ format_day(date) }}, {{ format_date(date) }}</div>
          <div class="time">{{ myTime2 }}</div>
          <div class="holiday">{{ holidayName }}</div>
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(temp) }}&#176;C {{item}} <img v-bind:src="'http://openweathermap.org/img/wn/' + iconId + '@2x.png' "  />
            <div class="description">{{ capitalizeDescription(description) }}</div>
          </div>
          <!-- <div class="weather">{{ capitalizeDescription(description) }}</div> -->
          <!-- https://openweathermap.org/img/wn/10d@2x.png
          https://openweathermap.org/img/wn/01d@2x.png -->
          <div class="icon">
            <!-- {{item}}
            <img v-bind:src="'http://openweathermap.org/img/wn/' + iconId + '@2x.png' "  /> -->
          </div>
        </div>
      </div>

    <router-view/>
    </main>

  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import Timeselector from 'vue-timeselector';

export default {
  name: "App",
  components: {
    Datepicker,
    Timeselector
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
      description: '',
      holiday: '',
      holidayName: '',
      item: '',
      iconId: '',
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
    // this.getHolidaysApi();
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
        this.myTime2 = this.time.split(":")[0] + ":00"
        // this.myTime2 = this.weather.list[0].dt_txt.split(" ")[1].split(":")[0] + ":00:00";
        this.highlighted.dates.push(new Date(this.weather.list[0].dt_txt))        
        this.iconId = this.weather.list[0].weather[0].icon;
      });
    },
    selectedTime() {
      this.$nextTick(function() {     
        this.time = this.myTime.toString().split(" ")[4];
        this.myTime2 = this.time.split(":")[0] + ":00";
        // this.description = this.weather.list[0].weather[0].main;
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
      // let days = [
      //   "Monday",
      //   "Tuesday",
      //   "Wednesday",
      //   "Thursday",
      //   "Friday",
      //   "Saturday",
      //   "Sunday",
      // ];

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
        }
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
        this.holidayName = h.name;
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
      var url = "https://gym-crowdedness-predictions.herokuapp.com/";
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
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  max-width: 600px;
  font-size: 20px;
  background-repeat: no-repeat;
  background-attachment: fixed;  
  background-size: cover;
}
body {
  font-family: "Quicksand", sans-serif;
  /* padding: 25px; */
  background-image: url('./assets/back5.jpg');
}
main {
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55));
  min-height: 100vh;
  padding:25px;
}
/* #app {
  
} */

.btn {
  padding: 4px 8px;
  margin: 10px 0;
  border: 1px solid #1569C7;
  background-color: #fff;
  font-family: "Quicksand", sans-serif;
  font-weight: 600;
  border-radius: 5px;
  box-shadow: 1px 2px rgba(0, 0, 0, 0.15);

}

.location-box .location {
  padding-top: 10px;
  color: #fff;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}
.location-box .date {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
  padding: 10px;
}
.location-box .time {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
}
.location-box .holiday {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
  padding: 10px;
}

.weather-box {
  text-align: center;
  vertical-align: baseline;
  /* padding: 1px 25px; */
  color: #254c71;
  text-shadow: 1px 2px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  box-shadow: 2px 3px rgba(155, 155, 155, 0.35);
}
.weather-box .temp {
  /* margin: 10px; */
  display: inline-block;
  /* padding: 10px 25px; */
  /* color: #536878; */
  /* color: #254c71; */
  font-size: 60px;
  font-weight: 500;
  /* text-aling: center;
  text-shadow: 1px 2px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  box-shadow: 3px 4px rgba(0, 0, 0, 0.35); */
}
.weather-box img {
  vertical-align: middle;
  padding-bottom: 10px;
}
.weather-box .description {
  padding-bottom: 10px;
  /* color: #254c71; */
  font-size: 26px;
  /* font-weight: 500; */
  /* text-shadow: 1px 2px rgba(0, 0, 0, 0.25); */
}
.weather {
  /* margin: auto;
  max-width: 800px; */
}


</style>