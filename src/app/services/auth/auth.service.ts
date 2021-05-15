import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from '../env/env.service';
import { User } from '../../models/user';
import { Request } from '../../models/request';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false
  token: any;
  user: User;
  isAdmin: any;

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
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'auth/logout', { headers: headers })
      .pipe(
        tap(data => {
          this.storage.remove('token');
          this.isLoggedIn = false;
          delete this.user
          this.isAdmin = false
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
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
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
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
      .pipe(
        tap(user => {
          this.isAdmin = (user.is_admin == 1 || user.is_superadmin) ? true : false
          return this.isAdmin;
        })
      )
  }
  getAll() {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'api/users', { headers: headers })
      .pipe(
        tap(users => {
          return users;
        })
      )
  }
  getAdmins() {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'api/admins', { headers: headers })
      .pipe(
        tap(admins => {
          return admins;
        })
      )
  }
  assignUserToAdmin(userId, adminIdd) {
    const payload = {
      id: userId,
      admin_id: adminIdd
    }
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/users', payload, { headers: headers })
      .pipe(
        tap(admins => {
          return admins;
        })
      )
  }
  assignAdminRights(user_id) {
    const payload = {
      id: user_id,
      is_admin: 1
    }
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/users', payload ,{ headers: headers })
      .pipe(
        tap(response => {
          return response;
        })
      )
  }
  editUser(user) {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/users', user, { headers: headers })
      .pipe(
        tap(response => {
          return response;
        })
      )
  }
  getAllElectromers() {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'api/electromers', { headers: headers })
      .pipe(
        tap(electromers => {
          return electromers;
        })
      )
  }
  assignElectromerToUser(electromerId: number, userId: number) {
    const payload = {
      user_id: userId,
      electromer_id: electromerId
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/user', payload, { headers: headers })
  }
  addElectromer(electromer: any) {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromers', electromer, { headers: headers })
  }
  getDataInRange(id: number, from: Date, to: Date) {
    const payload = {
      electromer_id: id,
      date_from: from,
      date_to: to
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/data', payload, { headers: headers }
    )
  }
  getElectromerById(id) {
    const payload = {
      electromer_id: id
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/', payload, { headers: headers })
  }
  getAllRequests() {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'api/requests', { headers: headers })
  }
  postRequest(request: any) {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/requests', request, { headers: headers })
  }
  downloadFile(fileId) {
    const payload = {
      id: fileId,
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/file/download', payload, { headers: headers, responseType: 'blob' })
  }
  getDailyAverageLastWeek(id) {
    const payload = {
      electromer_id: id,
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/week/data', payload, { headers: headers })
  }
  getLogs() {
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.get(this.env.API_URL + 'api/logs', { headers: headers })
  }
  getElectromerColumnData(id, fromDate, toDate, dataType) {
    const payload = {
      electromer_id: id,
      from_date: fromDate,
      to_date: toDate,
      type: dataType
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/column/data', payload, { headers: headers })
  }
  getDailyTrend(id) {
    const payload = {
      electromer_id: id
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/electromer/daily/trend', payload, { headers: headers })
  }

  downloadCSV(id, from, to) {
    const payload = {
      electromer_id: id,
      from_date: from,
      to_date: to
    };
    const headers = new HttpHeaders({
      'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
    return this.http.post(this.env.API_URL + 'api/download/csv', payload, { headers: headers })
  }
}