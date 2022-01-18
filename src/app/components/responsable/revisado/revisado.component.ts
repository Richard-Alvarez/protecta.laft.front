import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
// import { ResponsableComponent } from '../responsable/responsable.component';

@Component({
  selector: 'app-revisado',
  templateUrl: './revisado.component.html',
  styleUrls: ['./revisado.component.css']
})
export class RevisadoComponent implements OnInit {

    STIPO_USUARIO;
    objRadioHeader:any = {};

    arrFilesAdjuntos:any = []
    IDGrupo
    
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()

    PeriodoComp

    @Input() regimen:any = {}
    @Input() context:string
    @Input() arrResponsable:any = []
    @Input() stateRevisado:any = {}
    @Input() userGroupList:any = []
    @Input() ValidadorHistorico: any
    @Input() parent:ResponsableComponent
    @Input() HistoricoPeriodo:any
    @Input() arrResponsable2:any = []

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) { }


  async ngOnInit() {
    this.IDGrupo = await this.ValidarGrupo()

    await this.ListaUsuario()
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    await this.ConsultaComplementoUsuarios('REVISADO',this.PeriodoComp)
    await this.ListaAlertas()
    await this.ConsultaComplemento()


    await this.getVariablesStorage();
    this.fillFileGroup()
   
    //this.arrFilesAdjuntos = [{'name':'archivoPrueba1','file':'C://file1.xls','tipo':'xls'},{'name':'archivoPrueba2','file':'C://file2.xls','tipo':'pdf'},{'name':'archivoDocPrueba1','file':'C://file2.xls','tipo':'doc'}]
  }

   fillFileGroup() {
      let alerts = this.getArray(this.stateRevisado.sState, this.regimen.id)
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
                
                 });
            }
        })

    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
        
    }


  async getVariablesStorage(){
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO//await this.core.storage.get('STIPO_USUARIO')
    //this.arrResponsablesCompleGral = await this.core.storage.get('arrResponsablesCompleGral');
    //this.arrResponsablesCompleSimpli = await this.core.storage.get('arrResponsablesCompleSimpli');
    //this.stateRevisado = await this.core.storage.get('stateRevisado');
    //this.regimen = await this.core.storage.get('regimenPadre');
    //this.userGroupListGral = await this.core.storage.get('userGroupListGral')
    //this.userGroupListSimpli = await this.core.storage.get('userGroupListSimpli')
  }


  getIsValidStateAllow(state){
    // if(this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')){
    //   return false;
    // }else{
    //   return true;
    // }
    return true;
  }

  getArray(state,regimen){
    /*
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
     
     //console.log("getArray2",this.arrResponsable2)
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

  async downloadUniversalFile(ruta,nameFile){
    await this.parent.downloadUniversalFile(ruta,nameFile)
  }

  getClassBagdeState(state){
  
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
  getValidationArrayByUser(NOMBRECOMPLETO){
    if(this.STIPO_USUARIO === 'RE'){
      return true
    }
    let respFilterArrayResponsable = this.arrResponsable.filter(responsable => responsable.NOMBRECOMPLETO === NOMBRECOMPLETO)
    if(respFilterArrayResponsable.length === 0){
      return false
    }
    return true
   }

   getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
      console.log("error al descargar el archivo. ",error)
    }
  }

  
 capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    
 
   return texto[0].toUpperCase() +  texto.slice(1).toLowerCase()
}

async getArchivoSustento(item){
  
  try {
    let objAdjunto = item.arrAdjuntosSustento[0]
    //let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
    
    //let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
    let ruta = item.arrAdjuntosSustento[0].SRUTA_ADJUNTO
    
    let resp = await this.parent.downloadUniversalFile(ruta,objAdjunto.name)
  } catch (error) {
    console.error("error en descargar: ",error)
  }
}

getAlerta(alerta){
  var respuesta = alerta.indexOf("COMPLEMENTO");
  if(respuesta >= 0) {
   return ""
} else {
    return "Pregunta:"
}
}



listaComplemento:any = [] 
async ConsultaComplemento(){

 this.listaComplemento = await this.userConfigService.GetListaAlertaComplemento()
 
}

linkactual
 async ValidarGrupo(){
  var URLactual = window.location + " ";
  let link = URLactual.split("/")
  this.linkactual = link[link.length-1].trim()
  if(this.linkactual == "clientes" || this.linkactual == "historico-clientes" ){
    return  1
  }else if(this.linkactual == "colaborador" || this.linkactual == "historico-colaborador" ){
    return  2
  }
  else if(this.linkactual == "contraparte" || this.linkactual == "historico-contraparte" ){
    return  4
  }
  else if(this.linkactual == "proveedor" || this.linkactual == "historico-proveedor" ){
    return  3
  }
}


// async filtroComplemeto(item){
  
  
//   let resultado:any = []
//    resultado = await this.listaComplemento.filter(it => it.NIDALERTA == item.NIDALERTA && it.NIDGRUPOSENAL == this.IDGrupo)
 
//   return resultado
// }

filtroComplemeto(item){
  let resultado = this.listaComplemento.filter(it => it.NIDALERTA == item.NIDALERTA)
  
  return resultado
}
filtroComplemeto2(item){
  return this.listaComplemento.filter(it => it.NIDALERTA == item.NIDALERTA)
}


listaComplementoUsuario:any = [] 
async ConsultaComplementoUsuarios(estado,periodo) {
  let data:any ={}

  if(this.ValidadorHistorico == 0){
   
    data.NPERIODO_PROCESO = this.HistoricoPeriodo
    this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)
  }
  else{
    if(estado == 'COMPLETADO'){
    
      data.NPERIODO_PROCESO = periodo //this.PeriodoComp
    
     //this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)
    }else{
      
      data.NPERIODO_PROCESO = this.PeriodoComp 
    }
     
    this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)
  }

 
  

}



ListUser:any = []
userId:number = 0
async ListaUsuario(){
    this.ListUser = await this.userConfigService.ListaUsariosComp()
  
}


NewArreglo:any = []
async ListaAlertas(){
  
  this.arrResponsable = this.getArray(this.stateRevisado.sState,1)
  this.NewArreglo = []
  
   this.arrResponsable.forEach(item => {
    let resultado = this.listaComplementoUsuario.filter(it => it.NIDUSUARIO_RESPONSABLE == item.NIDUSUARIO_ASIGNADO && it.NIDALERTA ==  item.NIDALERTA)
    let obj:any = {}
    obj.NIDUSUARIO_ASIGNADO = item.NIDUSUARIO_ASIGNADO
    obj.NOMBRECOMPLETO = item.NOMBRECOMPLETO
    obj.NREGIMEN = item.NREGIMEN
    obj.RESULTADO = resultado
    obj.NIDALERTA = item.NIDALERTA
    
    this.NewArreglo.push(obj)
   
   });
   
  
}

async ListaAlertasDesdeCompletado(completado){
  // this.NewArreglo = []
  //  responsable.forEach(item => {
  //   let resultado = this.listaComplementoUsuario.filter(it => it.NIDUSUARIO_RESPONSABLE == item.NIDUSUARIO_ASIGNADO && it.NIDALERTA ==  item.NIDALERTA)
  //   let obj:any = {}
  //   obj.NIDUSUARIO_ASIGNADO = item.NIDUSUARIO_ASIGNADO
  //   obj.NOMBRECOMPLETO = item.NOMBRECOMPLETO
  //   obj.NREGIMEN = item.NREGIMEN
  //   obj.RESULTADO = resultado
  //   obj.NIDALERTA = item.NIDALERTA
  //   this.NewArreglo.push(obj)
 
  //  });
 
   
  this.NewArreglo = await completado

  
}

async descargarComplemento (item,listUsu){
  // var splitRuta = listUsu.SRUTA_PDF.split('/')
  // this.parent.downloadUniversalFile(listUsu.SRUTA_PDF, splitRuta[splitRuta.length - 1])

  await this.ListaDeAdjunto()
  let listaArchivos = this.listaArchivosComplementos.filter(it => it.STIPO_CARGA == "COMPLEMENTO" && it.NIDALERTA == listUsu.NIDALERTA && it.NIDUSUARIO_MODIFICA == listUsu.NIDUSUARIO_ASIGNADO)
  if(listaArchivos.length ==0){
    let mensaje = "El responsable no adjunto ningun archivo"
    this.AlertaMensaje(mensaje)
  }else{
    listaArchivos.forEach(lista => {
      var splitRuta = lista.SRUTA_ADJUNTO.split('/')
      this.parent.downloadUniversalFile(lista.SRUTA_ADJUNTO, splitRuta[splitRuta.length - 1])
    });
   
  }

  

}

listaArchivosComplementos:any =[]
async ListaDeAdjunto(){
  if(this.ValidadorHistorico == 0){
    let data:any ={}
    data.NPERIODO_PROCESO = this.HistoricoPeriodo
    this.listaArchivosComplementos = await this.userConfigService.getListaAdjuntos(data)
  }
  else{
    let data:any ={}
    data.NPERIODO_PROCESO = this.PeriodoComp
    this.listaArchivosComplementos = await this.userConfigService.getListaAdjuntos(data)
  }
  

}

AlertaMensaje(mensaje){

  swal.fire({
    title: 'Bandeja del Oficial de Cumplimiento',
    icon: 'warning',
    text: mensaje,
    showConfirmButton: true,
    confirmButtonColor: "#FA7000",
    confirmButtonText: 'Aceptar',
    showCloseButton: true,
    customClass: { 
        closeButton : 'OcultarBorde'
        },
    
  }).then(async (result) => {
     if(result.value){
       return
     }
    } )  
    return

}


}
