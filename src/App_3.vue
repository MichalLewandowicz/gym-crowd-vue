<template>
  <div id="app">

      <!-- <CreatePost /> -->

      <h4>Select date:</h4>
      <datetime v-model="date" firstDayOfWeek="1" format="YYYY-MM-DD" width="100%"></datetime>
      <h4>Select time:</h4>
      <datetime v-model="time" format="H:i:s" width="100%"></datetime>
      <button @click="callModel">Send</button>
      <div>Day: {{ testDate }}</div>  
      <div>Date: {{ date }}</div>
      <div>Time: {{ time }}</div>

      <p>Data for model:</p>
      <div>month: {{ modelMonth }}</div>
      <div>day of month: {{modelDayOfMonth }}</div>
      <div>hour: {{ modelHour }}</div>
      <div>day of week: {{ modelDayOfWeek }}</div>
      <div>is weekend: {{ modelIsWeekend }}</div>
      <div>temp: {{ modelTemp }}</div>
      <div class="date">{{ prediction }}</div>

      <div class="city">Athlone, IE</div>

      <!-- <div class="weather">
        <div class="date">{{ format_day(currentDate) }}, {{ currentDate }} {{ currentTime }}</div>
        <div class="temp">{{ Math.round(temp) }}&#176;C</div>
      </div> -->

      <div class="weather">
        <div class="date">DATE: {{ date }}, </div>
        <div class="temp">{{ Math.round(temp) }}&#176;C</div>
      </div>

      <br />
      
      <div class="weather">
        <div class="date">{{ format_day(date) }}, {{ testDate }}</div>
        <div class="temp">{{ Math.round(temp) }}&#176;C</div>
      </div>

    <router-view/>
  </div>
</template>

<script>
// import CreatePost from './components/CreatePost.vue'

import axios from "axios"
import moment from "moment";
import db from "./firebase/firebaseinit";
import datetime from 'vuejs-datetimepicker';

export default {
  name: "App",
  components: {
    datetime
    // CreatePost
  },
  data () {
    return {
      base_url: 'https://api.openweathermap.org/data/2.5/',
      APIkey: "3dd52f411c1cd3bfdebc566e4b72cd61",
      city: "Athlone",
      weather: {},
      cities: [],
      city2: '',
      selectedDate: '',
      day: '',
      date: '',
      testDate: '',
      currentDate: '',
      currentTime: '',
      time: '',
      time2: '',
      temp: '',
      theHour: '',
      theTime: '',
      dayOfWeek: '',
      modelDayOfMonth: '',
      modelDayOfWeek: '',
      modelHour: '',
      modelTemp: '',
      modelMonth: '',
      modelIsWeekend: '',
      prediction: '',
      dateList: [],
      days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      // form: {
      //   day_of_week: '',
      //   is_weekend: '',
      //   temperature_celcius: '',
      //   is_during_semester: '',
      //   month: '',
      //   hour: '',
      //   day_of_month: ''
      // }
      
    };
  },
  created() {
    this.getCurrentWeather();
    // this.currentDateTime();
    // this.getCityWeather();
    
  },
  methods: {
    findDay() {
      var data = {specs:[{Name:"Power",Value:"1"},{
        Name:"Weight",Value:"2"},{Name:"Height",Value:"3"}]
        }

      var valObj = data.specs.filter(function(elem){
        if(elem.Name == "Power") return elem.Value;
        });

      if(valObj.length > 0)
      console.log(valObj[0].Value)
    },
    getCityWeather() {
      let firebaseDB = db.collection('cities');

      firebaseDB.onSnapshot(snap => {
        snap.docChanges().forEach(async(doc) => {
          if (doc.type === 'added') {
            try {
              const response = await axios.get(
                `${this.base_url}weather?q=${doc.doc.data().city}&units=metric&appid=${this.APIkey}`);
                const data = response.data;
                firebaseDB.doc(doc.doc.id).update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                })
                .then(() => {
                  // console.log(this.cities);
                })
            } catch(error) {
              console.log(error);
            }
          }
        })
      })
    },
    getCurrentWeather() {
      axios
      .get(`${this.base_url}forecast?q=${this.city}&units=metric&appid=${this.APIkey}`)
      .then((res) => {
        this.weather = res.data;
        // console.log(this.weather.list[0].main.temp);
        // console.log(this.weather.city.name);
        // console.log(this.format_date(this.weather.list[0].dt_txt));
        this.date = this.weather.list[0].dt_txt;
        console.log(this.weather.list[0].dt_txt, "/", this.date)
        this.time2 = this.weather.list[0].dt_txt;
        this.temp = this.weather.list[0].main.temp;
        this.testDate = this.format_date(this.weather.list[0].dt_txt);
        
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
      let days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();

      return `${day} ${date} ${month} ${year}`;
    },
    format_date(date) {
      if (date) {
        return moment(String(date)).format("DD-MM-YYYY HH:00");
      }
    },
    format_day(date) {
      if(date) {
        return moment(String(date)).format("dddd");
      }
    },
    currentDateTime() {
      const current = new Date();
      // const date = current.getFullYear() + '-0'+ (current.getMonth()+1) + '-' + current.getDate();
      const date = current.getDate() + '-0' + (current.getMonth() + 1) + '-' + current.getFullYear();
      const time = current.getHours() + ":" + current.getMinutes();
      const dateTime = date +' '+ time;
      this.currentDate = date;
      this.currentTime = time;
      return dateTime;
    },    
    callModel() {
      this.getDayOfWeek();
      this.splitTime();
      this.checkDayOfWeek(this.date);
      this.checkWeekend();
      this.loadDoc();
      // this.getCity();
    },
    getDayOfWeek() {
      this.weather.list.forEach(list => {
        this.dateList += list.dt_txt;
        // console.log(list.dt_txt, "DATE")
        this.theTime = this.date + " " + this.time.split(':')[0] + ":00:00";
        if (list.dt_txt == this.theTime) {
          this.modelTemp = Math.round(list.main.temp);
          this.currentDate = this.date + " " + this.time.split(':')[0] + ":00";
          this.currentTime = "";
          this.temp = list.main.temp;
        }
      })
    },
    // getCity() {
    //   this.weather.list.forEach(city => {
    //     // this.city2 = this.weather.city.name;
    //     console.log(city, "NAME")
    //   })
    // },
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
        "is_during_semester":[1],
        "month":[this.modelMonth],
        "hour":[this.modelHour],
        "day_of_month":[this.modelDayOfMonth] 
        });
      xhr.send(data);
	},
  },

};
</script>

<style>
* {
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
  max-width: 600px;
  font-size: 20px;
}

.date-picker {
  max-width: 800px;
  margin: auto;
  padding: 10px;
}
.city {
  margin: auto;
  padding: 10px;
  text-align: center;
  font-size: 26px;
  font-weight: 500;
}
.weather {
  margin: auto;
  max-width: 800px;
  border: 1px solid black;
  padding: 10px;
}
.weather .date {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding-top: 10px;
}
.weather .temp {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  padding: 10px;
}
</style>
