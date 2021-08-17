import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

export class Rutas {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/home']);
  }
  goNegativeRecords() {
    this.router.navigate(['/negative-records']);
  }

  goVerRegistro() {
    this.router.navigate(['/ver']);
  }
  goVerReporte() {
    this.router.navigate(['/reporte', 'direct']);
  }

  goVerReporteSbs() {
    this.router.navigate(['/reportes-sbs', 'direct']);
  }

  goVerConfigUser() {
    this.router.navigate(['/user-config']);
  }

  goEditarRegistro() {
    this.router.navigate(['/editar']);
  }

  goCarga() {
    this.router.navigate(['/carga']);
  }

  goLogin() {
    this.router.navigate(['/']);
  }

  goClientes() {
    this.router.navigate(['/clientes']);
  }

  goColaborador() {
    this.router.navigate(['/colaborador']);
  }

  goContraparte() {
    this.router.navigate(['/contraparte']);
  }
  

}