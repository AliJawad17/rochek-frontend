import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { IfStmt } from '@angular/compiler';
import { QuotationsService } from 'src/app/dashboard/services/quotations.service';
import { PriceService } from '../services/price.service';
import { style } from '@angular/animations';
import { SignaturePad } from 'angular2-signaturepad';
import { CustomerService } from '../services/customer.service';
import { ROIService } from '../services/roi.service';
import html2canvas from 'html2canvas';
// import * as jspdf from 'jspdf';
import { jsPDF } from 'jspdf'
import { environment } from 'src/environments/environment';
import { PDFService } from '../services/pdf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {
  step: any = 1;
  price:any ;
  userId:any;
  autoHeight;
  optionData: any = [];
  roiData = [];
  minOpperlakte;
  customerName: any;
  currentCustomer = {};
  customerId:any;
  disableCustomer;
  priceExisted = false;
  updatePrice = false;
  showAlert = false;
  isShow = false;
  signatureImage = false;
  showROIResult = false;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('test6',{static:true}) el!: ElementRef<HTMLImageElement>;
  signaturePadOptions: Object = { 
    'minWidth': 4,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'backgroundColor': '#e8e4e4',
    'margin-top': '20px'
  };
  alertMessage;
  rowIndex;
  titleArray = [];
  selectedTitle = '';
  selectedPrice = 0;
  finalPrice = 0;
  showSelectedTitle = true;
  dataURL = '';
  value=[false, false, false, false];
  directionSum = {east: 0, west:0, north:0, south:0};
  singleEntry:boolean = false;
  newPrice:boolean = false;
  title;
  classification: '';
  fSum; dSum; f19;
  newItems = [];
  // optionsTable = {
  //   columnDefs:[
  //     { field: "Option " , editable: false},
  //     { field: 'Oppervlakte', editable: false },
  //     { field: 'Value', editable: true },
  //     { field: 'sum', editable: false },
  //   ],
  //   rowData:[]
  // };
  sidesTables:any= [
    {
    title: 'East',
    classification: 'Classification',
    isShowHide: false,
    rowData:[],
    columnDefs:[],
    CalDefaultCol:[],
    pinnedBottomRowData: [],
    id:'CalEastTable'
  },
    {
    title: 'West',
    isShowHide: false,
    rowData:[],
    columnDefs:[],
    CalDefaultCol:[],
    pinnedBottomRowData: [],
    id:'CalWestTable'
  },
    {
    title: 'North',
    isShowHide: false,
    rowData:[],
    columnDefs:[],
    CalDefaultCol:[],
    pinnedBottomRowData: [],
    id:'CalNorthTable'
  },
    {
    title: 'South',
    isShowHide: false,
    rowData:[],
    columnDefs:[],
    CalDefaultCol:[],
    pinnedBottomRowData: [],
    id:'CalSouthTable'
  }

];


  public modules: Module[] = AllModules;
  isEastChecked: false;
    isNorthChecked: false;
    isWestChecked: false;
    isSouthChecked: false;
  optionsTable:any =[ ]

  gridApi = [];
  gridColumnApi;

  rowSelection;
  priceRowData;
  priceColData;
  priceDefaultCol;

  northCalcRowData;
  northCalcColData;
  northCalcDefaultCol;
  EastCalcColData;
  westCalcColData;
  southCalcColData;



  newForm: FormGroup;
  northForm: FormGroup;
  calculationForm: FormGroup;
  titleSelect: FormGroup;
  obj: Object;
  array = new Array(19);
  roiHeading = new Array(4);
  getRowStyle;
  getRowStyleResult;
  // checkoutForm = new FormGroup({
  //   // form1: new FormGroup({north: new FormControl(''), south: new FormControl(''),
  //   // east: new FormControl(''), west: new FormControl(''),}),
  //   // form2: new FormGroup({north: new FormControl(''), south: new FormControl(''),
  //   // east: new FormControl(''), west: new FormControl(''),}),
  //   north: new FormControl(''),
  //   south: new FormControl(''),
  //   east: new FormControl(''),
  //   west: new FormControl(''),
  // });

  constructor(
    private formBuilder: FormBuilder,
    private quotationsService: QuotationsService,
    private priceService: PriceService,
    private customerService: CustomerService,
    private roiService: ROIService,
    private pdfService: PDFService,
    private router: Router,
    ) {
   
    // this.columnDefs = [
    //   {
    //     field: 'athlete',
    //     cellRenderer: 'btnCellRenderer',
    //     cellRendererParams: {
    //       clicked: function(field: any) {
    //         alert(`${field} was clicked`);
    //       }
    //     },
    //     minWidth: 150,
    //   }
    //   // [...]
    //   ];
      
    //   this.frameworkComponents = {
    //   btnCellRenderer: BtnCellRenderer
    // };
    this.sidesTables = this.sidesTables.map(x =>{
      x.columnDefs = [
        { 
          field: "classification",
          editable: false, 
        },
        { 
          field: 'Filmtype',
          editable: false,
         },
        { 
          field: 'Number',
          editable: false, 
        },
        { 
          field: 'H',
          editable: false, 
      
        },
        {
          field: 'W',
          editable: false,
        },
        {
          field: 'Options',
          editable: false,
        },
        {
          field: 'Oppervlakte',
          editable: false,
        },
        
      ];
      x.pinnedBottomRowData=[
        {
          classification: x.title,
          Filmtype: 'Total',
          Number: '',
          H: '',
          W: '',
          Options: '',
          Oppervlakte: '',
          
        },
      ];
      x.rowData =[
        // {
        //   // classification: "classification",
        //   // Filmtype: "Testing",
        //   // Number:"sfcdsfv",
        //   // H: "Testing",
        //   // W: "Testing",
        //   // Options: "Testing",
        //   // Oppervlakte: "Testing",
        // }
      ]
      x.CalDefaultCol = {
        
        minWidth: 80,
        flex: 1
        
      };

        return x;
    })

    this.rowSelection = 'single';
    
    this.priceRowData = [
      {
        calculationOption: '80T',
        Oppervlakte: '372.12 m²',
        Value: 10,
        sum: '€ 34,235.00',

      },
      {
        calculationOption: 'Mary',
        Oppervlakte: '37.12 m²',
        Value: 10,
        sum: '€ 34,235.00',


      },
    ];
   
    this.priceDefaultCol = {
      flex: 1,
      minWidth: 180,
      editable: true,
      resizable: true,
      responsive: true,
    };
    this.northCalcDefaultCol = {
      flex: 1,
      minWidth: 180,
      editable: true,
      resizable: true,
      responsive: true,
    };
  }



  // MY WORK ALI JAWAD

  arr = ['filmtype', 'typeBeglazing', 'g_waardeVoormontage', 'toetreding_zonnewarmte',
'coeffecientOfPerformance', 'g_waarde_Na_montage', 'u_waarde_Voor_montage',
'u_waarde_Na_montage'];

  arr2 = ['Type beglazing', 'g-waarde (warmtetoetreding)', 'Oppervlakte beglazing',
'Toetreding zonnewarmte /m² ', 'Toetreding zonne-energie', 'Aantal zonuren1',
'g-waarde (glas+glasfilm)', 'Toetreding zon in Watt/m² ', 'Zontoetreding na montage', 
'Zonuren per dag', 'Verlaging warmtetoetreding ', 'Verlaging koellast', 'Reductie verlies', 
'Verlies Watt/m² K', 'Verlies Watt/m² na montage', 'Uren per dag', 'Verlaging warmteverlies', 
'Aantal dagen/jaar', 'Verlaging warmte verlies/ jaar'];
  directions = ['north', 'south', 'east', 'west'];
  mainArray = new Array(4);
  endResult = new Array();
  data;
  ngOnInit(): void {
    // localStorage.setItem('customerName', '');
    // localStorage.setItem('customerId', '');
    // localStorage.setItem('customerId', '60d489c1a1fb221564064cd9');
    this.customerName = localStorage.getItem('customerName');
    this.customerId = localStorage.getItem('customerId');
    // this.quotationsService.currentMessage.subscribe(res=>{
    //   this.data = res;
    //   if (this.data.id){
    //     console.log('sharing dtaa exists', this.data.id);
    //     this.customerId = this.data.id;
    //     this.customerName = this.data.fullname;
    //     localStorage.setItem('customerName', this.data.fullname);
    //     localStorage.setItem('customerId', this.data.id);
    //   }
    //   console.log('sharing dtaa', this.data);
    // })
    // console.log('name', this.customerName, this.customerId);
    if(this.customerName == '' || this.customerName == null){
      this.step = 0;
      this.disableCustomer = false;
    }else{
      this.step = 1;
      this.disableCustomer = true;
      this.getCustomerData();
      this.getAllData();
      this.getPriceData();
      this.getROIData();
      
      // console.log('check,', this.roiData);
    }

    this.autoHeight = "autoHeight";
    this.titleSelect = this.formBuilder.group({
      title: ['', [Validators.required]]
    })
    this.calculationForm = this.formBuilder.group({
      classification: ['', Validators.required],
      filmType: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      number: ['', Validators.required],
      option:'',
      totalEntries: ['']
    });
    // this.userId = sessionStorage.getItem('id');
    this.customerId = localStorage.getItem('customerId');
    // this.newForm = new FormGroup({fg: new FormGroup({})});
    this.newForm = this.formBuilder.group({
      tickets: this.formBuilder.array([
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
        this.addFormgroup(),
      ])
    });

    this.northForm = this.formBuilder.group({
      nor: this.formBuilder.array([
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(), this.addNorthFormgroup(), this.addNorthFormgroup(),
        this.addNorthFormgroup(),
        // this.addFormgroup(),
      ])
    });
    
  }
  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
    // let url = this.signaturePad.toDataURL("image/png");
    // console.log('sign=============================================', url);
  }

  drawComplete(data1) {
    this.dataURL = this.signaturePad.toDataURL("image/png");
    
    // const data = atob(this.dataURL.substring('data:image/png;base64,'.length)),
    // asArray = new Uint8Array(data.length);

    // for (var i = 0, len = data.length; i < len; ++i) {
    //   asArray[i] = data.charCodeAt(i);
    // }

    // const blob = new Blob([asArray], { type: 'image/png' });
    // console.log(blob);
  }

  drawStart() {
    this.newPrice = true;
    let url = this.signaturePad.toDataURL("image/png");
    // console.log('begin drawing', url);
  }
  addCustomer(){
    
    this.customerService.create({fullname: this.customerName}).subscribe(res=>{
      // console.log('customer created', res);
      localStorage.setItem('customerName', this.customerName);
      localStorage.setItem('customerId', res['result']['_id']);
      this.customerId = res['result']['_id'];
      this.step = 1;
    })
  }

  getCustomerData(){
    // console.log('found cutomer called');
    this.customerService.find(this.customerId).subscribe( (res) =>
    {
      this.currentCustomer = res['result'][0];
      this.dataURL = res['result'][0]['signature'];
      if(res['result'][0]['finalPrice'] == '') {
        this.finalPrice = 0;
      }else{
        this.finalPrice = res['result'][0]['finalPrice'];
      }

      if(res['result'][0]['selectedOption'] != ''){
        this.selectedTitle = res['result'][0]['selectedOption'];
        this.titleSelect.patchValue({title: this.selectedTitle});
      }
      
      if(this.dataURL){
        this.signatureImage = true;
      }else{
        this.signatureImage = false;
      }
    })
  }

  getPriceData(){
    this.optionsTable = [];
    this.titleArray = [];
    this.priceService.findAll(this.customerId).subscribe(res=>{
      let arr = [];
      for(let i=0; i<res['result'].length; i++){
        // console.log('in price data');
        let a = [];
        a[0] = res['result'][i]['T80'];
        a[1] = res['result'][i]['V14'];
        // (Math.round(res['result'][i]['V14'] * 1000) / 1000).toFixed(3);
        a[2] = res['result'][i]['Werkuren'];
        a[3] = res['result'][i]['Reisuren'];
        a[4] = res['result'][i]['Klimmateriaal'];
        a[5] = {calculateOption:'Total', Oppervlakte:'', Value:'', Sum: res['result'][i]['totalSum']};
        let title = res['result'][i]['title'];
        let option = res['result'][i]['option']
        let obj = this.createOptionObject(a, title, option);
        this.titleArray.push({title: title, price: res['result'][i]['totalSum']});
        this.optionsTable.push(obj);
        this.priceExisted = true;
      }
      if(this.updatePrice == true) {
        // console.log('options table length', this.optionsTable.length);
        for(let i=0;i<this.optionsTable.length;i++){
          // console.log('update price called outside', this.selectedTitle, this.optionsTable[i].title);
          if (this.selectedTitle == this.optionsTable[i].title){
            this.finalPrice = this.optionsTable[i].rowData[5]['Sum'];
            this.currentCustomer['finalPrice'] = this.finalPrice;
            // console.log('update price called', this.currentCustomer);
            this.customerService.update(this.customerId, this.currentCustomer).subscribe(resp=>{
              this.updatePrice = false;
            })
          }
        }
      }
      
      // console.log('price response', this.optionsTable);
      // console.log('directionSum', this.directionSum);
    })
  }

  getAllData(){

    this.quotationsService.findAll('north', this.customerId).subscribe(res=>{
      this.sidesTables[2].rowData = res['result'];
      this.directionSum.north = this.calculateOppervlakte(this.sidesTables[2].rowData, 2);
    })
    this.quotationsService.findAll('south', this.customerId).subscribe(res=>{
      this.sidesTables[3].rowData = res['result'];
      this.directionSum.south = this.calculateOppervlakte(this.sidesTables[3].rowData, 3);
    })
    this.quotationsService.findAll('east', this.customerId).subscribe(res=>{
      this.sidesTables[0].rowData = res['result'];
      this.directionSum.east = this.calculateOppervlakte(this.sidesTables[0].rowData, 0);
    })
    this.quotationsService.findAll('west', this.customerId).subscribe(res=>{
      this.sidesTables[1].rowData = res['result'];
      this.directionSum.west = this.calculateOppervlakte(this.sidesTables[1].rowData, 1);
    })
    // console.log('side table', this.sidesTables);
  }

  getROIData(){
    this.roiService.find(this.customerId).subscribe((res)=>{
      if(res['results']){
        this.roiData = res['results'];
        // console.log(res);
        let obj = {north: this.roiData[0], south: this.roiData[1], east: this.roiData[2], west:this.roiData[3]};
        this.calculate(obj);
      }
    })
  }
  
  calculateOppervlakte(data, index){
    let sum=0;
    for(let i=0;i<data.length;i++){
      sum = sum + data[i]['Oppervlakte'];
      // console.log('Oppervlakte', data[i]['Oppervlakte']);
    }
    this.sidesTables[index].pinnedBottomRowData[0].Oppervlakte = sum;
    // console.log('minOpperlakte', this.minOpperlakte);
    return sum;
  }

  addFormgroup():FormGroup {
    return this.formBuilder.group({
      north:['', [Validators.required]],
      south:['', [Validators.required]],
      east: ['', [Validators.required]],
      west: ['', [Validators.required]],
    });
  }
  addNorthFormgroup():FormGroup {
    return this.formBuilder.group({
      north:'',
      facade:''
    });
  }
  get f() { return this.newForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  //GETTERS OF NORTH FORM
  get getNorthF() { return this.northForm.controls; }
  get getNorthT() { return this.getNorthF.nor as FormArray; }
  // END


  calculateGrid(params, index){
    
    this.sidesTables[index]["tableGripObj"] = { data :params.api};// remove no handle
    // this.gridApi.push({ data :params.api});// remove no handle
    this.gridColumnApi = params.columnApi;
  }
  onPriceGridReady(params, index){
    this.optionsTable[index]["priceObj"] = { data :params.api};// remove no handle
    // this.gridApi.push({ data :params.api});// remove no handle
    this.gridColumnApi = params.columnApi;
  }
  onGridReady(params) {
    // this.sidesTables[index]["tableGripObj"] = { data :params.api};// remove no handle
    this.gridApi.push({ data :params.api});// remove no handle
    this.gridColumnApi = params.columnApi;
  }
  async onBtExport() {
    // console.log('step called', this.optionsTable);
    let data;
    let sideData=[];
    let pdfPrint = false;
    let dataCount = 0, eiaLogoURL;
    this.showAlert = false;
    if(this.step == 1){
      for(let i=0;i<this.sidesTables.length;i++){
        if(this.sidesTables[i].rowData.length > 0){
          dataCount++;
          let obj1 = {title: this.sidesTables[i]['title'], rowData: this.sidesTables[i].rowData};
          sideData.push(obj1);
        }
      }
      if(dataCount>0){
        pdfPrint = true;
        data = {step: this.step, data: sideData, 
          customerName: this.customerName};
      }else{
        this.showAlert = true;
        this.alertMessage = 'PLEASE ENTER CALCULATION DATA!'
      }
      // data = {step: this.step, data: this.sidesTables}
    }else if (this.step == 2){
      // console.log('optionssssssss', this.optionsTable);
      if(this.optionsTable.length>0 && this.priceExisted){
        let priceData = [];
        for(let i=0;i<this.optionsTable.length;i++){
          let d = {
            option: this.optionsTable[i]['option'],
            title: this.optionsTable[i]['title'],
            rowData: this.optionsTable[i]['rowData'],
            isModified: this.optionsTable[i]['isModified']
          };
          // console.log('row', d.rowData);
          d.rowData[0]['Oppervlakte'] =(Math.round(d.rowData[0]['Oppervlakte'] * 1000) / 1000).toFixed(3)
          d.rowData[1]['Oppervlakte'] =(Math.round(d.rowData[1]['Oppervlakte'] * 1000) / 1000).toFixed(3)
          priceData.push(d);
        }
        data = {step: this.step, data: priceData, selected: this.selectedTitle, image: this.dataURL
          , customerName: this.customerName};
        pdfPrint = true;
      }else{
        this.showAlert = true;
        this.alertMessage = 'PLEASE ENTER PRICE DATA!'
      }
      
    }else if (this.step == 4){
      pdfPrint = true;
      for(let j=0;j<4;j++){
        if(this.roiHeading[j] == '' || this.mainArray[j].length != 22){
          pdfPrint = false;
        }
      }
      if(pdfPrint){
        let arr = {heading: this.roiHeading, mainArray: this.mainArray, endResult: this.endResult, coldefs: this.coldefs}
        data = {step: this.step, data: arr, price: this.finalPrice, customerName: this.customerName}
      }else{
        this.showAlert = true;
        this.alertMessage = 'PLEASE ENTER ROI DATA!'
      }
      
    }else if (this.step == 5){
      // let urlnew, respo;
      // respo = await this.toDataURL('../../../assets/images/EIA_logo.png', (url1) => {
      //   eiaLogoURL = url1;
      // })

      // var base64 = this.getBase64Image(document.getElementById("logoImage"));
      if(this.finalPrice>0){
        
        // console.log('entered in step 5');
        data = {step: this.step, data: this.finalPrice*0.11, customerName: this.customerName};
        pdfPrint = true;
      }else{
        pdfPrint = false;
        this.showAlert = true;
        this.alertMessage = 'PLEASE ENTER ROI PRICE!'
      }
      
      
    }
    if(pdfPrint){
      // if (this.step == 5){
      //   data.url = base64;
      // }
      // console.log('in pdf print', this.customerId, data);
      this.customerService.createPdf(this.customerId, data).subscribe(res=>{
        // console.log(res);
        let url = 'http://localhost:3000/'+res['fileName'];
        // let url = 'public/'+res['fileName'];
        // console.log(url);
        window.open(url , '_blank');
        pdfPrint = false;
      })
    }
    
    // this.gridApi[0].data.exportDataAsExcel();


    // await this.createPdfData();
    // let element = document.getElementById('test6');
    // console.log('element', element);
    // html2canvas(element).then(async (canvas)=> {
    //   var data = canvas.toDataURL('image/png');
    //   var doc = new jsPDF("p", "mm", "a4");
    //   console.log('canvas height and wodth', canvas.height, canvas.width);
    //   var imageHeight = canvas.height*208/canvas.width;
    //   doc.addImage(data, 0, 0, 208, imageHeight);
    //   doc.save('image.pdf');
    // });


    // let element = document.getElementById('test6');
    // html2canvas(element).then(async (canvas)=> {
    //   const data = canvas.toDataURL('image/jpeg');
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const imageProps = pdf.getImageProperties(data);
    //   const pdfW = pdf.internal.pageSize.getWidth();
    //   const pdfh = (imageProps.height*pdfW) / imageProps.width;
    //   pdf.addImage(data, 'PNG', 0, 0, pdfW, pdfh);
    //   pdf.save('image.pdf');
    // });
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("../../../assets/images/EIA_logo.png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
    return xhr;
}

  submit() {

    let object = {step: 5, data:this.finalPrice*0.11};
    this.customerService.createPdf(this.customerId, object).subscribe((res)=>{
      // console.log('submit response', res);
    })
    let count = 0;
    let checkROI = true;
    for(let i=0;i<this.sidesTables.length;i++){
      if(this.sidesTables[i].rowData.length > 0){
        count++;
        // let obj1 = {title: this.sidesTables[i]['title'], rowData: this.sidesTables[i].rowData};
        // sideData.push(obj1);
      }
    }
    for(let j=0;j<4;j++){
      if(this.roiHeading[j] == '' || this.mainArray[j].length != 22){
        checkROI = false;
      }
    }


    // console.log('entered in submit', this.finalPrice);
    if (this.finalPrice==0){
      this.showAlert = true;
      this.alertMessage = 'Please Enter Correct Price'
    }else if(this.optionsTable.length == 0){
      this.showAlert = true;
      this.alertMessage = 'Please Enter Price Data'
    }else if(count == 0){
      this.showAlert = true;
      this.alertMessage = 'Please Enter Calculation Data'
    }else if(checkROI == false){
      this.showAlert = true;
      this.alertMessage = 'Please Enter ROI Data'
    }else{
      this.showAlert = false;
      this.alertMessage = 'Quotation Submitted Successfully.'
      localStorage.setItem('customerId', '');
      localStorage.setItem('customerName', '');
      this.router.navigate(['./dashboard/addquotations']);
    }
    // }else{
    //   this.showAlert=false;
    //   console.log('entered in else', this.obj);
    //   let roi = {obj:this.obj, customerId: this.customerId};
    //   //TODO CHECKK WHETHER OBJ HAS CORRRECT DATA OR NOT???
    //   this.roiService.create(roi).subscribe((res)=>{
    //     console.log('retuning response of roi create', res);
    //   })
    // }
    // this.step = this.step + 1
  }
  priv() {
    this.step = this.step - 1;
    this.setCheckedValue(this.step);
  }
  setCheckedValue(step){
    if(step == 1){
      for(let i=0;i<this.sidesTables.length;i++){
        if(this.sidesTables[i].isShowHide == true){
          this.value[i]=true;
        }else{
          this.value[i]=false;
        }
      }
    }else if(this.step==2){
      this.showSelectedTitle = true;
    }else if(this.step == 4){
      this.setEndGrid(this.fSum, this.dSum, this.f19);
      this.showSelectedTitle = false;
    }else{
      this.showSelectedTitle = false;
    }
  }
  steps(crntTarget: any, val: any) {
    this.step = val;
    this.setCheckedValue(this.step);
    if (this.step == val) {
      crntTarget.target.classList.add('actveStep')
    }
    // if(this.step==2){
    //   // console.log('price called', this.selectedTitle, this.showSelectedTitle);
    //   this.showSelectedTitle = true;
    // }else if(this.step == 4){
    //   this.setEndGrid(this.fSum, this.dSum, this.f19);
    //   this.showSelectedTitle = false;
    // }
  }

  checkboxChecked(event , value){
    let index  = this.sidesTables.findIndex(x =>  x.title === value);
    if(index != -1 ){
    this.sidesTables[index].isShowHide = event.target.checked
   }
   let direction = value.toString();
  //  this.sidesTables[2]['tableGripObj'].data.applyTransaction({
  //       add: this.sidesTables[0].rowData,
  //    });

  }

  setTitle(i){
    this.singleEntry = false;
    this.title = this.sidesTables[i].title;
    
  }

  //MY CHANGE ALI JAWAD
  onProceed(): void {
    var north = {};
    var south = {};
    var east = {};
    var west = {};
    for (var i = 0; i < this.newForm.value['tickets'].length; i++) {
      var temp = this.newForm.value['tickets'][i];
      var val = this.arr[i];
      north[val] = temp['north'];
      south[val] = temp['south'];
      east[val] = temp['east'];
      west[val] = temp['west'];
    }
    this.obj = {north: north, south: south, east: east, west: west};
    this.step++;
    
    this.calculate(this.obj);
  }

  onKey(event: any) { // without type info
    this.price = event.target.value;
    // this.setEndGrid();
  }

  singleDataEntry(sides, index){
    this.title = sides.title;
    this.singleEntry = true;
  }
  bulkInsert(sides, index){
    
    let entries;
    // console.log('outside', this.calculationForm.value.totalEntries);
    if(this.minOpperlakte>0  ){
      if(this.singleEntry || this.calculationForm.value.totalEntries==null || 
        this.calculationForm.value.totalEntries==''){
        entries = 1;
        // console.log('2single', entries);
      }else {
        entries = this.calculationForm.value.totalEntries;
        // console.log(' multiple single', entries, this.calculationForm.value.totalEntries);
      }
      // console.log('entries', entries, this.calculationForm.value.totalEntries);
      let formula = this.calculationForm.value.height*this.calculationForm.value.weight;
      if(formula<this.minOpperlakte){
        formula = this.calculationForm.value.number*this.minOpperlakte;
      }
      
      let obj = {
        userId:this.customerId,
        classification:this.calculationForm.value.classification,
        Filmtype:this.calculationForm.value.filmType,
        Number:this.calculationForm.value.number,
        H:this.calculationForm.value.height,
        W:this.calculationForm.value.weight,
        Options:'',
        Oppervlakte:formula
      }
      for(var i=0;i<this.sidesTables.length;i++){
        if(this.sidesTables[i] == sides){
          let length = this.sidesTables[i].rowData.length;
          for(let j=length;j<length+entries;j++){
            this.sidesTables[i].rowData[j] = obj;
            this.newItems.push(obj);
          }
        }
      }
    // if(this.minOpperlakte>0  ){
      if(this.calculationForm.valid == false){
        this.showAlert = true;
        this.alertMessage = 'PLEASE ENTER REQUIRED FIELDS PROPERLY.';
      }else{
        this.showAlert = false;
        // console.log('newwwwww', this.newItems);
        this.quotationsService.create(this.newItems, this.title).subscribe(res=>{
          // console.log('ressssssss', res);
        })
        this.sidesTables[index]['tableGripObj'].data.applyTransaction({
          add: this.newItems, 
        });
        let oldSum = this.getOldSum(this.sidesTables[index].title);
        let sum = this.calculateOppervlakte(this.sidesTables[index].rowData, index);
        this.setDirectionSum(sum, index);
        // console.log(this.sidesTables, this.directionSum);
        this.sidesTables[index]['tableGripObj'].data.refreshCells();
        this.updatePriceTable(index, sum, oldSum);
        // console.log('options', this.sidesTables[index]['tableGripObj'].data);
      }
    }else{
      this.showAlert = true;
      this.alertMessage = 'Please Enter Min Oppervlakte Ruit Value';
    }
    
    this.newItems = [];
    this.calculationForm.reset();
  }

  setDirectionSum(sum, index){
    if(index==0){
      this.directionSum.east = sum;
    }else if(index==1){
      this.directionSum.west = sum;
    }else if(index==2){
      this.directionSum.north = sum;
    }else if(index==3){
      this.directionSum.south = sum;
    }
  }

  dismissModal(){
    this.showAlert = false;
  }

  loadGrid(){
    for(let i=0; i<this.sidesTables.length; i++){
      this.gridApi[i].data.applyTransaction({
        add: this.sidesTables[i].rowData,
      });
    }
  }

  calculate(obj) {

    var tArray = [obj['north'], obj['south'], obj['east'], obj['west']];
    var changeValue = [1.29, 5.69, 7.58, 6.44];
    var fSum = 0, dSum=0, f19=0, f27=0;
    // for (var k=0;k<this.arr2.length;k++) {
    //   this.array[k] = this.arr2[k];
    // }
    let sumOfDirections = [this.directionSum.north,this.directionSum.south, this.directionSum.east,
    this.directionSum.west];
    
    for (var i=0;i<this.mainArray.length;i++) {
      this.mainArray[i] = new Array();
    }

    // THIS LOOP IS CALCULATING AND MANAGING DATA FOR ROI RESULT GRIS
    // console.log('start main array',  tArray)
    for (var i=0;i<this.mainArray.length;i++) {

      this.roiHeading[i] = tArray[i]['filmtype'];
      var obj1 = {title: this.arr2[0], direction:tArray[i]['typeBeglazing'], facade:'',
      result: ''};
      var obj2 = {title: this.arr2[1], direction:tArray[i]['g_waardeVoormontage'], 
      facade:'', result: ''};
      var obj3 = {title: this.arr2[2], direction:(Math.round(sumOfDirections[i] * 1000) / 1000).toFixed(3), facade:'',
      result: ''};
      // calculate obj4 result
      var regex = /\d+/g;
      var string = tArray[i]['toetreding_zonnewarmte'];
      var string1 = tArray[i]['g_waardeVoormontage'];
      // var matches = string.match(regex);
      // var matches1 = string1.match(regex);
      // var resValue = (+matches)*(+matches1);
      // var res = ((+matches)*(+matches1)).toString() + "Watt";
      
      var resValue = (+string)*(+string1);
      var res = ((+string)*(+string1)).toString() + "Watt";


      var roundResult = Math.round(resValue/1000);
      var totalResult1 = Math.round(roundResult * changeValue[i]);
      // console.log('string and string1', string, string1);
      // console.log('resValue and res', resValue, res);
      // console.log('roundResult and totalResult1', roundResult, totalResult1);
      var obj4 = {title: this.arr2[3], direction:tArray[i]['toetreding_zonnewarmte'], 
      facade:tArray[i]['g_waardeVoormontage'], result: res+"/m²"};
      var obj5 = {title: this.arr2[4], direction:res, facade:roundResult+" KWth",
      result: ''};
      var obj6 = {title: this.arr2[5], direction:changeValue[i], facade:roundResult+" KWth",
      result: totalResult1+" KWth"};
      
      var obj7 = {title: 'Situatie na installatie', direction:'', facade:'',
      result: ''};
      var obj8 = {title: 'Koelen', direction:'', facade:'',
      result: ''};
      var obj9 = {title: this.arr2[6], direction:tArray[i]['g_waarde_Na_montage'], facade:'',
      result: ''};
      // calculate obj8 result
      var regex = /\d+/g;
      var string2 = tArray[i]['toetreding_zonnewarmte'];
      var string3 = tArray[i]['g_waarde_Na_montage'];

      // var matches = string.match(regex);
      // var matches2 = string1.match(regex);
      // var resValue = (+matches)*(+matches2);
      // var res10 = ((+matches)*(+matches2)).toString() + "Watt";
      var resValue = (+string2)*(+string3);
      var res10 = ((+string2)*(+string3)).toString() + "Watt";


      var roundResult = Math.round(resValue/1000);
      var totalResult2 = Math.round(roundResult * changeValue[i]);
      // console.log('string and string1', string2, string3);
      // console.log('resValue and res10', resValue, res10);
      // console.log('roundResult and totalResult2', roundResult, totalResult2);
      var obj10 = {title: this.arr2[7], direction:tArray[i]['toetreding_zonnewarmte'], 
      facade:tArray[i]['g_waarde_Na_montage'], result: res10+"/m²"};
      var obj11 = {title: this.arr2[8], direction:res10, facade:roundResult+" KWth",
      result: ''};
      var obj12 = {title: this.arr2[9], direction:changeValue[i], facade:roundResult+" KWth",
      result: totalResult2+" KWth"};

      // var dir13 = (-(+matches2)/(+matches1))+1;
      var dir13 = ((-(+string3)/(+string1))+1)*100;

      var obj13 = {title: this.arr2[10], direction:(Math.round(dir13 * 1000) / 1000).toFixed(3)+'%', facade:(totalResult1+totalResult2)+" KWth per Dag",
      result: ''};
      // calculate obj12 result
      regex = /\d+/g;

      // matches = +(totalResult1+totalResult2);
      // string1 = tArray[i]['Coëfficient Of Performance (COP)'];
      var string4 = +(totalResult1+totalResult2);
      dSum = dSum+string4;
      var string5 = tArray[i]['coeffecientOfPerformance'];
      if(i==0){
        f19 = string5;
      }
      
      // var matches3 = string1.match(regex);
      var res12 = ((+string4)*(+string5)).toString() + "kWe";


      // console.log('matches and string1', string4, string1);
      // console.log('matches3 and res12', string5, res12);
      // console.log('roundResult and totalResult2', roundResult, totalResult2);
      var obj14 = {title: this.arr2[11], direction:(totalResult1+totalResult2)+" KWth", 
      facade:tArray[i]['coeffecientOfPerformance'], result: res12};
      var obj15 = {title: this.arr2[12], direction:'', facade:'',
      result: ''};
      var obj16 = {title: 'Verwarmen', direction:'', facade:'',
      result: ''};
      // RESULT REQUIRED AT OBJ14 AND OBJ15
      var string6 = tArray[i]['u_waarde_Voor_montage'];
      var string7 = tArray[i]['u_waarde_Na_montage'];
      // var matches4 = string.match(regex);
      // var matches5 = string2.match(regex);



      var res17 = string6*5*sumOfDirections[i];
      var res18 = string7*5*sumOfDirections[i];
      // console.log('matches4 and matches5', string6, string7);
      // console.log('res17 and res18', res17, res18);
      var obj17 = {title: this.arr2[13], direction:tArray[i]['u_waarde_Voor_montage'], 
      facade:5, result: (Math.round(res17 * 1000) / 1000).toFixed(3)};
      var obj18 = {title: this.arr2[14], direction:tArray[i]['u_waarde_Na_montage'], 
      facade:5, result: res18};
      var obj19 = {title: this.arr2[15], direction:24, facade:'',
      result: ''};
      var res20 = Math.round(((string7-string6)/string6)*100);
      var fac20 = Math.round((res17-res18)*24);
      fSum = fSum+fac20;
      var obj20 = {title: this.arr2[16], direction:(Math.round(res20 * 1000) / 1000).toFixed(3)+'%', facade:fac20+' kWth/dag',
      result: ''};
      var res21 = Math.round((res17-res18)*24*183);
      var obj21 = {title: this.arr2[17], direction:183, facade:res21+' kWth/jaar',
      result: ''};
      var res22 = Math.round((+res21)/(+string5));
      // console.log('res20 and fac20', res20, fac20);
      // console.log('res21 and res22', res21, res22);
      var obj22 = {title: this.arr2[18], direction:'', 
      facade:tArray[i]['coeffecientOfPerformance'], result: res22+' kWe'};
      var test = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11,
      obj12, obj13, obj14, obj15, obj16, obj17, obj18, obj19, obj20, obj21, obj22];
      this.mainArray[i] = test;
    }
    this.fSum = fSum;
    this.dSum = dSum;
    this.f19 = f19;
    // console.log('main array', this.mainArray);
    // THIS IS GIVING CSS PROPERTIES TO SOME ROWS OF THE GRID
    this.setGridStyle();
    this.setEndGrid(fSum, dSum, f19);
    
    
    // var north = obj['north'];
    // var south = obj['south'];
    // var east = obj['east'];
    // var west = obj['west'];
    // for (var i = 0; i < this.array.length; i++) {
    //   this.array[i] = new Array(3);
    // }
    // for (var i = 0; i < this.array.length; i++) {
    //   for (var j = 0; j < this.array[i].length; j++){
    //     this.array[i][j] = '';
    //   }
    // }
    // this.roiHeading[0] = north['Filmtype'];
    // console.log('headin called', this.roiHeading[0]);
    // var a = 'north';
    // this.array[0][0] = north[this.arr3['name']];
    // this.array[1][0] = north['G-waarde (Voor montage)'];
    // this.array[3][1] = north['G-waarde (Voor montage)'];
    // this.array[3][0] = north['Toetreding zonnewarmte /m²'];
    // this.array[3][2] = north['G-waarde (Voor montage)'];// calculate
    // this.array[6][0] = north['G-waarde (Na montage)'];
    // this.array[7][0] = north['Toetreding zonnewarmte /m²'];
    
    // this.array[7][1] = north['G-waarde (Na montage)']; 
    // this.array[7][2] = north['G-waarde (Voor montage)'];//calculate
    // this.array[11][1] = north['Coëfficient Of Performance (COP)'];
    // this.array[13][0] = north['U-waarde (Voor montage)'];
    // this.array[14][0] = north['U-waarde (Na montage)'];
    // this.array[18][1] = north['Coëfficient Of Performance (COP)'];

    // console.log('new object', north);
  }

  setGridStyle() {
    // THIS IS GIVING CSS PROPERTIES TO SOME ROWS OF THE GRID
    
    this.getRowStyle = params => {
      if (params.node.rowIndex === 6) {
          return { background: '#f86c35',  };
      }
      if (params.node.rowIndex === 7) {
        return { background: '#94c6f7',  };
      }
      if (params.node.rowIndex === 14) {
        return { background: '#a0f598',  };
      }
    };
  }

  setEndGrid(fSum, dSum, f19) {
    
    // this.endResult[0] = {title:'Terugverdienmodel', value:''};
    this.endResult[0] = {title:'Verlaging koelkosten3', value:''};
    let val = 0.1593;
    this.endResult[1] = {title:'Energiekosten /kWh4', value:val};
    let val1 = val*((dSum/f19)+(fSum/f19));
    this.endResult[2] = {title:'Besparing per dag', value:'€ '+(Math.round(val1 * 10000) / 10000).toFixed(4)};
    let val2 = val1*183;
    // console.log('val1', val1, val2, fSum, dSum, f19);
    this.endResult[3] = {title:'Besparing per jaar', value:'€ '+(Math.round(val2 * 10000) / 10000).toFixed(4)};
    this.endResult[4] = {title:'Investering ', value:this.finalPrice};
    // console.log(this.gridApi[4]);
    
    let val3 = this.finalPrice/val2;
    this.endResult[5] = {title:'ROI ', value:val3+' jaar'};
    if(this.showROIResult == true){
      this.gridApi[4]['data'].setRowData(this.endResult);
  }
    
    this.getRowStyleResult = params => {
      if (params.node.rowIndex === 0) {
          return { background: '#f86c35',  };
      }
    }
    // this.gridApi['data'].refreshCells();
  }

  saveFinalPrice(){
    this.showROIResult = true;
    // this.calculate(this.obj);
    this.setEndGrid(this.fSum, this.dSum, this.f19);
    this.currentCustomer['finalPrice'] = this.finalPrice;
    this.customerService.update(this.customerId, this.currentCustomer).subscribe(res=>{
      // console.log('sutomer res', res['resp']['finalPrice']);
      // this.finalPrice =res['resp']['finalPrice'];
    })
    
  }

  coldefs = [
    {headerName: 'Terugverdienmodel', field: 'title'},
    {headerName: '', field: 'value'},
  ];

  
  // onNorthSubmit() {
  //   console.log('NORTH DATA',this.northForm.value['nor']);
  // }

  // ROI RESULT GRID DATA

  
   
  ROIcolumnDefs = [
    [
    {headerName: 'Huidige situatie', field: 'title', editable: false},
    {headerName: 'North', field: 'direction', editable: false},
    {headerName: 'Facade', field: 'facade', editable: false},
    {headerName: 'Result', field: 'result', editable: false},
    ],
    [
    {headerName: 'Huidige situatie', field: 'title', editable: false},
    {headerName: 'South', field: 'direction', editable: false},
    {headerName: 'Facade', field: 'facade', editable: false},
    {headerName: 'Result', field: 'result', editable: false},
    ],
    [
    {headerName: 'Huidige situatie', field: 'title', editable: false},
    {headerName: 'East', field: 'direction', editable: false},
    {headerName: 'Facade', field: 'facade', editable: false},
    {headerName: 'Result', field: 'result', editable: false},
    ],
    [
    {headerName: 'Huidige situatie', field: 'title', editable: false},
    {headerName: 'West', field: 'direction', editable: false},
    {headerName: 'Facade', field: 'facade', editable: false},
    {headerName: 'Result', field: 'result', editable: false},
    ],
    // { field: 'price0'}
  ];

  ROIrowData = [
    {title: 'Toyota', direction: 'Celica', facade: 35000},
    {title: 'Ford', direction: 'Mondeo', facade: 32000},
    {title: 'Porsche', direction: 'Boxter', facade: 72000}
  ];

   
  // Code for Options
  checkOptionVal(){

    // console.log('direction sum', this.directionSum);
    this.showAlert = false;
    let msg =[], opperValue=[0,0,0,0,0], valueArray=[0,0,0,0,0], sumArray=[], totalSum=0;
    const upperCaseAlp = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    if(this.isEastChecked && this.sidesTables[0].rowData.length>0){
      msg.push("East");
      // console.log('EAST DATA', this.sidesTables[0]);
      opperValue[0] = opperValue[0] + this.directionSum.east;
    }else if(this.isEastChecked && this.sidesTables[0].rowData.length==0){
      this.showAlert = true;
      this.alertMessage = 'PLEASE ENTER EAST DATA IN CALCULATION';
      return;
    }
    if(this.isNorthChecked && this.sidesTables[2].rowData.length>0){
      msg.push("North");
      // console.log('North DATA', this.sidesTables[2]);
      opperValue[0] = opperValue[0] + this.directionSum.north;
    }else if(this.isNorthChecked && this.sidesTables[2].rowData.length==0){
      // console.log('called in north ');
      this.showAlert = true;
      this.alertMessage = 'PLEASE ENTER NORTH DATA IN CALCULATION';
      msg = [];
      // return;
    }

    if(this.isWestChecked && this.sidesTables[1].rowData.length>0){
      msg.push("West");
      // console.log('West DATA', this.sidesTables[1]);
      opperValue[0] = opperValue[0] + this.directionSum.west;
    }else if(this.isWestChecked && this.sidesTables[1].rowData.length==0){
      // console.log('called in north ');
      this.showAlert = true;
      this.alertMessage = 'PLEASE ENTER West DATA IN CALCULATION';
      msg = [];
      // return;
    }
    if(this.isSouthChecked && this.sidesTables[3].rowData.length>0){
      msg.push("South");
      // console.log('South DATA', this.sidesTables[3]);
      opperValue[0] = opperValue[0] + this.directionSum.south;
    }else if(this.isSouthChecked && this.sidesTables[3].rowData.length==0){
      // console.log('called in north ');
      this.showAlert = true;
      this.alertMessage = 'PLEASE ENTER SOUTH DATA IN CALCULATION';
      msg = [];
      // return;
    }

    opperValue[1] = opperValue[0];
    for(let k=0;k<opperValue.length;k++){
      sumArray[k] = opperValue[k] * valueArray[k];
      totalSum = totalSum + sumArray[k];
    }
    let index = 0;
    if(this.optionsTable.length>0){
      let lastOption = this.optionsTable[this.optionsTable.length-1]['option'];
      index = upperCaseAlp.indexOf(lastOption)+1;
      // console.log('last option', index, this.optionsTable.length);
    }
    
    if(msg.length == 0){
      // console.log('no direction checked');
      this.alertMessage = 'PLEASE CHECK DIRECTION CAREFULLY';
      this.showAlert = true;
    }else{
      this.newPrice = true;
      this.showAlert = false;
      let title = "Option "+upperCaseAlp[index] + ": " + msg.join(', ');
      if(this.checkTitle(title)){
        this.optionData = this.createOptionData(opperValue, valueArray, sumArray, totalSum);
        this.titleArray.push({title:title, price: totalSum});
        let optionObject = this.createOptionObject(this.optionData, title, upperCaseAlp[index]);
        this.optionsTable.push(optionObject);
      }else {
        this.alertMessage = 'THIS PRICE TITLE ALREADY EXIST';
        this.showAlert = true;
      }
      
    }
    

    if(this.isEastChecked){
      this.isEastChecked = false;
    }
    if(this.isNorthChecked ){
      this.isNorthChecked = false;
    }
    if(this.isWestChecked){
      this.isWestChecked = false;
    }
    if(this.isSouthChecked){
      this.isSouthChecked = false;
    }
  }

  checkTitle(title) {
    let titleSplit = title.split(": ", 2);
    title = titleSplit[1];
    for(let i=0; i<this.titleArray.length; i++) {
      let str = this.titleArray[i]['title'];
      let splitted = str.split(": ", 2);
      // console.log('checking', title, splitted);
      if(title == splitted[1]) {
        // console.log('sending false', title, splitted[1]);
        return false;
      }
    }
    return true;
    
  }

  createOptionObject(data, title, option){
    let optionObject = {
      isEastChecked: this.isEastChecked,
      isNorthChecked: this.isNorthChecked,
      isWestChecked: this.isWestChecked,
      isSouthChecked: this.isSouthChecked,
      columnDefs:[
        { headerName: title, field: 'calculateOption', editable: false, colId: 'calculateColumn' },
        { field: 'Oppervlakte', editable: true, colId: 'oppervlakteColumn' },
        { field: 'Value', editable: true, colId: 'valueColumn' },
        { field: 'Sum', editable: false, colId: 'sumColumn' },

      ],
      rowData:data,
      isModified: false,
      title: title,
      option: option
    };
    // console.log(optionObject.rowData);
    return optionObject;
  }

  createOptionData(opperValue, valueArray, sumArray, totalSum){
    let optionData = [{
      calculateOption: '80T',
      Oppervlakte: opperValue[0],
      Value: valueArray[0],
      Sum: sumArray[0],
    },
    {
      calculateOption: '14V',
      Oppervlakte: opperValue[1],
      Value: valueArray[1],
      Sum: sumArray[1],
    },
    {
      calculateOption: 'Werkuren',
      Oppervlakte: opperValue[2],
      Value: valueArray[2],
      Sum: sumArray[2],
    },
    {
      calculateOption: 'Reisuren',
      Oppervlakte: opperValue[3],
      Value: valueArray[3],
      Sum: sumArray[3],
    },
    {
      calculateOption: 'Klimmateriaal (18037)',
      Oppervlakte: opperValue[4],
      Value: valueArray[4],
      Sum: sumArray[4],
    },
    {
      calculateOption: 'Total',
      Oppervlakte: '',
      Value: '',
      Sum: totalSum,
    }];
    return optionData;
  }

  async next(){

    if(this.step == 2){
      this.step++;
      // console.log('entered in step function', this.selectedTitle);
      // if(this.selectedTitle != ''){
      //   this.showAlert = false;
      //   let data = [];
      //   console.log('entered in next function', this.selectedTitle);
      //   let rowDataLength = this.optionsTable[0].rowData.length;
      //   for(let i=0; i<this.optionsTable.length; i++){
      //     let obj = {};
      //     obj['customerId'] = this.customerId;
      //     obj['title'] = this.optionsTable[i].title;
      //     obj['data'] = this.optionsTable[i].rowData;
      //     obj['totalSum'] = this.optionsTable[i].rowData[rowDataLength-1]['Sum'];
      //     obj['isModified'] = this.optionsTable[i].isModified;
      //     obj['option'] = this.optionsTable[i].option;
      //     data.push(obj);
      //   }
      //   console.log('after processing loop', data);
      //   await this.priceService.create(data).subscribe(async (res) =>{
      //     console.log('response in price sevice', res);
      //     this.priceExisted = true;
      //     this.getAllData();
      //     let customer = {
      //       selectedOption: this.selectedTitle, 
      //       selectedPrice: this.selectedPrice,
      //       signature: this.dataURL
      //     };
      //     await this.customerService.update(this.customerId, customer).subscribe((response) => {
      //       console.log('response in customer update sevice', response);
      //       this.step = 3;
      //     })
      //     this.step = 3;
      //   })
      // }else{
      //   console.log('entered in else function', this.selectedTitle);
      //   this.alertMessage = 'Please Select any Option ';
      //   this.showAlert = true;
      // }
      
    }else if(this.step == 4){

      if (this.finalPrice==0){
        this.showAlert = true;
        this.alertMessage = 'Please Enter Correct Price'
      }else{
        this.showAlert=false;
        // console.log('entered in else', this.obj);
        let roi = {obj:this.obj, customerId: this.customerId};
        // console.log('entered in next 4', roi);
        //TODO CHECKK WHETHER OBJ HAS CORRRECT DATA OR NOT???
        this.roiService.create(roi).subscribe((res)=>{
          // console.log('returning response of roi create', res);
        })
        let Customer = {
          _id: this.customerId,
          fullname: this.customerName, 
          signature: this.dataURL,
          finalPrice: this.finalPrice,
          selectedPrice: this.selectedPrice
        };
        this.customerService.update(this.customerId, Customer).subscribe(async (resp) =>{
          // console.log('customer update response', resp);
        });
      }


      
      // this.customerService.update(this.customerId, {finalPrice: this.finalPrice}).subscribe((res)=>{
      //   console.log('update customer final price', res);
      // })
      this.step++;
    }else if(this.step == 1){
      this.step++;
    }
    
    
    // if(params.event.key == 'Enter'){
    //   console.log('cell key clicked', params.event.key, data[this.rowIndex]);
    //   this.optionData[this.rowIndex] = data[this.rowIndex];
    // }
  }

  onCellKeyPress(params, index){
    // let data = this.gridApi[index].data.gridOptionsWrapper.gridOptions.rowData;
    
    // // if(params.event.key == 'Enter'){
    //   console.log('cell key clicked', params.event.key, data);
    //   this.optionData[this.rowIndex] = data[this.rowIndex];
    // }
  }

  // UPDATING CELL VALUES OF PRICE OPTIONS
  onCellValueChanged(event, index) {

    this.optionsTable[index].isModified = true;
    let obj = this.optionsTable[index].rowData;
    obj[event.rowIndex]['Oppervlakte'] = +obj[event.rowIndex]['Oppervlakte'];
    obj[event.rowIndex]['Value'] = +obj[event.rowIndex]['Value']
    obj[event.rowIndex]['Sum'] = obj[event.rowIndex]['Oppervlakte']*(obj[event.rowIndex]['Value']);
    obj[5]['Sum'] = 0;
    
    // ADDING TOTAL SUM AFTER UPDATION OF ROWS
    for(let i=0; i<5;i++){
      obj[5]['Sum'] = obj[i]['Sum'] + obj[5]['Sum'];
    }
    let itemsToUpdate=[];
    this.newPrice = true;
    itemsToUpdate.push(this.optionsTable[index].rowData[event.rowIndex]);
    itemsToUpdate.push(this.optionsTable[index].rowData[5]);
    this.optionsTable[index]['priceObj'].data.updateRowData({ update: itemsToUpdate });
    // console.log(this.optionsTable[index]);
    for(let j=0; j<this.titleArray.length; j++) {
      if(this.optionsTable[index].title == this.titleArray[j].title){
        this.titleArray[j].price = this.optionsTable[index].rowData[5].Sum;
      }
    }
}

  onCellClicked(params){
    // console.log('cell clicked', params);
    // this.rowIndex = params.node.rowIndex;
  }

  calculateSum(){

  }
  
  onRemoveSelected(index, title) {

    var selectedData = this.sidesTables[index]['tableGripObj'].data.getSelectedRows();
    // console.log('select', selectedData, title);
    var res = this.sidesTables[index]['tableGripObj'].data.applyTransaction({ remove: selectedData });
    for(let i=0; i<this.sidesTables[index].rowData.length; i++){
      if(this.sidesTables[index].rowData[i] == selectedData[0]){
        let id = this.sidesTables[index].rowData[i]._id;
        // let cal = this.sidesTables[index].rowData[i].Oppervlakte;
        
        // console.log('delete id', this.sidesTables[index].rowData);
        this.sidesTables[index].rowData.splice(i,1);
        this.quotationsService.delete(title, id).subscribe(res=>{
        })

        // let str = this.selectedTitle;
        // var splitted = str.split(": ", 2);
        // var newStr = splitted[1];
        //                     // debugger;
        // var newSplitted = newStr.split(",", 4);
        // console.log(newSplitted, newSplitted.length);
        // for (let j = 0; j < newSplitted.length; j++) {
        //   if(newSplitted[j] == title){
        //     this.finalPrice = this.finalPrice - cal;
        //     this.currentCustomer['finalPrice'] = this.finalPrice;
        //     this.customerService.update(this.customerId, this.currentCustomer).subscribe(respo=>{

        //     })
        //   }
        // }
        //THIS CODE WILL SUBTRACT OPPERVLAKTE VALUE FROM TOTAL SUM AND REFRESH THE PAGE
        let oldSum = this.getOldSum(this.sidesTables[index].title);
        let sum = this.calculateOppervlakte(this.sidesTables[index].rowData, index);
        this.setDirectionSum(sum, index);
        this.sidesTables[index]['tableGripObj'].data.refreshCells();
        this.updatePriceTable(index, sum, oldSum);   
        break;
      }
    }
    // console.log(this.sidesTables)
  }

  updatePriceTable(index, sum, oldSum){
    let title = this.sidesTables[index].title;
    
    this.priceService.updateSum({customerId: this.customerId, title: title, sum:sum, oldSum:oldSum})
    .subscribe(res=>{
      this.updatePrice = true;
      this.getPriceData();
      
      // console.log('finding title', this.optionsTable);
    })
  }

  getOldSum(title){
    let oldSum;
    if(title == 'North'){
      oldSum = this.directionSum.north
    }else if(title == 'South'){
      oldSum = this.directionSum.south
    }else if(title == 'East'){
      oldSum = this.directionSum.east
    }else if(title == 'West'){
      oldSum = this.directionSum.west
    }
    return oldSum;
  }

  titleChange(title){
    
    this.selectedTitle = title.target.value;
    for(let i=0; i<this.titleArray.length; i++){
      if(this.titleArray[i].title == this.selectedTitle){
        this.selectedPrice = this.titleArray[i].price;
        this.finalPrice = this.selectedPrice;
        // console.log('title is changed', this.selectedTitle, this.selectedPrice, this.finalPrice);
        this.newPrice = true
      }
    }
  }

  titleCheckClicked() {
    this.showSelectedTitle = false;
  }

  createPdfData(){
    // console.log('calculation', this.sidesTables);
    // console.log('price', this.optionsTable);
    // console.log('roi data', this.roiData);

  }

  deleteOption(index){
    // console.log('price', this.optionsTable[index]);
    this.priceService.delete({title: this.optionsTable[index]['title'], 
    option: this.optionsTable[index]['option']}, this.customerId).subscribe(res=>{
      // console.log('delete response', res);
      if(this.optionsTable[index]['title'] == this.selectedTitle){
        this.selectedTitle = '';
        this.currentCustomer['selectedOption'] = this.selectedTitle;
        this.customerService.update(this.customerId, this.currentCustomer).subscribe(res=>{

        })
      }
      this.newPrice = false;
      this.getPriceData();
      this.getAllData();
      if(res['result'] == 0){

      }else{
        
      }
    })
  }

  async savePrice(){
    // console.log('entered in save price function', this.selectedTitle);
    if(this.selectedTitle != ''){
      this.showAlert = false;
      let data = [];
      // console.log('entered in next function', this.selectedTitle);
      let rowDataLength = this.optionsTable[0].rowData.length;
      for(let i=0; i<this.optionsTable.length; i++){
        let obj = {};
        obj['customerId'] = this.customerId;
        obj['title'] = this.optionsTable[i].title;
        obj['data'] = this.optionsTable[i].rowData;
        obj['totalSum'] = this.optionsTable[i].rowData[rowDataLength-1]['Sum'];
        obj['isModified'] = this.optionsTable[i].isModified;
        obj['option'] = this.optionsTable[i].option;
        if(this.optionsTable[i].title == this.selectedTitle){
          this.finalPrice = obj['totalSum'];
        }
        data.push(obj);
      }
      // console.log('after processing loop', this.finalPrice);
      await this.priceService.create(data).subscribe(async (res) =>{
        // console.log('response in price sevice', res);
        this.priceExisted = true;
        this.getAllData();
        let customer = {
          selectedOption: this.selectedTitle, 
          fullname: this.customerName, 
          finalPrice: this.finalPrice,
          selectedPrice: this.selectedPrice,
          signature: this.dataURL
        };
        await this.customerService.update(this.customerId, customer).subscribe((response) => {
          // console.log('response in customer update sevice', response, customer);
          this.newPrice = false;
          if (this.dataURL){
            this.signatureImage = true;
          }
          // this.step = 3;
        })
        this.newPrice = false;
        // this.step = 3;
      })
    }else{
      // console.log('entered in else function', this.selectedTitle);
      this.alertMessage = 'Please Select any Option ';
      this.showAlert = true;
    }
  }

}
//END





