import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from '../../models/user';
import * as CanvasJS from '../../../assets/canvasjs.stock.min';
import { AppComponent } from 'src/app/app.component';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { LoadingController } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private app: AppComponent,
    public loadingController: LoadingController
  ) {
    this.menu.enable(true);
  }

  @ViewChild('mainChart') mainChart: BaseChartDirective;

  user: User;
  val: any;
  mySelect: any;
  electromer: any;
  from_date: any;
  to_date: any;
  electromers: any;
  selectedDataInRange: any = {}
  dataPoints1 = [];
  dataPoints2 = [];
  dataPoints3 = [];
  mainChartData1 = [];
  mainChartData2 = [];
  mainChartLabels = [];
  chart: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  };

  dailyAverageUsage: any;
  graphLoading = false;
  mainBarChartFromDate: any;
  mainBarChartToDate: any;
  mainChartDataType = 'monthly';

  customPopoverOptions: any = {
    header: 'Electromers',
    subHeader: 'Select data from electromer',
    message: 'Select and confirm to show data'
  };

  loading: any;
  radioModel: string = 'Month';

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: true,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--ion-color-primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: true,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--ion-color-primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: true,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: getStyle('--ion-color-primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';

    // barChart1
    public barChart1Data: Array<any> = [
      {
        data: [],
        label: 'kW',
        barPercentage: 0.5,
      },
      {
        data: [],
        label: 'Avg',
        type: 'line',
        barPercentage: 0.5,
      },
    ];
  public barChart1Labels: Array<any> = []; //days
  public barChart1Options: any = {
    tooltips: {
      enabled: true,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: true,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--ion-color-primary'),
      borderColor: 'rgba(255,255,255,.55)'
    },
    {
      backgroundColor: 'transparent',
      borderColor: getStyle('--ion-color-danger'),
      borderWidth: 1,
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = Object.entries(this.selectedDataInRange).length;
  // public mainChartData1: Array<number> = [];
  // public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current',
      type: 'bar'
    },
    {
      data: this.mainChartData2,
      type: 'line',
      label: 'bar'
    },
    {
      data: this.mainChartData3,
      type: 'line',
      label: 'bar'
    }
  ];
  /* tslint:disable:max-line-length */
  // public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: true,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
           callback: function(value: any) {
             return value;
           }
        },
        type: 'time',
                 time: {
                    unit: this.mainChartDataType === 'monthly' ? 'year' : 'year',
                    displayFormats: {
                      year: 'YYYY'
                  }
                 }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(0.01 / 5),
          max: 25
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      // backgroundColor: hexToRgba(getStyle('--info'), 10),
      backgroundColor: getStyle('--ion-color-primary'),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--ion-color-success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: getStyle('--ion-color-danger'),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public mainChartLegend = true;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  ionViewWillEnter() {
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  toggleMenu(){
      const splitPane = document.querySelector('ion-split-pane')
      if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
          splitPane.classList.toggle('split-pane-visible')
  }
  addSymbols(e) {
    var suffixes = ["", "K"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if (order > suffixes.length - 1)
      order = suffixes.length - 1;
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark';
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


  getMainBarChartData(){
    this.authService.getElectromerColumnData(this.electromer.id, this.mainBarChartFromDate, this.mainBarChartToDate, this.mainChartDataType).subscribe(
      data => {

        let sortedData = null;
        if (this.mainChartDataType === 'yearly'){
          const startYear = new Date(this.mainBarChartFromDate).getFullYear();
          const endYear = new Date(this.mainBarChartToDate).getFullYear();
          sortedData = this.syncYearlyData(Object.entries(data), startYear, endYear);
        }
        if (this.mainChartDataType === 'monthly'){
          const start = new Date(this.mainBarChartFromDate);
          const end = new Date(this.mainBarChartToDate);
          sortedData = this.syncMonthlyData(Object.entries(data), start, end);
        }

        for (const d of sortedData){
          const time = new Date(d.time.toString());
          let xAxis = null;
          if (this.mainChartDataType === 'yearly'){
            xAxis = time.toLocaleString('default', { year: 'numeric' });
          }
          if (this.mainChartDataType === 'monthly'){
            xAxis = time.toLocaleString('default', { month: 'short' });
          }
          this.mainChartData1.push(d.delta);
          this.mainChartLabels.push(xAxis);
        }
      },
      error =>{

      }
    )
  }
  initGraph() {
    let dpsLength = 0;

    this.chart = new CanvasJS.StockChart("chartContainer", {
      theme: this.isThemeDark() ? "dark2" : "light1", // "light1", "light2", "dark2"
      exportEnabled: true,
      animationEnabled: true,
      animationDuration: 800,
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
          prefix: "kW",
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

        }
      }
    });
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

  async getElectromers() {
    //Get today's date using the JavaScript Date object.

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await loading.present();
    return this.authService.getAllElectromers()
      .subscribe(
        electromers => {
          this.electromers = JSON.parse(JSON.stringify(electromers));
          this.electromers = this.cleanElectromersData();
          let el_id = null;
          if (this.electromer == null && this.electromers.length !== 0) { //init data default na posledne 7 dni
            el_id = this.electromers[0].id;
            const ourDate = new Date();
            const pastDate = ourDate.getDate() - 1; //default po nacitani
            ourDate.setDate(pastDate);
            this.from_date = ourDate.toISOString();
            this.to_date = new Date().toISOString();
          } else if(this.electromer != null) {
            el_id = this.electromer.id;
          } else {
            el_id = null;
          }

          if(el_id != null){
            this.getDailyAverageLastWeek(el_id);

            this.authService.getDataInRange(el_id, this.from_date, this.to_date).subscribe(
              async data => {
                this.selectedDataInRange = JSON.parse(JSON.stringify(data));
                this.parseDataInChart();
                await loading.dismiss();
              },
              async error => {
                this.apiResult.error = error;
                await loading.dismiss();
              }
            )
          }
        },
        async error => {
          this.apiResult.error = error;
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        }
      )
  }

  quickSelect(value) {
    switch (value.detail.value) {
      case "last_day": this.selectRecentDays(1)
        break;
      case "last_week": this.selectRecentDays(7)
        break;
      case "last_month": this.selectRecentDays(30)
        break;
      case 'default': ''
        break;
    }
  }

  formatDate(date){
    return new Date(date).toISOString();
  }

  selectRecentDays(lastDays) {
    const ourDate = new Date();
    const pastDate = ourDate.getDate() - lastDays;
    ourDate.setDate(pastDate);
    this.from_date = ourDate.toISOString();
    this.to_date = new Date().toISOString();
    this.dataPoints1 = [];
    this.dataPoints2 = [];
    this.dataPoints3 = [];
    this.mainChartLabels = [];
    this.initGraph();
  }

  cleanElectromersData() {
    const cleanArray = [];
    for (let data of Object.entries(this.electromers)) { //data -> mapa 0 key, 1 value
      if (data[1] != null) {
        cleanArray.push(data[1]);
      }
    }
    return cleanArray;
  }

  parseDataInChart() {
    this.graphLoading = true;
    let sumDelta = 0;
    const length = Object.entries(this.selectedDataInRange).length;
    for (const data of Object.entries(this.selectedDataInRange)) { //data -> mapa 0 key, 1 value
      const time = data[1]['time'];
      this.dataPoints1.push({ x: new Date(time), y: [Number(data[1]['delta']),
      Number(data[1]['delta']), Number(data[1]['delta']), Number(data[1]['delta'])] });
      this.dataPoints2.push({ x: new Date(time), y: data[1]['delta'] })
      this.dataPoints3.push({ x: new Date(time), y: data[1]['delta'] })

      sumDelta += data[1]['delta'];
      // this.mainChartData3.push(this.getRandomArbitrary(0.0010, 0.0042));

  }

    for(let i = 0; i < length; i++){
      this.mainChartData2.push(sumDelta / length);
    }
    this.chart.render();
    this.graphLoading = false;
}

  changeChart() {
    if (this.mySelect == "daily") {
      this.val = false;
    } else {
      this.val = true;
    }
  }

  barChartSegment(e){
    this.mainChartDataType = e.detail.value;
    this.getMainBarChartData();
  }

  createLast7Days () {
    const result = [];
    for (let i = 6; i >= 0; i--) {
        let object =  {
          time: null,
          delta: 0
        }
        object.time = new Date();
        object.time.setDate(object.time.getDate() - i);
        object.delta = 0;
        result.push( (object) );
    }

    return result;
}

createLastYears (num) {
  const result = [];
  for (let i = num; i >= 0; i--) {
      let object =  {
        time: null,
        delta: 0
      }
      object.time = new Date();
      object.time.setDate(object.time.getFullYear() - i);
      console.log(object.time.getFullYear() - i);
      object.delta = 0;
      result.push( (object) );
  }
  return result;
}

syncYearlyData (data, start, end){
  const years = this.yearsRangeFunction(start, end);
  for (const d of years){
    for (const c of data){
      const date = new Date(c[0]).getFullYear();
      if (d.time === date){
        d.delta = c[1].delta;
      }
    }
  }
  return years;
}

syncMonthlyData (data, start, end){
  const months = this.monthsRangeFunction(start, end);
  for (const d of months){
    for (const c of data){
      const date = new Date(c[0]).getFullYear();
      if (d.time === date){
        d.delta = c[1].delta;
      }
    }
  }
  return months;
}

// createLastMonths (num) {
//   const result = [];
//   for (let i = num; i >= 0; i--) {
//       const object =  {
//         time: null,
//         delta: 0
//       }
//       object.time = new Date();
//       object.time.setDate(object.time.getMonth() - i);
//       object.delta = 0;
//       result.push( (object) );
//   }
//   return result;
// }

  syncWeeksHighlights(data){
    const dates = this.createLast7Days();
    for (const d of dates){
      for (const c of data){
        const time = new Date(c[0]);
        if (this.sameDay(d.time, time)){
          d.delta = c[1].delta;
        }
      }
    }
    return dates;
  }

  sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
  getDailyAverageLastWeek(el_id){
    this.authService.getDailyAverageLastWeek(el_id).subscribe(
      data => {
        this.barChart1Data[0].data = [];
        this.barChart1Labels = [];
        this.barChart1Data[1].data = [];
        let avg = 0;
        const finalData = this.syncWeeksHighlights(Object.entries(data));
        for (const d of finalData){
            const delta = d.delta;
            const time = d.time;
            // const dateObj2 = new Date('2021-' + time);
            // time = time.replace(/["']/g, '');
            this.barChart1Data[0].data.push(delta);
            const weekday = time.toLocaleString('default', { weekday: 'short' });
            this.barChart1Labels.push(weekday);
            avg += delta;
        }
        // for(let d of Object.entries(data)) {
        //   if (d[0].charAt(0) !== '0'){
        //     const delta = d[1].delta;
        //     let time = d[0];
        //     time = time.replace(/["']/g, '');
        //     this.barChart1Data[0].data.push(delta);
        //     // const dateObj = new Date('2021-' + time);
        //     const dateObj = new Date();
        //     const pastDate = dateObj.getDate() - days;
        //     dateObj.setDate(pastDate);
        //     const weekday = dateObj.toLocaleString('default', { weekday: 'short' });
        //     this.barChart1Labels.push(weekday);
        //     avg += delta;
        //     days -= 1;
        //   }
        // }
        const length = finalData.length;
        avg = avg / length;
        this.dailyAverageUsage = avg.toFixed(2);
        for (let i = 0; i < length; i++){
          this.barChart1Data[1].data.push(this.dailyAverageUsage);
        }
      },
      error => {

      }
    )
  }
  async ngOnInit() {
    await this.initGraph();
    this.user = this.authService.user;
    var ourDate = new Date();
    var pastDate = ourDate.getMonth() - 12; //default po nacitani
    ourDate.setDate(pastDate);
    this.mainBarChartFromDate = ourDate.toISOString();
    this.mainBarChartToDate = new Date().toISOString();
  }

  downloadMainChart(){
    const a = document.createElement('a');
    a.href = this.mainChart.toBase64Image();
    a.download = 'mainChart.png';
    a.click();
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  yearsRangeFunction(startYear, endYear) {
    const years = [];
    while ( startYear <= endYear ) {
        years.push({ time: startYear++, delta : 0});
    }
    return years;
}
monthsRangeFunction(start, end) {
  const months = [];
  let p = 0;
  while ( p <= 18 ) {
    months.push({ time: end.getMonth() - p, delta : 0});
    p += 1;
  }
  console.log(months);
  return months;
}
}
