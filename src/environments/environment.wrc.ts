import { truncate } from 'fs';

export const environment = {
  production: true,
  publicUrl: 'http://wrc.fourways-technology.co.uk:3000/',
  strapLine: 'WRC recycling powered by 4Waste (Fourways Technology LTD) - Version 1.30.0',
  logo: 'wrc.png',
  isSimply: false,
  api: {
    endpoint: 'http://wrc.fourways-technology.co.uk:3000/',
    clientId: 'ANQ6Wqd2FWIPvRWYM7ygv5VoKXGeOesq',
    clientSecret: 'seE89w1knXrDCJOOCeY9f3Y2cwUSCvVI',
  },
  defaults: {
    tareWeightUnit: 'kg',
    employeeNoPrefix: 'WRC-',
    defaultWeighbridgeDepot: 23,
    defaultVehicleDepot: 23,
    companyName:'WRC',
    logoFilePath: '',
    defaultTimeline: 3,
    invoiceTemplate: '',
    quoteNoPrefix: 'Quote-WRC-',
    cashCustomerId: 3,
    signoffURL: 'job-signoff/shredder',
    qrFillColor: '#6f2528',
    qrImage: 'data:image/png;base64,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',
  },
  crmOptions: {
    showLeads:false,
    showOpps:true,
  },
  timelineOptions: [
    {type:'Tipper',value:3, match:'5'},
    {type:'Grab',value:5,match:'9'},
    {type:'Concrete',value:6,match:'11'},
    {type:'Sweeper',value:7,match:'10'},
    {type:'Shredder',value:8,match:'8'}
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
  paidModules: {
    contacts: true,
    leads: true,
    opportunities: true,
    containers: true,
    landServicesTimeline: true,
    skipsTimeline: false,
    articsTimeline:false,
    weighbridge: true,
    assetRegister: true,

    workshop: false,
    workshopDriverChecks:false,
    workshopDefectScheduling: false,
    workshopReporting:false,
    workshopDocs:false,
  },
  apiKeys: {
    getAddress: '7HkBdcG1FU6M1a8hfcGvjA29725', // https://getaddress.io/
    dvlaSearch:'', // https://api.dvlasearch.co.uk/
    companiesHouse: '35b80b87-f7b2-4538-98fd-a1e9c2ad1239', //https://developer.company-information.service.gov.uk/
  },
  invoicing: {
    companyName: 'WRC recycling',
    invoicePrefix: 'WRC-',
    invoiceTerms: '14 Days',
    invoiceComments: '',
    address1: '45 Newmains Ave',
    address2: 'Inchinnan',
    addressCity: 'Renfrew',
    addressCountry: 'Scotland',
    addressPostcode: 'PA4 9RR',
    wasteTransferTermsBlockA:'',
    wasteTransferTermsBlockB:'',
    headedInvoiceTemplate: 'headed-invoice-wrc',
    unheadedInvoiceTemplate: 'nonheaded-invoice-wrc',
    companyLogo: 'data:image/png;base64,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'

  }
};
