import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { User } from '../../models/user';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private http: HttpClient,
        private env: EnvService,
        private storage: NativeStorage,
        private authService: AuthService

    ) { }

    user() {
        const headers = new HttpHeaders({
            'Authorization': this.authService.token["token_type"] + " " + this.authService.token["access_token"]
        });
        return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
            .pipe(
                tap(user => {
                    return user;
                })
            )
    }
    isUserAdmin() {
        const headers = new HttpHeaders({
            'Authorization': this.authService.token["token_type"] + " " + this.authService.token["access_token"]
        });
        return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
            .pipe(
                tap(user => {
                    return user.is_admin == 1;
                })
            )
    }
    getAll() {
        const headers = new HttpHeaders({
            'Authorization': this.authService.token["token_type"] + " " + this.authService.token["access_token"]
        });
        return this.http.get(this.env.API_URL + 'api/users', { headers: headers })
            .pipe(
                tap(users => {
                    return users;
                })
            )
    }
}