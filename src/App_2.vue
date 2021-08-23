<template>
  <div id="app">

      <!-- <CreatePost /> -->
      <!-- <div>{{ holidays.response.holidays }}</div> -->
      <h4>Select date:</h4>
      <datepicker v-model="date2" :monday-first="true" :highlighted="highlighted"
      :value="date2"
      @selected="atSelected"
      format="dd/MM/yyyy"></datepicker>

      <h4>Select time:</h4>
      <timeselector v-model="myTime" :h24="true" displayFormat="HH" :interval="{h:1, m:60}" @selectedHour="myHour" placeholder="Select time"></timeselector>
      <!-- <timeselector v-model="myTime" :displayMinutes="false" returnFormat="HH:00" @formatedTime="formatedTime" @selected="myHour"></timeselector> -->

      <!-- <h4>Select date:</h4>
      <datetime v-model="date" :highlighted="highlighted" firstDayOfWeek="1" format="YYYY-MM-DD" width="100%"></datetime>
      <h4>Select time:</h4>
      <datetime v-model="time" format="H:i" width="100%"></datetime> -->

      <button @click="callModel">Send</button>

      <!-- <div>Testing date {{ format_date2(date2) }}</div>
      <div>Time Selected: {{ myTime2 }}</div>
      <div>Current date: {{ currentDate }}</div> -->
      <!-- <div>Date: {{ date }}</div>
      <div>Date2: {{ format_date(date2) }}</div>
      <div>Time: {{ time }}</div>
      <div>this.theTime: {{ theTime }}</div> -->

      <!-- <p>Data for model:</p>
      <div>month: {{ modelMonth }}</div>
      <div>day of month: {{modelDayOfMonth }}</div>
      <div>hour: {{ modelHour }}</div>
      <div>day of week: {{ modelDayOfWeek }}</div>
      <div>is weekend: {{ modelIsWeekend }}</div>
      <div>temp: {{ modelTemp }}</div> -->
      <div class="date">{{ prediction }}</div>

      <div class="city">Athlone, IE</div>

      <div class="weather">
        <div class="date">{{ format_day(date2) }}, {{ format_date(date2) }}, {{ myTime2 }}</div>
        <div class="date">{{ holidayName }}</div>
        <div class="temp">{{ Math.round(temp2) }}&#176;C</div>
      </div>

      <!-- <div class="weather">
        <div class="date">{{ format_day(date) }}, {{ format_date(date) }}</div>
        <div class="date">{{ holidayName }}</div>
        <div class="date">{{ time }}</div>
        <div class="temp">{{ Math.round(temp) }}&#176;C</div>
      </div> -->

    <router-view/>
  </div>
</template>

<script>
// import CreatePost from './components/CreatePost.vue'

import axios from "axios"
import moment from "moment";
import db from "./firebase/firebaseinit";
// import datetime from 'vuejs-datetimepicker';
import Datepicker from 'vuejs-datepicker';

import Timeselector from 'vue-timeselector';

