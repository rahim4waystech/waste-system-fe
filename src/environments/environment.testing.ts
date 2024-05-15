import { truncate } from 'fs';

export const environment = {
  production: false,
  publicUrl: 'http://testing.fourways-technology.co.uk:3000/',
  strapLine: '4Logistics Development Testing (Fourways Technology LTD) - Version 1.30.0',
  logo: 'logo.png',
  isSimply: false, 
  api: {
    endpoint: 'http://testing.fourways-technology.co.uk:3000/',
    clientId: 'ANQ6Wqd2FWIPvRWYM7ygv5VoKXGeOesq',
    clientSecret: 'seE89w1knXrDCJOOCeY9f3Y2cwUSCvVI',
  },
  defaults: {
    tareWeightUnit: 'kg',
    employeeNoPrefix: '4Ways-',
    defaultWeighbridgeDepot: 23,
    defaultVehicleDepot: 23,
    companyName:'4Ways Technology',
    logoFilePath: '',
    defaultTimeline: 3,
    invoiceTemplate: '',
    quoteNoPrefix: 'Quote-4Ways-',
    cashCustomerId: 3,
    signoffURL: 'job-signoff/start',
    qrFillColor: '#6f2528',
    qrImage: 'data:image/png;base64,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',
  },
  timelineOptions: [
    {type:'Tipper',value:3, match:'5'},
    {type:'Grab',value:5,match:'9'},
    {type:'Concrete',value:6,match:'11'},
    {type:'Sweeper',value:7,match:'10'},
    {type:'Shredder',value:8,match:'8'}
  ],
  crmOptions: {
    showLeads:true,
    showOpps:true,
  },
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
  paidModules: {
    contacts: true,
    leads: true,
    opportunities: true,
    containers: true,
    landServicesTimeline: true,
    skipsTimeline: true,
    articsTimeline:true,
    weighbridge: true,
    assetRegister: true,
    contracts: true,
    calendars: true,
    quoting: true,

    workshop: true,
    workshopDriverChecks:true,
    workshopDefectScheduling: true,
    workshopReporting:true,
    workshopDocs:true,
  },
  apiKeys: {
    logo: '',
    getAddress: '7HkBdcG1FU6M1a8hfcGvjA29725', // https://getaddress.io/
    dvlaSearch:'a5c42dde-f1a0-4832-8368-67976138101f', // https://api.dvlasearch.co.uk/
    companiesHouse: '35b80b87-f7b2-4538-98fd-a1e9c2ad1239', //https://developer.company-information.service.gov.uk/
  },
  invoicing: {
    companyName: 'Fourways Technology',
    invoicePrefix: '4Ways-',
    invoiceTerms: '14 Days',
    invoiceComments: '',
    address1: '49 Finglen Place',
    address2: 'Darnley',
    addressCity: 'Glasgow',
    addressCountry: 'Scotland',
    addressPostcode: 'PA4 9RR',
    wasteTransferTermsBlockA:'',
    wasteTransferTermsBlockB:'',
    headedInvoiceTemplate: 'headed-invoice',
    unheadedInvoiceTemplate: 'nonheaded-invoice',
    wasteTransferNoteTemplate: 'waste-transfer-note',
    podTemplate: 'pod',
    companyLogo: 'data:image/png;base64,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',
  }
};
