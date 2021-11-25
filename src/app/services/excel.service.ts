import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MaestroService } from './maestro.service';
import { Registro } from '../models/registro.model';
import { RegistroExcel } from '../models/registro-excel.model';
import { CoreService } from './core.service';
import { PolicyRegister } from '../models/PolicyRegister';

import { ClientRegister } from '../models/ClientRegister';
import { Maestros } from '../models/maestros.model';
import { SbsReport } from '../models/sbsReport.model';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private core: CoreService,
    private maestroService: MaestroService) { }

  private jsonProps = { 'header': 4, 'defval': '', 'range': "A4:N20000", 'raw': false }
  private sheetName: string = "Registro Negativo";

  private excelToJson(excelData: string | ArrayBuffer): any {
    let data: any = excelData;
    let workbook = XLSX.read(new Uint8Array(data), { type: "array", cellDates: true, dateNF: 'dd/mm/yyyy;@' });
    let jsonExcel = XLSX.utils.sheet_to_json(workbook.Sheets[this.sheetName], this.jsonProps);
    return jsonExcel;
  }

  public excelToRegistro(excelData: string | ArrayBuffer): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let servicioMaestro: Maestros = this.maestroService.getMaestros();
        this.maestroService.getMaestrosDocumento().then((response) => {
            servicioMaestro.tiposDocumento = response.tiposDocumento;
            //console.log(servicioMaestro);
            return resolve(this.core.parse.dto_registros(this.core.parse.dto_RegistrosExcel(this.excelToJson(excelData)), servicioMaestro));
        });
        
      } catch (error) {
        return reject(error);
      }
    });
  }

  public exportRegistros(registros: Array<Registro>, nameFile: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        return resolve(this.json_to_excel(this.core.parse.dto_RegistrosExcelFromRegistros(registros), nameFile));
      } catch (error) {
        return reject(error);
      }
    });
  }

  public exportPolicies(policys: Array<PolicyRegister>, nameFile: string): Promise<any> {
    //console.log(policys);
    return new Promise((resolve, reject) => {
      try {
        return resolve(this.json_to_excel_any(this.core.parse.dto_RegistrosExcelfromReporte(policys), nameFile));
      } catch (error) {
        return reject(error);
      }
    });
  }

  private json_to_excel(data: Array<RegistroExcel>, excelName: string) {
    let wb = XLSX.utils.book_new();

    wb.Props = {
      Title: excelName,
      Subject: excelName,
      Author: "LAFT App",
      CreatedDate: new Date()
    };

    wb.SheetNames.push("data");
    let ws = XLSX.utils.json_to_sheet(data);
    wb.Sheets["data"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), excelName + '.xlsx');
  }

  private json_to_excel_any(data: Array<any>, excelName: string) {
    let wb = XLSX.utils.book_new();

    wb.Props = {
      Title: excelName,
      Subject: excelName,
      Author: "LAFT App",
      CreatedDate: new Date()
    };

    wb.SheetNames.push("data");
    let ws = XLSX.utils.json_to_sheet(data);
    wb.Sheets["data"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), excelName + '.xlsx');
  }

  private s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }





  public exportAsExcelReporteFile(json: any[], json2: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json2);
    this.wrapAndCenterCell(worksheet.B2);
    const workbook: XLSX.WorkBook = { Sheets: { 'planilla': worksheet, 'deposito': worksheet2 }, SheetNames: ['planilla','deposito'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private wrapAndCenterCell(cell: XLSX.CellObject) {
    const wrapAndCenterCellStyle = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
    this.setCellStyle(cell, wrapAndCenterCellStyle);
  }

  private setCellStyle(cell: XLSX.CellObject, style: {}) {
    cell.s = style;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, fileName + ' ' +new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + EXCEL_EXTENSION);
  }

  
}
