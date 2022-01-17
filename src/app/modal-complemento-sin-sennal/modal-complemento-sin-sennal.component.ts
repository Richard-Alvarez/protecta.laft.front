import { Component, OnInit,Input } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-modal-complemento-sin-sennal',
  templateUrl: './modal-complemento-sin-sennal.component.html',
  styleUrls: ['./modal-complemento-sin-sennal.component.css']
})
export class ModalComplementoSinSennalComponent implements OnInit {
  @Input() reference: any;
  selectedItems:any=[{item_id: 3, item_text: 'Enrique Loza Loza'}]
  dropdownList = [];
  dropdownSettings:IDropdownSettings={ 
  // "singleSelection": false,
  // "defaultOpen": false,
  // "idField": "item_id",
  // "textField": "item_text",
  // "selectAllText": "Select All",
  // "unSelectAllText": "UnSelect All",
  // "enableCheckAll": true,
  // "itemsShowLimit": 3,
  // "allowSearchFilter": true,
  // "limitSelection": -1
};

  constructor() { }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Ingrid Jimenez Gaita' },
      { item_id: 2, item_text: 'Susan Sánchez Rodríguez' },
      { item_id: 3, item_text: 'Enrique Loza Loza' },
      { item_id: 4, item_text: 'Monica Gutierrez' },
      { item_id: 5, item_text: 'Juan Luis Valdiviezo' }
    ];
    this.dropdownSettings = {
     
      "singleSelection": false,
      "defaultOpen": false,
      "idField": "item_id",
      "textField": "item_text",
      "selectAllText": "Select All",
      "unSelectAllText": "UnSelect All",
      "enableCheckAll": true,
      "itemsShowLimit": 3,
      "allowSearchFilter": true,
      "limitSelection": -1
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  Save(){
    console.log("selectedItems",this.selectedItems)
  }
  closeModal(id: string) {
    
    this.reference.close(id);
  }
}
