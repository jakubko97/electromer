import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Electromer } from 'src/app/models/electromer';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-electromer',
  templateUrl: './add-electromer.page.html',
  styleUrls: ['./add-electromer.page.scss'],
})
export class AddElectromerPage implements OnInit {

  electromer = {
    id: null,
    name: null,
    db_table: null,
    delta: null,
    type: null
  }

  apiResult = {
    loading: false,
    error: '',
    info: ''
  }

  constructor(
    public modalCtrl: ModalController,
    public authService: AuthService,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
  }
  electromerEdit: Electromer = this.navParams.get('electromer');

  ngOnInit() {
    // this.electromer = this.formBuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(2)]],
    //   db_table: ['', [Validators.required]],
    //   delta: [null],
    //   type: ['', [Validators.required]]
    // })
  }

  addElectromer(form: NgForm) {
    this.apiResult.loading = true
    this.electromer.name = form.value.name
    this.electromer.db_table = form.value.db_table
    this.electromer.delta = form.value.delta
    this.electromer.type = form.value.type

    if(!form.invalid){
      this.authService.addElectromer(this.electromer).subscribe(
        data => {
          this.apiResult.loading = false
          this.modalCtrl.dismiss();
        },
        error => {
          console.log(error)
          this.apiResult.error = 'An unexpected error occurred.'
          this.apiResult.loading = false
        }
      )
    }else{
      this.apiResult.error = 'Saving electromer failed. Please check input data.'
      this.apiResult.loading = false
    }

  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }
}
