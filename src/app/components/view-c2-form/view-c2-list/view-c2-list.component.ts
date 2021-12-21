import {Component, OnInit, Input, AfterViewInit } from '@angular/core'
import { ElementContainer } from 'html2canvas/dist/types/dom/element-container'
import { isNullOrUndefined } from 'util'

@Component({
    selector: 'app-view-c2-list',
    templateUrl: './view-c2-list.component.html',
    styleUrls: ['./view-c2-list.component.css']
})
export class ViewC2ListComponent implements  OnInit  ,AfterViewInit {
countView = 0
@Input() linkactual 
@Input() parent 
@Input() lista : any = []
@Input() arrayClientesByList : any = []
@Input() acordion 
@Input() accordionSubGrup 
@Input() subgruponame
    ngOnInit(){
        this.countView = 0; 
    }
    ngAfterViewInit() {
        this.showAfterPosition()
    }
    getClientsByListArr(lista){
        let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPositionReturn"))
        let resp
        if( this.linkactual == "proveedor" || this.linkactual == "contraparte" || this.linkactual == "historico-proveedor" || this.linkactual == "historico-contraparte"){
             resp = this.arrayClientesByList.filter(cli => cli.SDESTIPOLISTA == lista.SDESTIPOLISTA &&
                 cli.NIDPROVEEDOR == lista.NIDPROVEEDOR && 
                 cli.NIDSUBGRUPOSEN == lista.NIDSUBGRUPOSEN )
        }else{
             resp = this.arrayClientesByList.filter(cli => cli.SDESTIPOLISTA == lista.SDESTIPOLISTA && cli.NIDPROVEEDOR == lista.NIDPROVEEDOR )
        }
        
        
        let arrDuplid = []
        let arrRespuesta = []
        resp.forEach(itemRes => {
            let respDuplid = arrDuplid.filter(duplid => duplid == itemRes.SNOM_COMPLETO)

            if (respDuplid.length  == 0) {
                arrRespuesta.push(itemRes)
                arrDuplid.push(itemRes.SNOM_COMPLETO)
            }
        })
        
        return arrRespuesta
    }
    showAfterPosition(){
        let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPositionReturn"))
        if(respObjFocusPosition && respObjFocusPosition.NIDALERTA){
            if(respObjFocusPosition.NIDALERTA == 2)
                if(respObjFocusPosition.regimen.id == 2){
                    let tabGnral = document.getElementById("Gral"); 
                    let tabSimpl = document.getElementById("Simpli"); 
                    if(tabGnral != null)
                        tabGnral.classList.remove("active")
                    if(tabSimpl != null)
                        tabSimpl.classList.add("active");
                    let divGnral = document.getElementById("regGral"); 
                    let divSimpl = document.getElementById("regSimpli"); 
                    if(divGnral != null)
                        divGnral.classList.remove("active")
                    if(divSimpl != null)
                        divSimpl.classList.add("active");
                
                    }
                let cadenaContentUsers = respObjFocusPosition.elementoPadre
                let boton = respObjFocusPosition.NIDBOTON
        }
    }
    focus (idObj){
        let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPositionReturn"))
        if(!isNullOrUndefined(respObjFocusPosition))
            if(idObj == respObjFocusPosition.NIDBOTON){
                let elemt = document.getElementById(idObj)
                if(elemt != null){
                    if(this.countView == 0)
                        elemt.focus({ preventScroll : false})
                    this.countView = this.countView + 1;
                }
            }
        return true
    }
}