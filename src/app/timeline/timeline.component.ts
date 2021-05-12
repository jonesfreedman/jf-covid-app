import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CovidServiceService } from '../covid-service.service';
import { CountryDetailsModel } from '../CountryDetailsModel';
import { CountryModel } from '../CountryModel';

@Component({
    selector: 'app-timeline',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

    // @Input() event: any;
    // public countryModel: CountryModel;
    // public countryDetailsModel: CountryDetailsModel;
    // selectCountryName: string;
    // countryCode: any;
    // limit = 14;

    constructor(private covidService: CovidServiceService) { }

    ngOnInit() {
        // this.getCoronaCountries();
    }

    // getCoronaCountries() {
    //     this.covidService.getCountries().subscribe(res => {
    //         this.countryModel = res;
    //     })
    // }

    // getData(selectedCountry: any) {
    //     this.selectCountryName = selectedCountry;
    //     this.getCountryInfo();
    // }

    // getCountryInfo() {
    //     this.countryCode = this.countryModel.data.filter(item => item.name.trim().toLowerCase() == this.selectCountryName.trim().toLowerCase()).map(item => item.code);
    //     this.getTimeline();
    // }

    // getTimeline() {
    //     this.covidService.getTimeline(this.countryCode).subscribe(res => {
    //         this.countryDetailsModel = res;
    //     })
    // }
}
