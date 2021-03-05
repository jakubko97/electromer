import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://147.175.106.152:8081/api/';
  
  constructor() { }
}