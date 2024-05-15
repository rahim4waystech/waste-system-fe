import { truncate } from 'fs';

export const environment = {
  production: true,
  publicUrl: 'http://124.29.237.188:52300/',
  strapLine: 'Yuill & Dodds (Simply ERP - Version 1.59.5)',
  isSimply:true,
  logo: 'simply.jpg',
  api: {
    endpoint: 'http://124.29.237.188:52300/',
    clientId: 'ANQ6Wqd2FWIPvRWYM7ygv5VoKXGeOesq',
    clientSecret: 'seE89w1knXrDCJOOCeY9f3Y2cwUSCvVI',
  },
  defaults:{
    tareWeightUnit: 'kg',
    employeeNoPrefix: 'YND-',
    defaultWeighbridgeDepot: 23,
    defaultVehicleDepot: 1,
    companyName:'Yuill & Dodds',
    defaultTimeline: 3,
    logoFilePath: '',
    invoiceTemplate: '',
    cashCustomerId: 3,
    signoffURL: 'job-signoff/start',
    qrImage: '',
    qrFillColor: 'black',
    quoteNoPrefix: 'YND-',

  },
  crmOptions: {
    showLeads:false,
    showOpps:false,
  },
  timelineOptions: [
    {type:'Tipper',value:3, match:'5'},
    {type:'Artic',value:4,match:'6'},
    // {type:'Grab',value:5,match:'9'},
    // {type:'Concrete',value:6,match:'11'},
    // {type:'Sweeper',value:7,match:'10'},
    // {type:'Shredder',value:8,match:'8'}
  ],
  orderOptions:[
    // {orderName:'Skip',orderTypeId:1,reqGrade:true,reqTip:true,wasteTransferReq:true},
    // {orderName:'Trade Waste',orderTypeId:2,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Tipper',orderTypeId:3,reqGrade:true,reqTip:true,wasteTransferReq:true},
    {orderName:'Artic',orderTypeId:4,reqGrade:true,reqTip:true,wasteTransferReq:true},
    // {orderName:'Grab',orderTypeId:5,reqGrade:true,reqTip:true,wasteTransferReq:true},
    // {orderName:'Concrete',orderTypeId:6,reqGrade:false,reqTip:false,wasteTransferReq:false},
    // {orderName:'Sweeper',orderTypeId:7,reqGrade:false,reqTip:true,wasteTransferReq:false},
    // {orderName:'Shredding',orderTypeId:8,reqGrade:true,reqTip:true,wasteTransferReq:true},
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
    contacts: false,
    leads: false,
    opportunities: false,
    containers: false,
    landServicesTimeline: true,
    skipsTimeline: false,
    articsTimeline:false,
    weighbridge: false,
    assetRegister: false,
    fuel: false,
    quoting: false,
    calendars: false,
    contracts: false,

    workshop: false,
    workshopDriverChecks:false,
    workshopDefectScheduling: false,
    workshopReporting:false,
    workshopDocs:false,
  },
  apiKeys: {
    getAddress: '7HkBdcG1FU6M1a8hfcGvjA29725', // https://getaddress.io/
    dvlaSearch:'a5c42dde-f1a0-4832-8368-67976138101f', // ukvehicledata.co.uk
    companiesHouse: '35b80b87-f7b2-4538-98fd-a1e9c2ad1239', //https://developer.company-information.service.gov.uk/
    logo: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMmNlZTBiZDg1ZWYzZTMwMjI5MDgzZjVhNzg3NDVhNDgzNWJmYTQxNjE2ZDI2MGQ3ODY5NGMyYjYxMTMyODY3YjdmMTY4YjI4NjlhNTI5NDEiLCJpYXQiOjE2MjE4NTMxMjksIm5iZiI6MTYyMTg1MzEyOSwiZXhwIjoxNjUzMzg5MTI5LCJzdWIiOiIxNDQ0Iiwic2NvcGVzIjpbXX0.jHUCJrn34hqZaRLiZGUhid_1Nu8YBySvvG04qLLxxZWXgbwwENnygtRlclQvFWw6EKGETNiq8MYcDoQ12YTV7Q', //https://www.klazify.com/category

  },
  invoicing: {
    companyName: 'Yuill & Dodds Ltd',
    invoicePrefix: 'YND-',
    invoiceTerms: '30 Days',
    invoiceComments: 'Any discrepancy on this invoice must be notified within 7 days of receipt<br/>Terms of payment – 30 days from end of month in which work is done <br/>Vat No 260 7168 63<br /><br/>',
    address1: 'Unit 6',
    address2: 'Whistleberry Park Ind Est',
    addressCity: 'Hamilton',
    addressCountry: 'Lanarkshire',
    addressPostcode: 'ML3 0ED<br >01698 720700<br />accounts@yuill-and-dodds.co.uk<br />www.yuill-and-dodds.co.uk',
    wasteTransferTermsBlockA:'<dl><dt>1) General</dt><dd>1.1 - Any order placed with %REPLACE% which takes its vehicles off the public highway will be at the customers own risk, they will accept full responsibility for any consequential damage that may occur to persons, property or vehicles as a result of this.</dd><dd>1.2 - %REPLACE% will not be liable for any loss or damage caused by failure to supply, or any delay in supply which may be caused directly or indirectly by any circumstances beyond our control, including an act of God, fire, accident, breakdown of machoinery, shortage of labour or material, or by an act of neglect on the part of the customer.</dd><dd>1.3 - The time allowed for loading / unloading is 15 minutes. If the vehicle is kept waiting longer than this, %REPLACE%reserves the right to charge waiting time.</dd><dd>1.4 - %REPLACE% reserves the right to charge the customer for all costs incurred as a result of a cancellation or variation of the whole or a substantial part of any order, together with a loss of profit and all other consequential loss.</dd><dt>2) Skip Hire</dt><dd>2.1 - Asbestos, fridges, freezers, televisions, monitors, tyres, fluorescent/sodium lamps, gas cylinders, plasterboard, or any waste deemed as hazardous by an absolute or mirror entry in the European Waste Catalogue (Article 1(4) of the hazardous Waste Directive 91/689/EC) must not be placed in the skip container unless by prior written agreement with the company.</dd><dd>2.2 - It is the responsibility of the hirer to ensure that skips placed on the highway or public places have the permission of the local highway authority and are adequately lit and coned off in accordance with the Highways Act 1980. %REPLACE% can organise permits at additional cost to the hirer.</dd><dd>2.3 - The hirer shall ensure that the skip is not overloaded by weight or by volume at the point of collection. 8yd skips should be loaded so that it is filled no higher than the tops of its sides. 14yd, 30yd, 35yd, and 40yd roll on-off are only to be used for light waste or loaded no more than the maximum legal road limit for the vehicles. %REPLACE% reserves the right ot refuse to collect overloaded skips and any costs incurred due to unsafe loads/overloading (including wasted journeys) will be passed on to the hirer. Additional charges may be levied.<br/><b>OVERLOADING WILL ALWAYS INCUR EXCESS CHARGES</b></dd><dd>2.4 - The lighting of fires in or near skips is strictly prohibited. The hirer will be liable for any loss or damage to the skip container (excluding fair wear and tear) during the term of the skip hire period, and will be charged the current purchase price of the skip. Once a skip has been placed, it shall not be repositioned without prior consent from %REPLACE%. Moving skips on site could result in inability to collect skip.</dd></dl>',
    wasteTransferTermsBlockB:'<dl><dd>2.5 - The maximum rental period is 7 days for <b>Cash Customers</b> and 14 days for <b>Account Customers</b>. It is the responsibility for the hirer to request the collection within this time. Failure to do so will result in an unannounced collection and/or rental charges being incurred of £5.00 per day for skips and £10.00 per day for Roll On-Offs who go over the 3 days.</dd><dd>2.6 - The responsibility for the skip remains with the hirer until collected by a %REPLACE% vehicle. Any skips which are removed whilst in the control of the hirer will be charged at full replacement value.</dd><dt>3) Tipping/Waste Disposal</dt><dd>3.1 - %REPLACE% are registered with SEPA as a waste carrier, further all landfill or disposal sites are correctly licensed or approved.</dd><dd>3.2 - Customers using %REPLACE% landfill or disposal sites do so entirely at their own risk. %REPLACE% accepts no responsibility for damage or injury of any nature that may occur to persons or vehicles using these sites.</dd><dd>3.3 - Vehicles may only use such portions of the sites as are allocated to them.</dd><dd>3.4 - Only waste permitted under the waste permit licences or exemptions may be deposited on the sites.</dd><dd>3.5 - %REPLACE% reserves the right to refuse any materials which itconsiders to be objectional or unsuitable for deposit on the company\'s sites.</dd><dd>3.6 - Material for deposit on our sites will only be accepted from registered waste carriers and must be accompanied by a controlled waste transfer note stating a description of the waste (with EWC code), the source of the waste, and the details of the waste carrier, including carrier registration number. Environmental Protection (Duty of Care) Regulations 1991.</dd><dt>4) Sale of Materials</dt><dd>4.1 - All materials are sold on the basis that the weight or quantity is as stated on the conveyance note. %REPLACE% will not accept any responsibility once the load has been discharged and accepted by the onsite signatory.</dd><dd>4.2 - Unless expressly agreed in writing, %REPLACE% prices are for materials as stated on the quotation. Where the customer requires an alteration in the grade or type of material, or where it becomes necessary to supply from another source, an extra charge may be made for any additional costs which may be incurred by %REPLACE%.</dd><dd>4.3 - Risk in the goods shall pass to the customer on delivery.</dd><dd>4.4 - All goods remain the property of %REPLACE% until paid in full.</dd><dt>5) Payment Terms</dt><dd>5.1 - Account holders: 14 days from date of invoice.</dd><dd>5.2 - Non Account holders: Prior to or on delivery of skip. The owner accepts major credit/debit cards & cash.</dd></dl>',
    headedInvoiceTemplate: 'headed-invoice-ynd',
    unheadedInvoiceTemplate: 'nonheaded-invoice',
    headedCreditNoteTemplate: 'headed-credit-note-ynd',
    wasteTransferNoteTemplate: 'waste-transfer-note-ynd',
    podTemplate: 'pod-ynd',
    companyLogo:'data:image/jpeg;base64,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',
  }
};
