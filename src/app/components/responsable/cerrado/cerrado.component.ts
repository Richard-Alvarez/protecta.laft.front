import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';

@Component({
  selector: 'app-cerrado',
  templateUrl: './cerrado.component.html',
  styleUrls: ['./cerrado.component.css']
})
export class CerradoComponent implements OnInit {

  STIPO_USUARIO;
  objRadioHeader:any = {};
  
  //regimen:any = {};
  arrFilesAdjuntos:any = []
  arrResponsablesByCerrado:any = []


    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
   

  @Input() parent:any
  @Input() regimen:any = {}
  @Input() arrResponsable:any = []
  @Input() stateCerrado:any = {}
  @Input() userGroupList:any = []

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) { }

  async ngOnInit() {
    await this.getVariablesStorage();
    this.fillFileGroup()
    ////console.log("el regimen IIIIIIIII: ",this.regimen)
    ////console.log("el stateCerrado AAAAAAAAAAAAAAAAAA: ",this.stateCerrado)
    ////console.log("el this.arrResponsable : ",this.arrResponsable)
    this.arrFilesAdjuntos = [{'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'word'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'otros'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'otros'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'word'}]
    
    this.arrResponsablesByCerrado = [
      {
        "id":"id001",
        "usuario":"Alfredo Chan Way Diaz",
        "fecha_movimiento":"18/12/2020 16:07:22",
        "periodo":"01/07/20 al 30/09/20",
        "respuesta":"Sí",
        "comentario":"Un comentario uno"
      },
      {
        "id":"id002",
        "usuario":"Usuario de prueba",
        "fecha_movimiento":"18/12/2020 16:07:22",
        "periodo":"01/07/20 al 30/09/20",
        "respuesta":"Sí",
        "comentario":"Un comentario uno"
      }
    ]
  }


    fillFileGroup() {
      let alerts = this.getArray(this.stateCerrado.sState, this.regimen.id)
      alerts.forEach(it => {
          this.files.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFiles.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFileName.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFilesToShow.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
      })
  }   

     getFiles(alerta: any, tipoUsuario: string) {
        let lista = this.files.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.files.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
        }
        return lista
    }

    getListFiles(alerta: any, tipoUsuario: string) {
        let lista = this.listFiles.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFiles.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
        }
        return lista
    }

    getListFileName(alerta: any, tipoUsuario: string) {
        let lista = this.listFileName.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFileName.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
        }
        return lista
    }


    getListFilesToShow(alerta: any, tipoUsuario: string) {
        let lista = this.listFilesToShow.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFilesToShow.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
        }
        return lista
    }

    async uploadFiles(event: any, alerta: any, tipoUsuario: string) {
        let files = this.getFiles(alerta, tipoUsuario)
        let file = event.target.files;
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario) 
        Array.from(file).forEach(it => listFileName.push(it["name"]))

        for (let i = 0; i < file.length; i++) {
            let fileInfo = file[i];
            files.push(fileInfo);
            let data = await this.handleFile(files[i])
            listFiles.push(data)
       }
    }

    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }


    removeSelectedFile(fileName: string, alerta: any, tipoUsuario: string) {
        let files = this.getFiles(alerta, tipoUsuario)
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario)
        let index = files.findIndex(it => it.name == fileName)
        files.splice(index, 1);
        listFiles.splice(index, 1)
        listFileName.splice(index, 1)
    }

    async sendFiles(tipoUsuario: string) {
        this.arrResponsable.forEach(async (alerta) => {
            let files = this.getFiles(alerta, tipoUsuario)
            let listFiles = this.getListFiles(alerta, tipoUsuario)
            let listFileName = this.getListFileName(alerta, tipoUsuario)
            if (files.length > 0) {
                let data: any = {};
                //var user = this.core.storage.get('usuario');
                //this.userUpload = user['idUsuario'];
                //this.uploadDate = new Date();
                
                data.files = files;
                data.listFiles = listFiles
                //data.dateUpload = moment(this.uploadDate).format('DD/MM/YYYY').toString();
                //data.idUser = this.userUpload;
                data.listFileName = listFileName
                data.alerta = alerta
                //data.nIdCabUsuario = this.NIDALERTA_CABECERA
                for (let i = 0; i < listFiles.length; i++) {
                    let ruta = listFileName[i]
                    let uploadParams = { NIDALERTA_CABECERA: alerta.NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO}
                    await this.insertAttachedFiles(uploadParams)
                }
                
                 this.userConfigService.uploadFiles(data).then(response => {
                     ////console.log("upload", response);
                 });
            }
        })

    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
        ////console.log(response)
    }
   

  async getVariablesStorage(){
    this.STIPO_USUARIO = 'OC'//await this.core.storage.get('STIPO_USUARIO')
    //this.arrResponsablesCompleGral = await this.core.storage.get('arrResponsablesCompleGral');
    //this.arrResponsablesCompleSimpli = await this.core.storage.get('arrResponsablesCompleSimpli');
    //this.stateCompletado = await this.core.storage.get('stateCompletado');
    //this.regimen = await this.core.storage.get('regimenPadre');
    //this.userGroupListGral = await this.core.storage.get('userGroupListGral')
    //this.userGroupListSimpli = await this.core.storage.get('userGroupListSimpli')
  }


  getIsValidStateAllow(state){
    if(this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')){
      return false;
    }else{
      return true;
    }
  }

  getArray(state,regimen){
    /*//console.log("la OOOOOOOOOOOO : ",state +"    -    "+regimen)
    switch (state) {
      case 'COMPLETADO' : 
        if(regimen === 1){
          return this.arrResponsablesCompleGral
        }
        if(regimen === 2){
          return this.arrResponsablesCompleSimpli
        }
      break;
      default : 
        return [];
    }*/
    return this.arrResponsable;
    //return this.arrResponsablesPendienteSimpli;
  }

  getArrayUserGroup(regimen,estado){
    
    /*if(regimen === 1){
      return this.userGroupListGral
    }
    if(regimen === 2){
      return this.userGroupListSimpli
    }*/
    return this.userGroupList;
  }

  getClassBagdeState(state){
    ////console.log("state : ",state)
    if(state === 'PENDIENTE'){
      return 'badge-warning'
    }
    if(state === 'COMPLETADO'){
      return 'badge-success'
    }
    if(state === 'DEVUELTO'){
      return 'badge-danger'
    }
    if(state === 'REVISADO'){
      return 'badge-info'
    }
    if(state === 'CERRADO'){
      return 'badge-dark'
    }
    return 'badge-warning'
  }
  
  getValidationNameEqualsResponsable(usuarioGroup,usuarioServicio){
    //userGroup == item.NOMBRECOMPLETO
    if(this.STIPO_USUARIO === 'RE'){
      return true;
    }
    if(this.STIPO_USUARIO === 'OC' && usuarioGroup === usuarioServicio){
      return true
    }else{
      return false;
    }
  }

  getStateTextArea(index){
    if(this.objRadioHeader.state === '1' && this.objRadioHeader.index === index){
      return true;
    }
    if(this.objRadioHeader.state === '2' && this.objRadioHeader.index === index){
      return false;
    }
    return true;
  }
  attachFileStyle(item: any) {
    /*if (item.STIPO_MENSAJE == 'ADJ') {
        return "attached"
    } else {
        return ""
    }*/
    return "attached"
  }

  setStateTextArea(index,state){
    //if(state !== '2'){
      this.objRadioHeader.index = index
      this.objRadioHeader.state = state
    //}
  }

}
