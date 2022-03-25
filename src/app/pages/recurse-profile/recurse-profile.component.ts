import { OnInit,Input, Component} from "@angular/core";
import { FormsModule} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { UserconfigService } from 'src/app/services/userconfig.service';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-recurse-profile',
    templateUrl: './recurse-profile.component.html',
    styleUrls: ['./recurse-profile.component.css'],
    providers: [NgxSpinnerService]
  })
export class RecurseProfile implements OnInit {
    arrayRecurse :any= [];
    arrayProfile :any= [];
    arrayCabecera :any= [];
    parameters :any= {};
    arrayRequestParameters :any= [];
    arrayResponseProfile :any= [];
    arrayResponseHistory :any= [];
    public profiles: any = 0;
    constructor(
        private spinner: NgxSpinnerService,
        private userconfigService :UserconfigService,
        private excelService: ExcelService,
    ){

    }

    async ngOnInit(){
        this.parameters = {};
        this.spinner.show()
        
        await this.setArrayCabecera();
        await this.search(this.parameters);
        await this.searchHistory(this.profiles);
        // this.textCabecera()
        this.spinner.hide()
    }
    async getArrayResourceProfile (){
        this.parameters = {};
        this.spinner.show()
        await this.search(this.parameters);
        await this.searchHistory(this.profiles);
        this.spinner.hide()
    }
    async setArrayCabecera(){
        this.arrayResponseProfile = await this.userconfigService.getProfileList()
        // this.arrayCabecera.push("Menú","Submenú");
        this.arrayCabecera = this.arrayCabecera.concat(this.arrayResponseProfile .map(t=>t.profileName));
    }

    async search (parameters){
        let response = await this.userconfigService.getListaRecurseProfile(parameters);
        response = response.filter((t,i,array)=>{
                            t.arrayIdProfile = array.filter(t2=> t2.nIdResource == t.nIdResource && t2.nIdFather == t.nIdFather )
                            return array.map(m=> m.nIdResource + "," + m.nIdFather ).indexOf(t.nIdResource + "," + t.nIdFather) === i ;
                        });
        response.forEach(t => {
            t.profile = []
            this.arrayResponseProfile.forEach(p => {
                let res = {
                    isChecked : t.arrayIdProfile.map(t=> t.nIdProfile).includes(p.profileId),
                    sProfileName : p.profileName,
                    sMenu : t.sNameMenu,
                    sSubMenu : t.sNameSubMenu,
                    nResourceName : (t.sNameSubMenu == "" ? t.sNameMenu : t.sNameSubMenu),
                    nIdResource : t.nIdResource,
                    nIdProfile : p.profileId,
                    nIdFather : t.nIdFather
                }
                t.profile.push(res)
            });
        });
        response.sort((a,b)=>{return a.nIdResource - b.nIdResource})
        this.arrayRecurse = response;
    }
    async searchHistory (idProfile){
        let data ={
            nIdProfile : Number.parseInt(idProfile)
        }
        this.arrayResponseHistory = await this.userconfigService.getListaRecurseProfileHistory(data);
    }
    onChange (item){
        var item2 = this.arrayRequestParameters.filter(t=> t.nIdResource == item.nIdResource && t.nIdProfile == item.nIdProfile  && t.nIdFather == item.nIdFather )
        if(item2.length  == 0)
            this.arrayRequestParameters.push(item);
        else {
            this.arrayRequestParameters = this.arrayRequestParameters.filter((t,i,array)=>{ 
                return array.indexOf(item) != i
            });
        }
    }
    getExcel(){
        let dataprepare = [];
        if(this.arrayRecurse.length > 0){
            this.arrayRecurse.forEach(t => {
                let obj = {
                    menu : t.sNameMenu ,
                    submenu :t.sNameSubMenu 
                }
                t.profile.forEach(t2 => {
                    obj[t2.sProfileName] = (t2.isChecked ? "SI" :"NO")
                });
                dataprepare.push(obj);
            });
            this.excelService.exportAsExcelFile(dataprepare,"Registros de recursos y perfiles");
        }
        else
        swal.fire({
            title: 'Descarga de datos de los prefiles',
            icon: 'warning',
            text: 'No se encontraron elementos',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
                closeButton : 'OcultarBorde'
                             },
               
          }).then((result) => {
          })
    }
    save(){
        if(this.arrayRequestParameters.length > 0)
            swal.fire({
                title: 'Señal de alerta',
                text: "¿Desea actualizar la información modificada?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FA7000',
                cancelButtonColor: 'gray',
                //confirmButtonText: 'Guardar',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                showCloseButton: true,
                customClass: { 
                    closeButton : 'OcultarBorde'
                                 },
                   
            }).then(async (result) => {
                if(result.value){
                    let oRequets = {};
                    let usuario = JSON.parse(sessionStorage.getItem("usuario"))
                    oRequets = {
                        nIdUser : usuario.idUsuario,
                        nIdProfile : usuario.idPerfil,
                        items : JSON.stringify(this.arrayRequestParameters)
                    }
                    await this.userconfigService.updateResourceProfile(oRequets);
                    await this.getArrayResourceProfile();
                    this.arrayRequestParameters = [];
                }
                
            });
        else 
        swal.fire({
            title: 'Opciones por perfil',
            icon: 'warning',
            text: 'Debe seleccionar un perfil',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
                closeButton : 'OcultarBorde'
                             },
               
          }).then((result) => {
          })
    }
    changeProfile() {
        if (this.profiles !== '') {
          this.searchHistory(this.profiles);
        }
    }
    getExcelHistory(){
        if (this.arrayResponseHistory.length > 0){
            let data = []
            this.arrayResponseHistory.forEach(t => {
                // let _data = {
                //     "Menu" : t.sMenu,
                //     "SubMenu" : t.sSubMenu,
                //     "Usuario responsable" : t.sUsuarioName,
                //     "Perfil" : t.sProfileName,
                //     "Acción realizada" : t.sAccion,
                //     "Fecha y hora de configuración" : t.dFechaRegistro
                // }
                let _data = {
                    "Perfil modificado" : t.sProfileName,
                    "Opción modificada" : t.sOpcion,
                    "Acción realizada" : t.sAccion,
                    "Fecha y hora de configuración" : t.dFechaRegistro,
                    "Usuario responsable" : t.sUsuarioName
                }
                data.push(_data);
            });
            this.excelService.exportAsExcelFile(data,"Registros del historial de recursos y perfiles"); 
        }
        else
        swal.fire({
            title: 'Historial de Configuración',
            icon: 'warning',
            text: 'Debe seleccionar un perfil',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
                closeButton : 'OcultarBorde'
                             },
               
          }).then((result) => {
          })
    }

    textCabecera(index){
     
    

       if(this.arrayCabecera[0]=="Menú" || this.arrayCabecera[1]=="Submenú"){
            return 'text-left'
       }else if(this.arrayCabecera.name=="Menú" || this.arrayCabecera.name=="Submenú"){
        return 'text-left'
       }
      else{
           return 'text-center'
          
       }


       
    }
}