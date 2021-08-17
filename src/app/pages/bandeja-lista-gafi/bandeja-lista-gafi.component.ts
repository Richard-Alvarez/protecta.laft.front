import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
@Component({
    selector: 'app-bandeja-lista-gafi',
    templateUrl: './bandeja-lista-gafi.component.html',
    styleUrls: ['./bandeja-lista-gafi.component.css']
  }) 
export class BandejaListaGafiComponent implements OnInit{
    countryList: any[] = []
    NIDALERTA: number
    constructor(
        private core: CoreService,
        private userConfigService: UserconfigService
        ) { }

    ngOnInit(){
         this.getCountries();
    }

    async getCountries() {
            this.countryList = await this.userConfigService.getGafiList()
    }
}