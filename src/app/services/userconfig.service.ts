import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { LaftService } from '../api/laft.service';
import { scaleInBl } from 'igniteui-angular';

@Injectable({
  providedIn: 'root'
})
export class UserconfigService {

  constructor(
    private core: CoreService,
    private laft: LaftService
  ) { }

  getMovementHistory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.laft.post(this.core.config.rest.urlGetMovementHistory, data).subscribe(response => {
                return resolve(response)
            })
        } catch (error) {
            return reject(error)
        }
    })
  }
  updZonasGeograficas(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.laft.post(this.core.config.rest.urlUpdZonasGeograficas, data).subscribe(response => {
                return resolve(response)
            })
        } catch (error) {
            return reject(error)
        }
    })
  }

  getInformeKri(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.laft.post(this.core.config.rest.urlgetInformeKri, data).subscribe(response => {
                return resolve(response)
            })
        } catch (error) {
            return reject(error)
        }
    })
  }


  getPolicyList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.laft.post(this.core.config.rest.urlGetPolicyList, data).subscribe(response => {
                return resolve(response)
            })
        } catch (error) {
            return reject(error)
        }
    })

  }

  getCommentList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetCommentList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }


  updateCommentList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateCommentList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }


  getListNcCompanies(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListNcCompanies, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getClientsforRegimen(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetClientsforRegimen, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getSearchClientsPep(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSearchClientsPep, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getSearchClientsPepSeacsa(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSearchClientsPepSeacsa, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }



  updateListNcCompanies(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.ulrUpdateListNcCompanies, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }



  updateStatusAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateStatusAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  
  GetAnulacionAlerta(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAnulacionAlerta, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }




  getOCEmailList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetOCEmail, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaCargo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaCargo, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaAlertaComplemento(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaAlertaComplemento, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  ListaUsariosComp(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlListaUsariosComp, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }


  GetListaCompUsu(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaComplementos,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  GetListaComplementoUsuario(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaComplementoUsuario,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  GetAlertaResupuesta(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAlertaResupuesta,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  GetListaResultado(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaResultado, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaAcciones(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaAcciones, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  } 

  GetListaNegativoCoincidencia(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaNegativoCoincidencia, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  } 

  GetListaP4(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaP4, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  } 
 

  sendEmail(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlEmailSender, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  Consulta360(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlConsulta360, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  Consulta360Previous(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlConsulta360Previous, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  ConsultaWC(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlConsultaWC, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }



  //Obtener la lista de opciones del perfil
  getOptions(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlMenu, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  //Obtener la lista de subopciones de cada opción del perfil
  getSubOptions(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlSubMenu, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  //Obtener la lista de usuarios
  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlUsers).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getPeriodoSemestral(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetPeriodoSemestral).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getSubGrupoSenal(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSubGrupoSenal, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  //Obtener la lista de estados de los usuarios
  getUserState(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlUserStatus).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      } scaleInBl
    });
  }
  //Obtener información del usuario seleccionado
  getDataFromUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUserData, data).subscribe((response) => {
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
        this.laft.get(this.core.config.rest.urlUserProfile).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getCargoList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUserCargo, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  //Crear información del usuario
  createUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlCreateUser, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  //Actualizar información del usuario
  updateUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateUser, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getQuestionDetail(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlQuestionDetail, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    });
  }

  getQuestionHeader(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlQuestionHeader, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  insertQuestionDetail(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertQuestionDetail, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  InsertUpdateProfile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertUpdateProfile, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  
  InsertUpdateProfileGrupos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertUpdateProfileGrupos, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  InsertUpdateComplemento(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertUpdateComplemento, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  ValidarPolizaVigente(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlValidarPolizaVigente, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  BusquedaManual(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlBusquedaManual, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetUpdComplementoCab(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetUpdComplementoCab, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetInsCormularioComplUsu(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetInsCormularioComplUsu, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetActPassUsuario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetActPassUsuario, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  InsCorreoUsuario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsCorreoUsuario, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getListaUsuarioCorreos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetListaUsuarioCorreos, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getListaAdjuntos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetListaAdjuntos, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  

  EnvioCorreoConfirmacion(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlEnvioCorreoConfirmacion, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  
  EnvioCorreoActualizacionPass(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlEnvioCorreoActualizacionPass, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
    
  GetUpdPssUsuario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetUpdPssUsuario, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetValFormularioCompl(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetValFormularioCompl, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  
  

  insertQuestionHeader(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertQuestionHeader, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getAlertFormList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAlertFormList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }




  getOfficialAlertFormList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetOfficialFormList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  uploadFiles(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlFiles, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
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

  GetListCorreo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListCorreo).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetListaPerfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListaPerfiles).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  

  GetListConifgCorreoDefault(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListConifgCorreoDefault).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetListAction(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListAction).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetListPerfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListPerfiles).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
 

 getUpdateCorreos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetUpdateCorreos,data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetGrupoSenal(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetGrupoSenal).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  updateRevisedState(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateRevisedState, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  getCommentHeader(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetCommentHeader, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  insertCommentHeader(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertCommentHeader, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getWorkModuleList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetWorkModuleList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getWorkModuleDetail(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetWorkModuleDetail, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getAddressList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.laft.post(this.core.config.rest.urlGetAddressList, data).subscribe(response => {
                return resolve(response)
            })
        } catch (error) {
            return reject(error)
        }
    })

  }

  insertCompanyDetailUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertCompanyDetailUser, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getProductsCompany(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetProductsCompany, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  sendComplimentary(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlSendComplimentary, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getAttachedFiles(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAttachedFiles, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  insertAttachedFiles(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertAttachedFiles, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })


  }

  downloadFile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDownloadFile, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getGafiList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetGafiList, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getSignalList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSignalList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  updateStatusToReviewed(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateStatusToReviewed, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getRegimeList(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegimeList, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getCurrentPeriod(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetCurrentPeriod, null).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
        
      }
    })

  }

  fillReport(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlFillReport, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  // downloadPDF(data: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.laft.post(this.core.config.rest.urldownloadPDF, data).subscribe(response => {
  //         return resolve(response)
  //       })
  //     } catch (error) {
  //       return reject(error)
  //     }
  //   })

  // }

  getListGafiAlert(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetGafiByParams, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getListDirDuplicAlert(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetDirDuplicByParams, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getListClienteRentasRAltoAlert(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetClienteRentasRAltoByParams, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getInternationalLists(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetInternationalLists, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  getListWebLinksCliente(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListWebLinksCliente, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  getClientWcEstado(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetClientWcEstado, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  getDeleteWebLinksCoincidence(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetDeleteWebLinksCoincidence, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  addWebLinkscliente(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlAddWebLinkscliente, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  getPepList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetPepList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getFamiliesPepList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetFamiliesPepList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getSacList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSacList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getListEspecial(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListEspecial, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  updateUnchecked(data: any): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateUnchecked, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  GetAlertReportList(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAlertReportList, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getListNCAlert(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetNCByParams, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  getListInterbyType(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListInterbyType, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  getListaInternacional(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        ////console.log("url : ",this.core.config.rest.urlGetListaInternacional);
        this.laft.post(this.core.config.rest.urlGetListaInternacional,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }
  getResultadosCoincidencias(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        ////console.log("url : ",this.core.config.rest.urlGetListaInternacional);
        this.laft.post(this.core.config.rest.urlGetResultadosCoincidencias,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }
  insertAttachedFilesByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertAttachedFilesByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })


  }

  insertAttachedFilesInformByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlInsertAttachedFilesInformByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })


  }

  getAttachedFilesByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAttachedFilesByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  getAttachedFilesInformByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAttachedFilesInformByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  getAttachedFilesInformByCabecera(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetAttachedFilesInformByCabecera, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  downloadFileByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDownloadFileByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  DownloadUniversalFileByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDownloadUniversalFileByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }
  DownloadTemplate(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDownloadTemplate, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  uploadFilesByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlFilesByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  UploadFilesInformByAlert(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUploadFilesInformByAlert, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  UploadFilesUniversalByRuta(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUploadFilesUniversalByRuta, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  setDataExcelDemanda(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlSetDataExcelDemanda, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  DelEliminarDemanda(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDelEliminarDemanda, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  GetKriSearchZonaGeografica(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetKriSearchZonaGeografica, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getResultadoTratamiento(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetResultadoTratamiento,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }
  GetPerfilXGrupo(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetPerfilXGrupo,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  GetListaComplementos(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaComplementos,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  GetListaPolizas(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaPolizas,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }
  

  GetGrupoXPerfil(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetGrupoXPerfil,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }
  

    getResultsList(data): Promise<any> {
        return new Promise((resolve, reject) => {
          try {
            this.laft.post(this.core.config.rest.urlGetResultsList,data).subscribe(response => {
              return resolve(response)
            })
          } catch (error) {
            //console.log(error)
            return reject(error)
          }
        })
    }
    GetListaResultadoGC(data): Promise<any> {
      return new Promise((resolve, reject) => {
        try {
          this.laft.post(this.core.config.rest.urlGetListaResultadoGC,data).subscribe(response => {
            return resolve(response)
          })
        } catch (error) {
          //console.log(error)
          return reject(error)
        }
      })
  }
  getListaTipo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListTipo).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
}

  updateListClienteRefor(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateListClienteRefor,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  UpdateTratamientoCliente(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        ////console.log("url : ",this.core.config.rest.urlGetListaInternacional);
        this.laft.post(this.core.config.rest.urlUpdateTratamientoCliente,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

  getResultadoTratamientoHistory(data): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        ////console.log("url : ",this.core.config.rest.urlGetListaInternacional);
        this.laft.post(this.core.config.rest.urlGetResultadoTratamientoHistory,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        //console.log(error)
        return reject(error)
      }
    })
  }

 UpdateStateSenialCabUsuarioRealByForm(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateStateSenialCabUsuarioRealByForm, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaResultadosCoincid(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaResultadosCoincid, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetBusquedaConcidenciaXNombre(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetBusquedaConcidenciaXNombre, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  /*busqueda a demanda*/
  BusquedaADemanda(data: any): Promise<any>{
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlBusquedaADemandal, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetBusquedaConcidenciaXNombreDemanda(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetBusquedaConcidenciaXNombreDemanda, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetBusquedaConcidenciaXNumeroDocDemanda(data: any): Promise<any> {
    
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetBusquedaConcidenciaXNumeroDocDemanda, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetBusquedaConcidenciaXDoc(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetBusquedaConcidenciaXDoc, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  AnularClienteResultado(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlAnularClienteResultado, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  BusquedaConcidenciaXDocXName(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlBusquedaConcidenciaXDocXName, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
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

  GetResultadoCoincidenciasPen(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetResultadoCoincidenciasPen, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetHistorialEstadoCli(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetHistorialEstadoCli, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  
  // GetConfiguracionCorreos(data: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.laft.post(this.core.config.rest.urlGetConfiguracionCorreos, data).subscribe((response) => {
  //         return resolve(response);
  //       });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // }

  getListaRecurseProfile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaRecurseProfile, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  getListaRecurseProfileHistory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaRecurseProfileHistory, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  getListaHistoryUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaHistoryUser, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  updateResourceProfile(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateResourceProfile, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  DeleteAdjuntosInformAlerta(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlDeleteAdjuntosInformAlerta, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getDeleteAdjuntos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetDeleteAdjuntos, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  LeerDataExcel(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlLeerDataExcel, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  ObtenerPlantillaCotizacion(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlObtenerPlantillaCotizacion, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  ObtenerPlantillaEs10(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlObtenerPlantillaEs10).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  GetKriListContratantes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetKriListContratantes).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetSetearDataExcel(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetSetearDataExcel, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetListaActividadEconomica(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaActividadEconomica, data).subscribe((response) => {
          return resolve(response);

        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetRegistrarDatosExcelGC(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegistrarDatosExcelGC, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


  GetValidarExisteCorreo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetValidarExisteCorreo, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetUpdUsuarioEncriptado(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetUpdUsuarioEncriptado, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetValidarHash(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetValidarHash, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  ValidarFechaHash(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlValidarFechaHash, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetInsertaHistorialUsuario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetInsertaHistorialUsuario, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaEmpresas(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaEmpresas, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  GetListaResultadoProveedorContraparte(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaResultadoProveedorContraparte, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

    GetListaOtrosClientes(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaOtrosClientes, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  GetListaInformes(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaInformes,data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  UpdInformes(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdInformes, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getCorreo_OC(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlgetCorreo_OC).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
  GetKriListZonasGeograficas(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetKriListZonasGeograficas).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  UpdActualizarCorreoOC(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdActualizarCorreoOC, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  ActulizarContrasenaEncriptada(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlActulizarContrasenaEncriptada, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  UpdRutaComplementos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdRutaComplementos, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  EnvioCorreoComplementoSinSennal(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlEnvioCorreoComplementoSinSennal, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getCorreoCustomAction(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetCorreoCustomAction, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getCuerpoCorreo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetCuerpoCorreo, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }


  
  GetRegistrarDatosExcelRegistronegativo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegistrarDatosExcelRegistronegativo, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  GetRegistrarDatosExcelEs10(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegistrarDatosExcelEs10, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetRegistrarDatosActividadEconomica(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegistrarDatosActividadEconomica, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  

  
  GetListaRegistroNegativo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaRegistroNegativo, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  GetListaEs10(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetListaEs10, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetRegistrarDatosZonaGeografica(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetRegistrarDatosZonaGeografica, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetEliminarArchivo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlGetEliminarArchivo, data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  

  getDeleteRegistrosNegativos(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlgetDeleteRegistrosNegativos).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  getListProveedor(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListProveedor).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  getInformeN1(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlgetInformeN1, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  UpdateRiesgo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlUpdateRisgo, data).subscribe(response => {
          return resolve(response)
        })
      } catch (error) {
        return reject(error)
      }
    })

  }

  

  GetListaGeograficaRiesgo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListaGeograficaRiesgo).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  
  GetListaClientesRiesgo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListaClienteRiesgo).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  GetListaProductoRiesgo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlGetListaProductoRiesgo).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }


}
