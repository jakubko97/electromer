import { Component, OnInit } from '@angular/core';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { LensOutlined } from '@material-ui/icons';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  filterOption = null;
  searchOptions = [
    {
      text: 'all',
      value: null
    },
    {
      text: 'auth',
      value: 1
    },
    {
      text: 'electromer',
      value: 2
    },
    {
      text: 'request',
      value: 3
    },
    {
      text: 'file',
      value: 4
    }
  ];

  logs: any;
  temp: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  };
  theme: any;

  customPopoverOptions: any = {
    header: 'Type'
  };

  constructor(
    private authService: AuthService,
  ) { }

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark';
  }

  formateDate(date){
    return new Date(date);
  }
  initLogs(){
    this.apiResult.loading = true;
    this.authService.getLogs().subscribe(
      data => {
        this.logs = this.temp = data;
        this.apiResult.loading = false;
      },
      error => {
        this.apiResult.error = error;
        this.apiResult.loading = false;
      }
    )
  }
  ngOnInit() {
    this.theme = this.isThemeDark() ? "dark" : "material";
    this.initLogs();
  }

  toggleMenu(){
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
        splitPane.classList.toggle('split-pane-visible')
}

updateFilter(event) {
  let val = null;
  if (event.target){
    val = event.target.value.toLowerCase();
  } else{
    val = event.toLowerCase();
  }
  // filter our data

  let temp = null;
  if (this.filterOption == null){
     temp = this.temp.filter(function (d) {
      return ((d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
      || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val));
    });
  }else if(this.filterOption === 1){
    temp = this.temp.filter(function (d) {
      return ((d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
      || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val)) && d.type === 'auth';
    });
  }
  else if(this.filterOption === 2){
    temp = this.temp.filter(function (d) {
      return ((d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
      || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val)) && d.type === 'electromer';
    });
  }
  else if(this.filterOption === 3){
    temp = this.temp.filter(function (d) {
      return ((d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
      || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val)) && d.type === 'request';
    });
  }
  else if(this.filterOption === 4){
    temp = this.temp.filter(function (d) {
      return ((d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val)
      || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val)) && d.type === 'file';
    });
  }


  // update the rows
  this.logs = temp;
  // Whenever the filter changes, always go back to the first page
  // this.table.offset = 0;
}

}
