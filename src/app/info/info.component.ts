import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryModel } from '../CountryModel';
import { CountryDetailsModel } from '../CountryDetailsModel';
import { CovidServiceService } from '../covid-service.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  @Input() event: any;
  public countryModel: CountryModel;
  public countryDetailsModel: CountryDetailsModel;
  selectCountryName: string;
  countryCode: any;
  confirmed: any;
  recovered: any;
  deaths: any;
  recoveryRate: any;
  recoveryRateOutput: any;
  deathRate: any;
  deathRateOutput: any;
  lastUpdated: any;
  lastUpdatedOutput: any;
  confirmedToday: any;
  deathsToday: any;
  newDeath: any;
  newRecovered: any;
  active: any;
  limit = 14;

  constructor(
    private covidService: CovidServiceService,
  ) { }

  ngOnInit() {
    this.getCoronaCountries();
  }

  getCoronaCountries() {
    this.covidService.getCountries().subscribe(res => {
      this.countryModel = res;
    })
  }

  getData(selectedCountry: any) {
    this.selectCountryName = selectedCountry;
    this.getCountryInfo();
  }

  getCountryInfo() {
    this.countryCode = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.code);
    this.confirmed = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.confirmed);
    this.recovered = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.recovered);
    this.deaths = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.deaths);
    this.recoveryRate = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.calculated.recovery_rate);
    this.recoveryRateOutput = Math.round(this.recoveryRate);
    this.deathRate = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.calculated.death_rate);
    this.deathRateOutput = Math.round(this.deathRate);
    this.lastUpdated = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.updated_at);
    this.lastUpdatedOutput = new Date(this.lastUpdated);
    this.confirmedToday = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.today.confirmed);
    this.deathsToday = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.today.deaths);
    this.active = (this.confirmed - this.recovered - this.deaths);
    this.getTimeline();
    this.getDifference();
  }

  getTimeline() {
    this.covidService.getTimeline(this.countryCode).subscribe(res => {
      this.countryDetailsModel = res;
    })
  }

  getDifference() {
    if (this.countryDetailsModel.data != undefined) {
      var currentDate = formatDate(new Date().setHours(-24), 'yyyy-MM-dd', 'en');
      this.newDeath = this.countryDetailsModel.data.timeline.filter(r => r.date == currentDate).map(r => r.new_deaths);
      this.newRecovered = this.countryDetailsModel.data.timeline.filter(r => r.date == currentDate).map(r => r.new_recovered);
    }
  }
}
