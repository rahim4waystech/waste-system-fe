// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// // The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  publicUrl: 'http://ascoterp.fourways-technology.co.uk:3000/',
  strapLine: 'Simply ERP - Version 1.30.0',
  logo: 'simply.jpg',
  isSimply: true, 
  api: {
    endpoint: 'http://ascoterp.fourways-technology.co.uk:3000/',
    clientId: 'ANQ6Wqd2FWIPvRWYM7ygv5VoKXGeOesq',
    clientSecret: 'seE89w1knXrDCJOOCeY9f3Y2cwUSCvVI',
  },
  defaults: {
    tareWeightUnit: 'kg',
    employeeNoPrefix: 'ASCOT-',
    quoteNoPrefix: 'ASCOT-',
    defaultWeighbridgeDepot: 4,
    defaultVehicleDepot: 4,
    companyName:'ASCOT',
    invoiceHeadedTemplate: '',
    invoiceTemplate: '',
    defaultTimeline: 3,
    cashCustomerId: -1,
    signoffURL: 'job-signoff',
    qrFillColor: '#6f2528',
    qrImage: '',
  },
  paidModules: {
    contacts: true,
    leads: true,
    opportunities: true,
    quoting: true,
    calendars: true,
    containers: true,
    contracts: true,
    landServicesTimeline: true,
    skipsTimeline: true,
    articsTimeline: true,
    weighbridge: true,
    workshop: true,
    assetRegister: true,
    workshopDriverChecks:true,
    workshopDefectScheduling: true,
    workshopReporting:true,
    workshopDocs:true
  },
  crmOptions: {
    showLeads:true,
    showOpps:true,
  },
  timelineOptions: [
    {type:'Tipper',value:3, match:'5'},
    {type:'Artic',value:4,match:'6'},
    {type:'Grab',value:5,match:'9'},
    {type:'Concrete',value:6,match:'11'},
    {type:'Sweeper',value:7,match:'10'},
    {type:'Shredder',value:8,match:'8'},
    {type:'Tanker',value:9,match:'13'},
  ],
  orderOptions:[
    {orderName:'Skip',orderTypeId:1,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Trade Waste',orderTypeId:2,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Tipper',orderTypeId:3,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Artic',orderTypeId:4,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Grab',orderTypeId:5,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Concrete',orderTypeId:6,reqGrade:false,reqTip:false,wasteTransferReq:false},
    {orderName:'Sweeper',orderTypeId:7,reqGrade:false,reqTip:true,wasteTransferReq:false},
    {orderName:'Shredding',orderTypeId:8,reqGrade:true,reqTip:true,wasteTransferReq:true},
  ],
  dashboardOptions:[
    {
      section: 'Sales',
      items: [
        {id:1, name:'contract-ending-grid', display:'Contract End Dates', active:true},
        {id:2, name:'gross-profit-by-salesman-graph', display:'Gross Profit by Salesperson', active:false},
        {id:3, name:'last-order-date-grid', display:'Last Orders', active:true},
        {id:11, name:'invoices-to-be-authorised', display:'Invoices to be Authorised', active:false},
      ]
    },
    {
      section: 'Transport',
      items: [
        {id:4, name:'jobs-by-vehicle-graph', display:'Jobs by Vehicle Type', active:false},
        {id:12, name:'collections-due-today', display:'Collections Due Today', active:false},
        {id:13, name:'issues-from-drivers', display:'Driver Issues', active:false},
      ]
    },
    {
      section: 'Finance',
      items: [
        {id:5, name:'invoice-status-graph', display:'Invoice Status', active:false},
      ]
    },
    {
      section: 'Vehicles',
      items: [
        {id:6, name:'vehicle-utilisation-graph', display:'Vehicle Utilisation', active:false},
        {id:7, name:'vehicle-availability-graph', display:'Vehicle Availability', active:false},
      ]
    },
    {
      section: 'Workshop',
      items: [
        {id:8, name:'vehicle-status-graph', display:'Vehicle Status', active:false},
        {id:9, name:'daily-driver-checks-graph', display:'Daily Driver Checks', active:false},
        {id:10, name:'inspections-due', display:'Inspections Due', active:false},
      ]
    },
  ],
  apiKeys: {
    getAddress: '7HkBdcG1FU6M1a8hfcGvjA29725', // https://getaddress.io/
    dvlaSearch:'a5c42dde-f1a0-4832-8368-67976138101f', // ukvehicledata.co.uk
    companiesHouse: '35b80b87-f7b2-4538-98fd-a1e9c2ad1239', //https://developer.company-information.service.gov.uk/
    logo: '',
  },

  //  3/1, 1 Ascot Ave, Glasgow G12 0AP
  invoicing: {
    companyName: 'Ascot Management Services',
    invoicePrefix: 'ASCOT-',
    invoiceTerms: '14 Days',
    invoiceComments: 'Invoices must be paid within 14 days <br /><br/>',
    address1:'3/1',
    address2: '1 Ascot Ave',
    addressCity: 'Glasgow',
    addressCountry: 'Scotland',
    addressPostcode: 'G12 0AP',
    wasteTransferTermsBlockA:'',
    wasteTransferTermsBlockB:'',
    podTemplate: 'pod',
    headedInvoiceTemplate: 'headed-invoice',
    unheadedInvoiceTemplate: 'nonheaded-invoice',
    wasteTransferNoteTemplate: 'waste-transfer-note',
    companyLogo:'',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
