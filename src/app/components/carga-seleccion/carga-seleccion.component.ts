import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CargaService } from '../../services/carga.service';
import { ExcelService } from 'src/app/services/excel.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { Carga } from 'src/app/models/carga.model';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { Registro } from 'src/app/models/registro.model';

declare var $: any;

@Component({
  selector: 'app-carga-seleccion',
  templateUrl: './carga-seleccion.component.html',
  styleUrls: ['./carga-seleccion.component.css']
})

export class CargaSeleccionComponent implements OnInit {
  constructor(
    private core: CoreService,
    private cargaService: CargaService, private excelService: ExcelService,
    private maestroService: MaestroService
  ) { }

  private file: any;
  private modal: any;
  public tipoDocumento: TipoDocumento;
  bsValueIni: Date = new Date();
  ngOnInit() {
    this.file = document.getElementById("file");
    this.modal = document.getElementById("cargaModal");
    this.file.onchange = (e) => { this.leerArchivo(e); };
  }

  seleccionarArchivo() {
    this.file.click();
  }

  leerArchivo(e) {
    this.core.loader.show();

    $(this.modal).modal('hide');
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = (file) => {
      let carga: Carga = new Carga();
      this.excelService.excelToRegistro(reader.result)
        .then((response) => {
          carga.registros = response;
          this.SetTypeDocument(carga).then((res) => {
            this.maestroService.cargarMaestroAPIDocumento().then((resp) => {
              const tipoDocumento: Array<TipoDocumento> = resp;
              carga.registros.forEach((element) => {
                if (element.documento.descripcion != '') {
                  
                  element.documento = tipoDocumento.filter((r => {
                    return (r.descripcion + "").toLowerCase().trim() == (element.documento.descripcion + "").toLowerCase().trim();
                  }))[0];
                }
                this.core.loader.hide();
                this.cargaService.setCargaTemp(carga);
                this.core.rutas.goCarga();
              });

            });
            // carga.registros = res;

          });

        })
        .catch(() => {
          this.core.loader.hide();
        });
    };

    reader.readAsArrayBuffer(file);
  }


  public async val(carga: Carga) {
    let exist: number = 0;
    for (const registro of carga.registros) {
      if ((registro.documento.id === 0 || registro.documento.id === undefined) && registro.documento.descripcion != '') {
        exist = 1;
      }
    }
    return (exist == 1) ? true : false;
  }


  public CompleteCampo(carga: Carga): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        const valboolean = await this.val(carga);
        if (valboolean) {
          for (const registro of carga.registros) {
            if (registro.documento.descripcion != '') {

              const doc: any = { descripcion: registro.documento.descripcion };

              this.maestroService.AddMaestroDocument(doc).then((re) => {

              });
            }
          }
          resolve('');
        } else {
          resolve('Correct');
        }
        // carga.registros.forEach((element) => {

        // });
      } catch (error) {
        return reject(error);
      }
    });

  }



  public SetTypeDocument(carga: Carga): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
       
        const valboolean = await this.val(carga);

        const Documents: Array<any> =
          carga.registros.filter(x => (x.documento.id === 0 ||
            x.documento.id === undefined) && x.documento.descripcion != '').map(x => x.documento);

        
        const docs: Array<any> = Array.from(new Set(Documents.map((item) => item.descripcion)));
        
        if (docs.length > 0) {
          for (let i = 0; i <= docs.length; i++) {
            const doc: any = { descripcion: docs[i] };
            
            await this.maestroService.AddMaestroDocument(doc).then((re) => {

            });
          }

          /* for (const registro of carga.registros) {
             if ((registro.documento.id === 0 || registro.documento.id === undefined) && registro.documento.descripcion != '') {
 
               const doc: any = { descripcion: registro.documento.descripcion };
               
               await this.maestroService.AddMaestroDocument(doc).then((re) => {
 
               });
             }
           }*/
          resolve('');
        } else {
          resolve('Correct');
        }
        // carga.registros.forEach((element) => {

        // });
      } catch (error) {
        return reject(error);
      }
    });

  }
  insertar(document: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const response = this.maestroService.AddMaestroDocument(document).then((re) => {
        resolve(re);
      });
    });
  }


}
