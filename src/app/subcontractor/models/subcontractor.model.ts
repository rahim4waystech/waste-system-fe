export class Subcontractor {
  id: number = -1;
  subcontractorTypeId: number = 1;
  parentId: number = -1;

  name: string = '';
  notes: string = '';

  contactName: string = '';
  contactTelephone: string = '';
  contactEmail: string = '';
  contactAddressLine1: string = '';
  contactAddressLine2: string = '';
  contactAddressLine3: string = '';
  contactCity: string = '';
  contactCountry: string = '';
  contactPostCode: string = '';

  licenceNumber: string = '';
  carrierLicenceNumber: string = '';
  carrierLicenceExpiryDate: string = '';


  createdAt: string = '';
  updatedAt: string = '';
}
