import { AuthService } from 'src/app/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { Electromer } from '../../models/electromer';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ElectromerService {
    constructor(
        private http: HttpClient,
        private env: EnvService,
        private authService: AuthService

    ) {

    }

    getAll() {
        const headers = new HttpHeaders({
            'Authorization': this.authService.token["token_type"] + " " + this.authService.token["access_token"]
        });
        return this.http.get<Electromer>(this.env.API_URL + 'api/electromers', { headers: headers })
            .pipe(
                tap(electromers => {
                    return electromers;
                })
            )
    }

    addElectromer(user_id: String, electromer_id: String) {

        return this.http.post(this.env.API_URL + 'add/electromer/user',
            { id: user_id, electromer_id: electromer_id }
        )
    }

}