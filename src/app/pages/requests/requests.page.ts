import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  user: User;
  requests: any;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) { }

  requestForm: FormGroup;

  request = {
    subject: null,
    type: null,
    body: null
  }

  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  ngOnInit() {
    this.getRequests()
    this.user = this.authService.user;
    this.requestForm = this.formBuilder.group({
      subject: ['', Validators.required],
      type: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  submit() { //form NgForm

    if(this.requestForm.valid){
      this.apiResult.loading = true;
      this.request.subject = this.requestForm.value.subject;
      this.request.type = this.requestForm.value.type;
      this.request.body = this.requestForm.value.body;
      this.authService.createRequest(this.request).subscribe(
        data => {
        },
        error => {
          this.apiResult.error = 'Error occured during sending to server';
          this.apiResult.loading = false;
        },
        () => {
          console.log('completed');
          this.apiResult.loading = false;
        }
      )
    }else{
      this.apiResult.error = 'All fields are required!';
    }

  }

  public getRequests() {
    this.apiResult.loading = true;
    return this.authService.getAllRequests()
      .subscribe(
        requests => {
          this.requests = requests;
        },
        error => {
          this.apiResult.error = 'Error occured while fetching data from server.';
          this.apiResult.loading = false;
        },
        () => {
          this.apiResult.loading = false;
        }
      )
  }

}
