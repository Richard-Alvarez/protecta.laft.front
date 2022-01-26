import { Injectable } from '@angular/core';
import { LaftService } from '../api/laft.service';
import { CoreService } from './core.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ReportesSbsComponent } from '../pages/reportes-sbs/reportes-sbs.component';
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet application/vnd.ms-excel;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class SbsreportService {

  constructor(
    private core: CoreService,
    private laft: LaftService) { }

  getQuestionsByAlert(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlQuestionsByAlert, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getAlertList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlAlertList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  updateAlertToList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateAlert, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  
  updateQuestionsToAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateQuestion, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  suspendFrequency(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlChangeFrequencyStatus, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  experianServiceInvoker(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlExperianInvoker, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getUsersByProfileList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUsersByProfileList, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getProfileList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetProfileList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getPerfilList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetPerfilList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getUserByProfileList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetUserByProfileList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getRegimeList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegimenList, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  GetGrupoxPerfilList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetGrupoxPerfilList, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  
  GetGrupoXSenal(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetGrupoXSenal, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getAlertByProfileList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlAlertByProfileList, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  updateAlertByProfile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateAlertByProfile, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getSignalFrequency(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlSignalFrequency).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getSignalFrequencyList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlSignalFrequencyList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getSignalFrequencyActive(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlSignalFrequencyActive).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  addFrequencyToList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateFrequency, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  inactiveFrequencyToList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateFrequency, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  getGafiList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGafiList).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  addCountryToList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateGafi, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  inactiveCountryToList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateGafi, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getExchangeRate(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlExchangeRate).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getAmount(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlAmount).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getReportTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlReportTypes).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  generateReportSBS(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlReportSBS, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  monitoringReportSBS(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlMonitoringReportSBS, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  monitoringAlerts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlMonitoringAlerts, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getFileRoute(id: any, tipo_archivo: any): Promise<any> {
    const data = { "id": id, "tipo_archivo": tipo_archivo };
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDownloadReportSBS, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  public exportListToExcel(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet(
      [
        {
          A: "ESTADO",
          B: "IDREPORTE",
          C: "FECHA INICIO PRODUCCIÓN",
          D: "FECHA FIN PRODUCCIÓN",
          E: "TIPO DE CAMBIO",
          F: "TIPO DE OPERACIÓN",
          G: "ORIGEN DE REPORTE",
          H: "MONTO",
          I: "TIPO DE ARCHIVO",
          J: "RESULTADO",

        }
      ],
      {
        header: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        skipHeader: true,
      }
    );
    //Creamos un array con los datos de las columnas
    const register = [];
    for (let i = 0; i < json.length; i++) {
      const object = {

        A: json[i].statusReport == 3 ? "ERROR" : json[i].statusReport && json[i].statusReport == 2 ? "FINALIZADO" : json[i].statusReport && json[i].statusReport == 1 ? "PROCESANDO" : json[i].statusReport,
        B: json[i].id,
        C: json[i].startDate,
        D: json[i].endDate,
        E: json[i].exchangeRate,
        F: json[i].operType == 2 ? "MÚLTIPLES" : json[i].operType && json[i].operType == 1 ? "ÚNICAS" : json[i].operType && json[i].operType == 3 ? "ÚNICAS Y MÚLTIPLES" : json[i].operType,
        G: json[i].nameReport == 'S' ? "SINIESTROS" : json[i].nameReport && json[i].nameReport == 'R' ? "RENTAS" : json[i].nameReport && json[i].nameReport == 'V' ? "VIDA" : json[i].nameReport && json[i].nameReport == 'SR' ? "SINIESTROS y RENTAS" : json[i].nameReport && json[i].nameReport == "SV" ? "SINIESTROS Y VIDA" : json[i].nameReport && json[i].nameReport == "VR" ? "VIDA y RENTAS" : json[i].nameReport && json[i].nameReport == "SVR" ? "SINIESTROS Y VIDA Y RENTAS" : json[i].nameReport,
        H: json[i].amount,
        I: json[i].fileType,
        J: json[i].message,
      };
      register.push(object);

    }
    //console.log(register)
    //Construcción de Header
    XLSX.utils.sheet_add_json(ws, register, {
      skipHeader: true,
      origin: "A2"
    });
    // LLenamos la hoja de excel con los datos
    const workbook: XLSX.WorkBook = {
      Sheets: { reportesSBSGenerados: ws },
      SheetNames: ["reportesSBSGenerados"]
    };
    //Propiedades de las celdas
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: false,
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  //Guardamos el archivo excel
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: "application/octet-stream"
    });
    FileSaver.saveAs(
      data,
      fileName + "_generados_SBS_" + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
      ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2) + EXCEL_EXTENSION
    );
  }

  cargarReporteRescates(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlReportCargaRescates).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  processInsertFile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlProcessInsertFile, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getPromedioTipoCambio(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetPromedioTipoCambio, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  processCargaFile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlProcessCargaFile, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  processPagosManuales(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlProcessPagosManuales, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


}