import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../models/user';
import { Electromer } from 'src/app/models/electromer';
import * as $ from '../../../assets/jquery-1.11.1.min';
import * as CanvasJS from '../../../assets/canvasjs.stock.min';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  user: User;
  val: any
  mySelect: any
  electromer: any
  from_date: any
  to_date: any
  electromers: any;
  selectedDataInRange: any = {}
  dataPoints1 = [];
  dataPoints2 = [];
  dataPoints3 = [];
  chart: any
  apiResult = {
    loading: false,
    error: '',
    info: ''
  }
  graphLoading = false

  constructor(
    private menu: MenuController,
    private authService: AuthService
  ) {
    this.menu.enable(true);
  }

  ionViewWillEnter() {
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  addSymbols(e) {
    var suffixes = ["", "K"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if (order > suffixes.length - 1)
      order = suffixes.length - 1;
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  initGraph() {
    let dpsLength = 0;
    this.chart = new CanvasJS.StockChart("chartContainer", {
      theme: "light2",
      exportEnabled: true,
      title: {
        text: "Electromer graph"
      },
      subtitles: [{
        text: "Subtitle"
      }],
      charts: [{
        toolTip: {
          shared: true
        },
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function (e) {
            return "";
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: function (e) {
              return "";
            }
          }
        },
        axisY: {
          prefix: "$",
          tickLength: 0,
          title: "Delta",
        },
        legend: {
          verticalAlign: "top"
        },
        data: [{
          name: "Delta",
          yValueFormatString: "$#,###.##",
          xValueFormatString: "YYYY-MM-DD",
          type: "candlestick",
          dataPoints: this.dataPoints1
        }]
      }, {
        height: 100,
        toolTip: {
          shared: true
        },
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            valueFormatString: "YYYY-MM-DD"
          }
        },
        axisY: {
          prefix: "$",
          tickLength: 0,
          title: "Volume",
          labelFormatter: this.addSymbols
        },
        legend: {
          verticalAlign: "top"
        },
        data: [{
          name: "Volume",
          yValueFormatString: "$#,###.##",
          xValueFormatString: "YYYY-MM-DD",
          dataPoints: this.dataPoints2
        }]
      }],
      navigator: {
        data: [{
          dataPoints: this.dataPoints3
        }],
        slider: {
          minimum: new Date("2019-03-02"),
          maximum: new Date("2021-03-08")
        }
      }
    });
    this.graphLoading = true
    this.getElectromers()
    // $.getJSON("https://canvasjs.com/data/docs/ethusd2018.json", function (data) {
    //   for (var i = 0; i < data.length; i++) {
    //     dataPoints1.push({ x: new Date(data[i].date), y: [Number(data[i].open), Number(data[i].high), Number(data[i].low), Number(data[i].close)] });;
    //     dataPoints2.push({ x: new Date(data[i].date), y: Number(data[i].volume_usd) });
    //     dataPoints3.push({ x: new Date(data[i].date), y: Number(data[i].close) });
    //   }
    //   chart.render();
    // });
  }
  getData() {
    this.initGraph()
  }

  getElectromers() {
    //Get today's date using the JavaScript Date object.

    this.apiResult.loading = true
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.electromers = JSON.parse(JSON.stringify(electromers))
          this.electromers = this.cleanElectromersData()
          var el_id = null
          if (this.electromer == null) { //init data default na posledne 7 dni
            el_id = this.electromers[0].id
            var ourDate = new Date();
            var pastDate = ourDate.getDate() - 3;
            ourDate.setDate(pastDate);
            this.from_date = ourDate
            this.to_date = new Date()
          } else {
            el_id = this.electromer.id
          }
          this.authService.getDataInRange(el_id, this.from_date, this.to_date).subscribe(
            data => {
              this.selectedDataInRange = JSON.parse(JSON.stringify(data));
              this.parseDataInChart()
            },
            error => {
              this.apiResult.error = error
            }
          )
        },
        error => {
          this.apiResult.error = error
        },
        () => {
          this.apiResult.loading = false
        }
      )
  }

  quickSelect(value) {
    switch (value.detail.value) {
      case "last_day": this.selectRecentDays(1)
        break;
      case "last_three": this.selectRecentDays(3)
        break;
      case "last_seven": this.selectRecentDays(7)
        break;
      case "last_ten": this.selectRecentDays(10)
        break;
      case 'default': ''
        break;
    }
  }

  selectRecentDays(lastDays) {
    var ourDate = new Date();
    var pastDate = ourDate.getDate() - lastDays;
    ourDate.setDate(pastDate);
    this.from_date = ourDate
    this.to_date = new Date()
    this.initGraph()
  }

  cleanElectromersData(){
    var clean_array = []
    for (let data of Object.entries(this.electromers)) { //data -> mapa 0 key, 1 value
      if(data[1] != null){
        clean_array.push(data[1])
      }
    }
    return clean_array
    ;
  }

  parseDataInChart() {
    for (let data of Object.entries(this.selectedDataInRange)) { //data -> mapa 0 key, 1 value
      var time = data[1]['time']
      this.dataPoints1.push({ x: new Date(time), y: [Number(data[1]['delta']), Number(data[1]['delta']), Number(data[1]['delta']), Number(data[1]['delta'])] })
      this.dataPoints2.push({ x: new Date(time), y: data[1]['delta'] })
      this.dataPoints3.push({ x: new Date(time), y: data[1]['delta'] })
    }
    this.chart.render()
    this.graphLoading = false
  }
  changeChart() {
    if (this.mySelect == "daily") {
      this.val = false
    } else {
      this.val = true
    }
  }

  ngOnInit() {
    this.initGraph()
    this.user = this.authService.user
  }

}