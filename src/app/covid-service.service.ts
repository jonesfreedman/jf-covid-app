import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryModel } from './CountryModel';
import { Observable } from 'rxjs';
import { CountryDetailsModel } from './CountryDetailsModel';
import { WorldModel } from './WorldModel';
import { ThrowStmt } from '@angular/compiler';
import { IndiaModel } from './IndiaModel';
import { PatientModel } from './PatientModel';
import { NewsModel } from './NewsModel';
import { GlobalTimelineModel } from './GlobalTimelineModel';

@Injectable({
  providedIn: 'root'
})
export class CovidServiceService {
  countryModel: Observable<any>;
  countryDetailsModel: Observable<any>;
  worldModel: Observable<any>;
  patientModel: Observable<any>;
  newsModel: NewsModel;
  globalTimelineModel: GlobalTimelineModel;

  constructor(private http: HttpClient) { }

  getWorldData(): Observable<any> {
    if (this.worldModel) {
      return this.worldModel;
    }
    else {
      return this.http.get<WorldModel>('https://covid-simple-api.now.sh/api/world');
    }
  }

  getGlobalTimeline(): Observable<any> {
    return this.http.get<GlobalTimelineModel>('https://corona-api.com/timeline');
  }

  getCountries(): Observable<any> {
    if (this.countryModel) {
      return this.countryModel;
    }
    else {
      return this.http.get<CountryModel>('https://corona-api.com/countries');
    }
  }

  getTimeline(countryCode: string): Observable<any> {
    if (this.countryDetailsModel) {
      return this.countryDetailsModel;
    }
    else {
      return this.http.get<CountryDetailsModel>('https://corona-api.com/countries/' + countryCode);
    }
  }

  getIndiaData(): Observable<any> {
    return this.http.get<IndiaModel>('https://api.covid19india.org/data.json');
  }

  getPatientData(): Observable<any> {
    if (this.patientModel) {
      return this.patientModel;
    }
    else {
      return this.http.get<PatientModel>('https://api.covid19india.org/raw_data3.json');
    }
  }

  getNews(): Observable<any> {
    var nowDate = new Date();
    var date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    return this.http.get<NewsModel>('https://newsapi.org/v2/top-headlines?country=in&from=' + date + '&category=health&apiKey=c8175126ba384bd9aaf2eaecec62567c');
  }
}
