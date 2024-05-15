export class EnvironmentSettings {
  id: number = -1;

  organisationId:number = 1;

  // Company Info
  companyName: string = '';
  qrFillColor: string = '';
  qrImage: string = '';
  comnpanyNumber: string = '';

  // System Usage Info
  defaultTareWeightUnit: string = '';
  defaultQuoteNoPrefix: string = '';
  defaultEmployeeNoPrefix: string = '';
  defaultWeighbridgeDepot: number = -1;
  defaultVehicleDepot: number = -1;

  // Invoicing Settings
  invoicePrefix: string = '';
  invoiceTerms: string = '';
  invoiceComments: string = '';
  address1: string = '';
  address2: string = '';
  addressCity: string = '';
  addressCountry: string = '';
  addressPostcode: string = '';
  addressEmail: string = '';
  addressPhone: string = '';
  wasteTransferTermsBlockA: string = '';
  wasteTransferTermsBlockB: string = '';

  createdAt: string = '';
  updatedAt: string = '';
}
