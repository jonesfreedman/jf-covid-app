import { Component, OnInit, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryModel } from '../CountryModel';
import { CovidServiceService } from '../covid-service.service';
import { formatDate } from '@angular/common';
import { CountryDetailsModel } from '../CountryDetailsModel';
import * as Highcharts from 'highcharts';
import { TouchSequence } from 'selenium-webdriver';
import { WorldModel } from '../WorldModel';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { IndiaModel } from '../IndiaModel';
import { PatientModel } from '../PatientModel';
import { NewsModel } from '../NewsModel';
import { GlobalTimelineModel } from '../GlobalTimelineModel';
import { Series } from 'highcharts';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit, OnDestroy {

  public countryModel: CountryModel;
  public countryModelBackup: CountryModel;
  public countryDetailsModel: CountryDetailsModel;
  public countryDetailsModelBackup: CountryDetailsModel;
  public patientModel: PatientModel;
  public worldModel: WorldModel;
  public indiaModel: IndiaModel;
  public newsModel: NewsModel;
  public globalTimelineModel: GlobalTimelineModel;
  selectCountryName: string;
  isValid: boolean = false;
  errorMessage: string;
  population: any;
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
  public newDeath: any;
  newRecovered: any;
  active: any;
  limit = 7;
  worldTotalCases: any;
  worldTotalRecovered: any;
  worldTotalDeath: any;
  worldTotalActive: any;

  highcharts = Highcharts;
  chartOptions1: any;
  chartOptions2: any;
  chartOptions3: any;
  chartOptions4: any;
  chartOptions5: any;
  chartOptions6: any;
  chartOptions7: any;
  chartOptions8: any;
  chartOptions9: any;
  chartOptions10: any;

  dateArray: Array<any> = [];
  chartDailyConfirmed: Array<number> = [];
  chartDailyRecovered: Array<number> = [];
  chartDailyDeaths: Array<number> = [];
  indiaStateConfirmed: Array<any> = [];
  indiaStateDeath: Array<any> = [];

  chartCumulativeConfirmed: Array<number> = [];
  chartCumulativeRecovered: Array<number> = [];
  chartCumulativeDeaths: Array<number> = [];

  globalTimelineDate: Array<any> = [];
  globalTimelineConfirmed: Array<number> = [];
  globalTimelineRecovered: Array<number> = [];
  globalTimelineActive: Array<number> = [];
  globalTimelineDeaths: Array<number> = [];

  prevDayConfirmed: any;
  prevDayDeaths: any;

  topTenCountries: any = [];

  constructor(
    private covidService: CovidServiceService,
  ) { }

  ngOnInit() {
    this.getWorldData();
    this.getCoronaCountries();
    this.getIndiaData();
    this.getPatientData();
    this.getNews();
    this.getGlobalTimeline();
  }

  getGlobalTimeline() {
    this.covidService.getGlobalTimeline().subscribe(res => {
      this.globalTimelineModel = res;
      this.GlobalTimeline();
    })
  }

  getWorldData() {
    this.covidService.getWorldData().subscribe(res => {
      this.worldModel = res;
    })
  }

  getCoronaCountries() {
    this.covidService.getCountries().subscribe(res => {
      this.countryModelBackup = res;
      this.getTotal();
    })
  }

  getIndiaData() {
    this.covidService.getIndiaData().subscribe(res => {
      this.indiaModel = res;
    })
  }

  getPatientData() {
    this.covidService.getPatientData().subscribe(res => {
      this.patientModel = res;
    })
  }

  getNews() {
    this.covidService.getNews().subscribe(res => {
      this.newsModel = res;
    })
  }

  getTotal() {
    // this.worldTotalCases = this.countryModelBackup.data.map(r => r.latest_data.confirmed).reduce((sum, current) => sum + current).toLocaleString();
    this.worldTotalRecovered = this.countryModelBackup.data.map(r => r.latest_data.recovered).reduce((sum, current) => sum + current).toLocaleString();
    this.worldTotalDeath = this.countryModelBackup.data.map(r => r.latest_data.deaths).reduce((sum, current) => sum + current).toLocaleString();
    var topTen = this.countryModelBackup.data.map(r => r.latest_data.confirmed).sort((one, two) => (one > two ? -1 : 1)).slice(0, 10);
    for (let mi = 0; mi < topTen.length; mi++) {
      this.topTenCountries.push(this.countryModelBackup.data.filter(item => item.latest_data.confirmed == topTen[mi]).map(item => item));
    }
  }

  GlobalTimeline() {
    this.worldTotalCases = this.globalTimelineModel.data[0].confirmed.toLocaleString();
    this.worldTotalRecovered = this.globalTimelineModel.data[0].recovered.toLocaleString();
    this.worldTotalActive = this.globalTimelineModel.data[0].active.toLocaleString();
    this.worldTotalDeath = this.globalTimelineModel.data[0].deaths.toLocaleString();
    for (let mi = 0; mi < 7; mi++) {
      this.globalTimelineDate.push(new Date(this.globalTimelineModel.data[mi].date).getUTCDate() + "/" + (new Date(this.globalTimelineModel.data[mi].date).getUTCMonth() + 1));
      this.globalTimelineConfirmed.push(+this.globalTimelineModel.data[mi].confirmed);
      this.globalTimelineRecovered.push(+this.globalTimelineModel.data[mi].recovered);
      this.globalTimelineActive.push(+this.globalTimelineModel.data[mi].active);
      this.globalTimelineDeaths.push(+this.globalTimelineModel.data[mi].deaths);
    }
    this.globalTimelineCharts();
  }

  selectedCountryDropDown(country: any) {
    this.selectCountryName = country.target.innerText;
    this.countryModel = undefined;
    this.countryModel = this.countryModelBackup;
    this.isValid = true;
    this.getCountryInfo();
  }

  selectedCountryButton(country: any) {
    if (country != undefined) {
      this.selectCountryName = country;
      this.countryModel = null;
      this.countryModel = this.countryModelBackup;
      if (this.validCountry()) {
        this.isValid = true;
        this.getCountryInfo();
      }
      else {
        this.isValid = false;
        this.errorMessage = "Country not found.";
      }
    }
  }

  validCountry(): boolean {
    this.isValid = false;
    var countryFound = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).length;
    return countryFound > 0 ? true : false;
  }

  getCountryInfo() {
    var code = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.code);
    this.population = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.population);
    this.countryCode = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.code);
    this.getTimeline(this.countryCode);
    this.confirmed = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.confirmed.toLocaleString());
    this.recovered = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.recovered.toLocaleString());
    this.deaths = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.deaths.toLocaleString());
    this.recoveryRate = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.calculated.recovery_rate);
    this.recoveryRateOutput = Math.round(this.recoveryRate);
    this.deathRate = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.calculated.death_rate);
    this.deathRateOutput = Math.round(this.deathRate);
    this.lastUpdated = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.updated_at);
    this.lastUpdatedOutput = new Date(this.lastUpdated);
    var confirmedForActive = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.confirmed);
    var recoveredForActive = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.recovered);
    var deathsForActive = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.latest_data.deaths);
    this.active = (confirmedForActive[0] - recoveredForActive[0] - deathsForActive[0]).toLocaleString();
    this.chartOptionsFunction();
  }

  // clearData() {
  //   this.dateArray = undefined;
  //   this.chartConfirmed = undefined;
  //   this.chartRecovered = undefined;
  //   this.chartDeaths = undefined;
  // }

  ngOnDestroy() {
    this.countryModel = undefined;
    this.selectCountryName = undefined;
    this.population = undefined;
    this.errorMessage = undefined;
    this.isValid = undefined;

  }

  getTimeline(code: string) {
    this.countryCode = code;
    this.countryDetailsModel = undefined;
    this.countryDetailsModel = this.countryDetailsModelBackup;
    var currentDate = formatDate(new Date().setHours(-12), 'yyyy-MM-dd', 'en');
    this.covidService.getTimeline(this.countryCode).subscribe(async (res: CountryDetailsModel) => {
      this.countryDetailsModel = res;
      this.confirmedToday = (this.countryDetailsModel.data.timeline[0].new_confirmed.toLocaleString());
      this.newRecovered = (this.countryDetailsModel.data.timeline[0].new_recovered.toLocaleString());
      this.newDeath = (this.countryDetailsModel.data.timeline[0].new_deaths.toLocaleString());

      this.prevDayConfirmed = Math.round((this.countryDetailsModel.data.timeline[0].new_confirmed) - (this.countryDetailsModel.data.timeline[1].new_confirmed));

      this.dateArray = [];
      this.chartDailyConfirmed = [];
      this.chartDailyRecovered = [];
      this.chartDailyDeaths = [];
      this.chartCumulativeConfirmed = [];
      this.chartCumulativeRecovered = [];
      this.chartCumulativeDeaths = [];
      this.indiaStateConfirmed = [];
      this.indiaStateDeath = [];

      for (let mi = 0; mi < this.limit; mi++) {
        this.dateArray.push(new Date(res.data.timeline[mi].date).getUTCDate() + "/" + (new Date(res.data.timeline[mi].date).getUTCMonth() + 1));
        //daily
        this.chartDailyConfirmed.push((res.data.timeline[mi].new_confirmed));
        this.chartDailyRecovered.push((res.data.timeline[mi].new_recovered));
        this.chartDailyDeaths.push((res.data.timeline[mi].new_deaths));
        //cumulative
        this.chartCumulativeConfirmed.push((res.data.timeline[mi].confirmed));
        this.chartCumulativeRecovered.push((res.data.timeline[mi].recovered));
        this.chartCumulativeDeaths.push((res.data.timeline[mi].deaths));
      }
      this.chartOptionsFunction();

      for (let mi = 0; mi < 11; mi++) {
        if (this.indiaModel.statewise[mi].state != 'Total') {
          this.indiaStateConfirmed.push([this.indiaModel.statewise[mi].state, +this.indiaModel.statewise[mi].confirmed]);
          this.indiaStateDeath.push([this.indiaModel.statewise[mi].state, +this.indiaModel.statewise[mi].deaths]);
        }
      }
    })
  }

  chartOptionsFunction() {
    this.chartOptions1 = {
      chart: {
        type: "column",
        backgroundColor: '#0c0c0e',
      },
      title: {
        text: "",
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: this.dateArray,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Confirmed',
          data: this.chartCumulativeConfirmed,
          color: 'rgba(255, 7, 58, 0.77)',
        },
        {
          name: 'Recovered',
          data: this.chartCumulativeRecovered,
          color: '#1e7e34e3',
        },
        {
          name: 'Deaths',
          data: this.chartCumulativeDeaths,
          color: '#6c757db5',
        },
      ]
    };

    this.chartOptions2 = {
      updateFlag: true,
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "",
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: this.dateArray,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Confirmed',
          data: this.chartDailyConfirmed,
          color: 'rgba(255, 7, 58, 0.77)',
        },
      ]
    };

    this.chartOptions3 = {
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "",
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: this.dateArray,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Recovered',
          data: this.chartDailyRecovered,
          color: '#1e7e34e3',
        },
      ]
    };

    this.chartOptions4 = {
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "",
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: this.dateArray,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ""
      },
      series: [
        {
          name: 'Deaths',
          data: this.chartDailyDeaths,
          color: '#6c757db5',
        },
      ]
    };

    this.chartOptions5 = {
      chart: {
        type: "column",
        backgroundColor: '#0c0c0e',
      },
      title: {
        text: "10",
      },
      subtitle: {
        text: "Most Affected States"
      },
      xAxis: {
        categories: null,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ""
      },
      series: [
        {
          name: "Confirmed",
          data: this.indiaStateConfirmed,
          color: 'rgba(255, 7, 58, 0.77)',
        },
      ],
    };

    this.chartOptions6 = {
      chart: {
        type: "column",
        backgroundColor: '#0c0c0e',
      },
      title: {
        text: "10",
      },
      subtitle: {
        text: "Most Affected States"
      },
      xAxis: {
        categories: null,
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ""
      },
      series: [
        {
          name: "Deceased",
          data: this.indiaStateDeath,
          color: '#6c757db5',
        },
      ],
    };
  }

  globalTimelineCharts() {
    this.chartOptions7 = {
      chart: {
        backgroundColor: '#0c0c0e',
        type: 'spline',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "Cases",
      },
      subtitle: {
        text: this.worldTotalCases,
      },
      xAxis: {
        lineColor: 'transparent',
        categories: this.globalTimelineDate,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        },
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Confirmed',
          data: this.globalTimelineConfirmed,
          color: 'rgba(255, 7, 58, 0.77)',
          borderColor: 'rgba(255, 7, 58, 0.77)',
        },
      ]
    };

    this.chartOptions8 = {
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "Recovered",
      },
      subtitle: {
        text: this.worldTotalRecovered,
      },
      xAxis: {
        lineColor: 'transparent',
        categories: this.globalTimelineDate,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        },
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Recovered',
          data: this.globalTimelineRecovered,
          color: '#1e7e34e3',
          borderColor: '#1e7e34e3',
        },
      ]
    };

    this.chartOptions9 = {
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "Active",
      },
      subtitle: {
        text: this.worldTotalActive,
      },
      xAxis: {
        lineColor: 'transparent',
        categories: this.globalTimelineDate,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        },
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Active',
          data: this.globalTimelineActive,
          color: 'dodgerblue',
          borderColor: 'dodgerblue',
        },
      ]
    };

    this.chartOptions10 = {
      chart: {
        type: "spline",
        backgroundColor: '#0c0c0e',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },
        }
      },
      title: {
        text: "Deaths",
      },
      subtitle: {
        text: this.worldTotalDeath,
      },
      xAxis: {
        lineColor: 'transparent',
        categories: this.globalTimelineDate,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: {
          text: ""
        },
        labels: {
          enabled: false
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      credits: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Deaths',
          data: this.globalTimelineDeaths,
          color: 'dimgray',
          borderColor: 'dimgray',
        },
      ]
    };
  }
}
