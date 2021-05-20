import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-add-electromer',
  templateUrl: './add-electromer.page.html',
  styleUrls: ['./add-electromer.page.scss'],
})
export class AddElectromerPage implements OnInit {

  electromerForm: FormGroup;
  isAddMode: boolean;
  id: string;

  constructor(
    public modalCtrl: ModalController,
    public authService: AuthService,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertService: AlertService
  ) {
  }

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

  electromerEdit: any

  ngOnInit() {
    this.electromerEdit = this.navParams.get('electromer');

    this.isAddMode = !this.electromerEdit;
    if (!this.isAddMode) {
      this.electromerForm = this.formBuilder.group({
        name: [this.electromerEdit.name, Validators.required],
        db_table: [this.electromerEdit.db_table, Validators.required],
        delta: [this.electromerEdit.delta, Validators.required],
        type: [this.electromerEdit.type, [Validators.required]],
      });
    }else{
      this.electromerForm = this.formBuilder.group({
        name: ['', Validators.required],
        db_table: ['', Validators.required],
        delta: ['', Validators.required],
        type: ['', [Validators.required]],
      });
    }

    //   if (!this.isAddMode) {
    //     this.authService.getElectromerById(this.id).subscribe(
    //       data => {
    //         this.electromerForm.patchValue(data)
    //       }
    //       );
    // }
  }

  // convenience getter for easy access to form fields
  get f() { return this.electromerForm.controls; }

  addElectromer() { //form NgForm
    this.apiResult.loading = true;
    this.electromer.name = this.electromerForm.value.name;
    this.electromer.db_table = this.electromerForm.value.db_table;
    this.electromer.delta = this.electromerForm.value.delta;
    this.electromer.type = this.electromerForm.value.type;

    if (!this.electromerForm.invalid) {
        this.createElectromer();
    } else {
      this.apiResult.error = 'Saving electromer failed. Please check input data.';
      this.apiResult.loading = false;
    }
  }

  createElectromer() {
    this.authService.addElectromer(this.electromer).subscribe(
      data => {
        this.apiResult.loading = false;
        this.modalCtrl.dismiss();
        this.alertService.presentToast('Electromer ' + this.electromerForm.value.name + ' was successfully saved.');
      },
      error => {
        console.log(error)
        this.apiResult.error = 'An unexpected error occurred.';
        this.apiResult.loading = false;
      }
    )
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss();
  }
}
