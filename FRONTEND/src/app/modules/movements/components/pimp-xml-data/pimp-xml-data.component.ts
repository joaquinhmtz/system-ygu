import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pimp-xml-data',
  templateUrl: './pimp-xml-data.component.html',
  styleUrls: ['./pimp-xml-data.component.css']
})
export class PimpXmlDataComponent implements OnInit {
  
  @Input()
  get setXmlData(): any {
    return this._setXmlData;
  }
  set setXmlData(setXmlData: any) {
    this._setXmlData = setXmlData === undefined ? { } : setXmlData;
  }
  _setXmlData = {
    enterprise:{
      name: undefined,
      rfc: undefined
    },
    client:{
      name: undefined,
      rfc: undefined
    },
    paymentMethod: undefined,
    total: 0
  };
  
  ngOnInit(): void {
  }

}