export default {
  name: "App",
  components: {
    // datetime,
    Datepicker,
    Timeselector
    // CreatePost
  },
  data () {
    return {
      testingDate: '',
      newDate: '',
      highlighted: {
        dates: [
          // new Date("2021-01-01"),
          // new Date("2021-03-17"),
          // new Date("2021-01-01"),
          // new Date("2021-03-17"),
          // new Date("2021-01-01"),
          // new Date("2021-03-17"),
          // new Date("2021-04-02"),
          // new Date("2021-04-04"),
          // new Date("2021-04-05"),
          // new Date("2021-05-03"),
          // new Date("2021-06-07"),
          // new Date("2021-06-21"),
          // new Date("2021-08-02"),
          // new Date("2021-09-22"),
          // new Date("2021-10-25"),
          // new Date("2021-12-21"),
          // new Date("2021-12-24"),
          // new Date("2021-12-25"),
          // new Date("2021-12-31"),
          // new Date("2021-12-26")
                  
         ],      
        },

      dates2: [
        // {name: "New Year's Day", date:"2021-01-01"},
        // {name: "St. Patrick's Day", date: "2021-03-17"},
        // {name: "March Equinox", date: "2021-03-20"},
        // {name: "Good Friday", date: "2021-04-02"},
        // {name: "Easter", date: "2021-04-04"},
        // {name: "Easter Monday", date: "2021-04-05"},
        // {name: "May Day", date: "2021-05-03"},
        // {name: "June Bank Holiday", date: "2021-06-07"},
        // {name: "June Solstice", date: "2021-06-21"},
        // {name: "August Bank Holiday", date: "2021-08-02"},
        // {name: "September Equinox", date: "2021-09-22"},
        // {name: "October Bank Holiday", date: "2021-10-25"},
        // {name: "December Solstice", date: "2021-12-21"},
        // {name: "Christmas Eve", date: "2021-12-24"},
        // {name: "Christmas Day", date: "2021-12-25"},
        // {name: "St. Stephen's Day", date: "2021-12-26"},
        // {name: "New Year's Eve", date: "2021-12-31"}
      ],

      myTime: '',
      myTime2: '',
      timeNow: '',




      date2: '',
      date3: '',
      temp2: '',
      testDate2: '',
      
      // watch: {
      //   date2: function(val) {
      //     this.date2 = val;
      //   }
      // },


      holiday: '',
      holidayName: '',
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
      // currentTime: '',
      time: '',
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
 
      
    };
  },
  created() {
    this.getCurrentWeather();
    this.getHolidaysApi();
    // this.getCurrentTime();
    // this.myHour();
    // this.formatedTime();
    // this.testingDate = state.highlighted.dates;
    // this.currentDateTime();
    // this.getCityWeather();
    
  },
  methods: {
    getCurrentTime() {
      // const current = new Date();
      // const time = current.getHours() + ":00";
    },
    myHour() {
      // let t = "";
      // this.myTime = this.myTime.toString();
      // console.log("before", this.myTime, typeof(this.myTime))

      this.$nextTick(function() {
        // console.log("nextTick", this.myTime, typeof(this.myTime))
     
        this.myTime2 = this.myTime.toString().split(" ")[4];
        this.time = this.myTime2;
        // console.log("myTime2", this.myTime2)
        this.getDayOfWeek();
        // console.log("SPLITTED", t.split(" ")[4])

        // this.myTime = this.myTime;
        // this.getHolidays();
        // this.findHoliday(this.date2);
        // this.getDayOfWeek();
      })
      // this.myTime = myTime.split()
      // this.myTime = this.myTime.toDateString().split(":");
    },
    // formatedTime() {
    //   console.log("formatedTime before", this.myTime, typeof(this.myTime))
    //   this.myTime = this.myTime.toString();
    //   this.$nextTick(function() {
    //   })
    // },
    atSelected() {
      // this.$nextTick(() => console.log("nextTick", this.date2))
      this.$nextTick(function() {
        this.date2 = this.format_date2(this.date2);
        // this.getHolidays();
        this.findHoliday(this.date2);
        this.getDayOfWeek();
      })
    },

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
        // this.date = this.weather.list[0].dt_txt;
        this.date2 = this.weather.list[0].dt_txt.split(" ")[0];
        this.temp = this.weather.list[0].main.temp;
        this.temp2 = this.weather.list[0].main.temp;
        this.time = this.weather.list[0].dt_txt.split(" ")[1].split(":")[0] + ":00";
        // this.time = this.timeNow;
        this.myTime2 = this.weather.list[0].dt_txt.split(" ")[1].split(":")[0] + ":00:00";
        // this.myTime = this.myTime2;
        

        this.testDate = this.format_day(this.weather.list[0].dt_txt);
        this.highlighted.dates.push(new Date(this.weather.list[0].dt_txt))

        
      });
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
      },    // currentDateTime() {
    //   const current = new Date();
    //   const date = current.getDate() + '-0' + (current.getMonth() + 1) + '-' + current.getFullYear();
    //   const time = current.getHours() + ":" + current.getMinutes();
    //   const dateTime = date +' '+ time;

    //   return dateTime;
    // },    
    callModel() {
      this.getDayOfWeek();
      this.splitTime();
      this.checkDayOfWeek(this.date2);
      this.checkWeekend();
      // this.getHolidays();
      this.loadDoc();
      // this.findHoliday();

      // this.getCity();
    },
    getDayOfWeek() {
      // console.log("dayOfWeek time", this.time)

      this.weather.list.forEach(list => {
        this.dateList += list.dt_txt;
        // this.theTime = this.date2 + " " + this.time + ":00";
        this.theTime = this.date2 + " " + this.myTime2;
        // console.log("theTime", this.theTime)




        // console.log("dayOfWeek date2", this.date2, "this.theTime", this.theTime)

        if (list.dt_txt == this.theTime) {
          this.modelTemp = Math.round(list.main.temp);
          this.temp = list.main.temp;
          this.temp2 = list.main.temp;
          // console.log("dayOfWeek temp", this.temp2)
        }
      })
    },
    getHolidays() {
      // let vm = this;
      // console.log("THE TIME", this.date2)
      // console.log("thsi.holiday", this.holiday.response.holidays[0].name)
      this.holiday.response.holidays.forEach(el => {
        const data = {
          'date': el.date.iso.split('T')[0],
          'name': el.name
        }
        this.dates2.push(data)
        this.highlighted.dates.push(new Date(el.date.iso.split('T')[0]))
        // console.log("new date", this.newDate)
        // vm.highlighted.dates.push(el.date.iso.split('T')[0])
        // console.log("dates", this.highlighted.dates)
        // console.log(this.dates2)
        // this.dates.push({'date': el.date.iso.split('T')[0], 'name': el.name});
        // console.log(el.date.iso.split('T')[0])

        // if (el.date.iso.split('T')[0] == this.date) {
        //   this.holidayName = el.name;
        //   console.log("Bingo!", el.name)
        // }
        // console.log(el.date.iso.split('T')[0])
      })
      
    },
    findHoliday() {
      // d = this.format_date2(d).toString();
      // console.log("findHoliday this.date2", this.date2)

      // console.log("findHoliday", d, "typeOf", typeof(d))

      // console.log("findHoliday this.date", this.date)
      const h = this.dates2.find( ({ date }) => date == this.date2);
      // if (this.dates2.find( ({ date }) => date == this.date)) {
      //   console.log("Found", this.dates2.date, ", ", this.dates2.name)
      // } else {
      //   console.log("Not Found");
      // }
      if(h) {
        // console.log("Found", h.date, "/", h.name)
        this.holidayName = h.name;
      } else {
        this.holidayName = "";
        // console.log("Not")
      }



      // var hol = this.dates2.filter(function(elem) {
      //   if (elem.date == this.date) {
      //     console.log("Date:", elem.date, "name:", elem.name)
      //     return hol;
      //   }
      // })
    },
    getSelectedDate() {
      // console.log("this.date2 ", this.date2)
      this.testDate2 = this.format_date(this.date2)
      console.log("Formatted date", this.testDate2)
 
      // this.getTemp2();
    },
    getTemp2() {
      // this.weather.list.forEach(list => {
      //   // date.value.split("-").reverse().join("-");
      //   this.dateList += list.dt_txt;
      //   this.theTime = this.date + " " + this.time + ":00";

      //   if (list.dt_txt == this.theTime) {
      //     this.modelTemp = Math.round(list.main.temp);
      //     this.temp = list.main.temp;
      //     this.temp2 = list.main.temp;
          
      //   }
      // })

    },
    // getCity() {
    //   this.weather.list.forEach(city => {
    //     // this.city2 = this.weather.city.name;
    //     console.log(city, "NAME")
    //   })
    // },
    splitTime() {
      this.modelHour = parseInt(this.time.split(':')[0]);
      this.modelDayOfMonth = parseInt(this.date2.split('-')[2]);
      // this.modelMonth = parseInt(this.date.split('-')[1]);
      this.modelMonth = parseInt(this.date2.split('-')[1]);

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
  /* border: 1px solid black; */
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