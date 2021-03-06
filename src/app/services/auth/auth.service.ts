import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from '../env/env.service';
import { User } from '../../models/user';
import { Electromer } from '../../models/electromer';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false
  token: any
  user: User
  isAdmin: any

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
  ) { }

  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/login',
      { email: email, password: password }
    ).pipe(
      tap(token => {
        this.storage.setItem('token', token)
          .then(
            () => {
              console.log('Token Stored');
            },
            error => console.error('Error storing item', error)
          );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );
  }

  register(name: String, email: String, password: String, password_confirmation: String) {

    return this.http.post(this.env.API_URL + 'auth/signup ',
      { name: name, email: email, password: password, password_confirmation: password_confirmation }
    )
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });

    return this.http.get(this.env.API_URL + 'auth/logout', { headers: headers })
      .pipe(
        tap(data => {
          this.storage.remove("token");
          this.isLoggedIn = false;
          delete this.token;
          return data;
        })
      )
  }
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;

        if (this.token != null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }

  getUser() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
      .pipe(
        tap(user => {
          this.user = user
          return user;
        })
      )
  }
  isUserAdmin() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
      .pipe(
        tap(user => {
          this.isAdmin = user.is_admin == 1 ? true : false
          return this.isAdmin;
        })
      )
  }
  getAll() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get(this.env.API_URL + 'api/users', { headers: headers })
      .pipe(
        tap(users => {
          return users;
        })
      )
  }
  getAllElectromers() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get<Electromer>(this.env.API_URL + 'api/electromers', { headers: headers })
      .pipe(
        tap(electromers => {
          return electromers;
        })
      )
  }
  addElectromer(user_id: String, electromer_id: String) {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.post(this.env.API_URL + 'add/electromer/user',
      { id: user_id, electromer_id: electromer_id }
    )
  }
}