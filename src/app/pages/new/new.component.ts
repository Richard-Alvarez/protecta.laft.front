import { Component, OnInit } from '@angular/core';
import { CargaService } from 'src/app/services/carga.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { Maestros } from 'src/app/models/maestros.model';
import { Registro } from 'src/app/models/registro.model';
import { Carga } from 'src/app/models/carga.model';
import { CoreService } from 'src/app/services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  constructor(
    private core: CoreService,
    private cargaService: CargaService,
    private maestroService: MaestroService) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  public registro: Registro = new Registro();
  public maestros: Maestros = this.maestroService.getMaestros();
  private carga: Carga = this.core.storage.get('carga');

  ngOnInit() {

    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }

  }


  ValidateCampo(valor: any) {
    if (valor == null || valor.trim() == '') {
      return true;

    }
  }
  Message(mensage: string) {
    return swal.fire(
      'Validación',
      mensage,
      'error'
    );
  }

  FormatFecha(fecha: string) {
    if (fecha.includes('-')) {
      let dia = fecha.substr(8, 2);
      let mes = fecha.substr(5, 2);
      let anio = fecha.substr(0, 4);
      
      return dia + '/' + mes + '/' + anio;
    } else {
      return fecha;
    }
  }

  MessageCorrect(mensage: string) {
    return swal.fire(
      'Información',
      mensage,
      'success'
    );
  }



  grabarRegistro() {

    let error: boolean = false;

    if (this.ValidateCampo(this.registro.numero)) {
      this.Message('El campo Id carga es obligatorio');
      error = true;
    }
    // if (this.ValidateCampo(this.registro.secuencia)) {
    // this.Message('El campo secuencia es obligatorio');
    //  error = true;
    // }
    if (this.ValidateCampo(this.registro.fechaRegistro)) {
      this.Message('El campo Fecha registro es obligatorio');
      error = true;
    }


    if (this.ValidateCampo(this.registro.nombre)) {
      if (this.registro.documento.id == 1) {
        if (this.registro.numeroDocumento != null) {
          if (this.registro.numeroDocumento.length !== 8) {
            this.Message('El número de documento debe de tener 8 caracteres.');
            error = true;
          }
        } else {
          this.Message('Ingrese el N° de Documento');
          error = true;
        }
      }

      if (this.registro.documento.id == 2) {
        if (this.registro.numeroDocumento != null) {
          if (this.registro.numeroDocumento.length === 11) {
            if (!this.registro.numeroDocumento.substring(0, 2).includes('10') &&
              !this.registro.numeroDocumento.substring(0, 2).includes('15') &&
              !this.registro.numeroDocumento.substring(0, 2).includes('17') &&
              !this.registro.numeroDocumento.substring(0, 2).includes('20')) {
              this.Message('Debe ingresar ingresar un RUC valido.');
              error = true;
            }
          } else {
            this.Message('El número de documento debe de tener 11 caracteres.');
            error = true;
          }
        } else {
          this.Message('Ingrese el N° de Documento');
          error = true;
        }
      }

      if (this.registro.documento.id == null || this.registro.documento.id == 0) {
        this.Message('Tipo de documento de identidad es obligatorio');
        error = true;
      }

    }



    /*if (this.registro.pais.id == null) {
      this.Message('El campo país es obligatorio');
      error = true;
    }*/
    if (this.registro.persona.id == null || this.registro.persona.id == 0) {
      this.Message('El campo tipo persona es obligatorio');
      error = true;
    } else {
      if (this.ValidateCampo(this.registro.nombre) && this.ValidateCampo(this.registro.numeroDocumento)) {
        this.Message('El Campo Nombre/Razón Social o N° de documento es obligatorio');
        error = true;
      } else {
        if (!this.ValidateCampo(this.registro.nombre)) {

          /* if (this.registro.nombre.trim().length < 3 && this.registro.persona.id == 2) {
             this.Message('El Campo Nombre/Razón Social tiene que ser mayor o igual a 3 caracteres');
             error = true;
           }*/
          if (this.registro.persona.id == 1 && (this.registro.documento.id == null || this.registro.documento.id == 0)) {
            if ((this.ValidateCampo(this.registro.nombre)) && this.registro.numeroDocumento != '') {
              this.Message('Debe llenar todos los campos del nombre de cliente');
              error = true;
            }
          }
        }
      }
    }
    
    if (this.registro.senial.id == null || this.registro.senial.id < 0 || this.registro.senial.id === undefined) {
      this.Message('La señal es obligatoria');
      error = true;
    }

    if (error) { this.core.loader.hide(); return; }

    this.core.loader.show();
    if (this.carga != null) {
      this.registro.idCarga = this.carga.id;
    }


    this.registro.secuencia = 0;


    if (this.registro.persona != null && this.registro.persona.id > 0) {
      this.registro.persona = this.maestros.tiposPersona.filter(t => t.id == this.registro.persona.id)[0];
    }

    if (this.registro.documento != null && this.registro.documento.id > 0) {
      this.registro.documento = this.maestros.tiposDocumento.filter(t => t.id == this.registro.documento.id)[0];
    } else {
      this.registro.documento = { id: 0, descripcion: 'no registrado' };
    }

    if (this.registro.pais != null && this.registro.pais.id > 0) {
      this.registro.pais = this.maestros.paises.filter(t => t.id == this.registro.pais.id)[0];
    }

    if (this.registro.senial != null && this.registro.senial.id > 0) {
      this.registro.senial = this.maestros.seniales.filter(t => t.id == this.registro.senial.id)[0];
    }
    this.registro.fechaRegistro = this.FormatFecha(this.registro.fechaRegistro);
    this.cargaService.agregarRegistro(this.registro)
      .then((Response) => {
        
        this.core.loader.hide();
        swal.fire(
          'Información',
          'Se creó el registro correctamente',
          'success'
        )
          .then((result) => {
            if (result.value) {
              this.core.rutas.goNegativeRecords();
            }
          });



      })

      .catch((error) => {
        
        this.core.loader.hide();
        this.MessageCorrect('Ocurrio un problema,Comuniquese con soporte');
      });
  }

}
