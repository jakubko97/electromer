import { Component, OnInit } from '@angular/core';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  logs: any;
  temp: any;
  apiResult = {
    loading: false,
    error: '',
    info: ''
  };
  theme: any;

  constructor(
    private authService: AuthService,
  ) { }

  isThemeDark(){
    return document.body.getAttribute('color-theme') === 'dark';
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
  const val = event.target.value.toLowerCase();
  // filter our data
  const temp = this.temp.filter(function (d) {
    return (d.description.toLowerCase().indexOf(val) !== -1 || !val) || (d.type.toLowerCase().indexOf(val) !== -1 || !val) || (d.created_at.toLowerCase().indexOf(val) !== -1 || !val);
  });

  // update the rows
  this.logs = temp;
  // Whenever the filter changes, always go back to the first page
  // this.table.offset = 0;
}

}
