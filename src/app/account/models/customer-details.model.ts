import { CustomerCategory } from './customer-category.model';

export class CustomerDetails {
  id: number = -1;
  accountId: number = -1;

  licenceNumber: string = '';
  carrierLicenceNumber: string = '';
  carrierLicenceExpiryDate: string = null;
  wasteCarrier: string = '';

  customerCategory: CustomerCategory = new CustomerCategory();
  customerCategoryId: number = -1;

  invoicePeriodId: number = -1;
  invoiceMethodId: number = -1;
  invoiceSplitByPO: boolean = false;
  invoiceSplitBySite: boolean = false;
  invoiceSplitByOrderType: boolean = false;
  createdAt: string = '';
  updatedAt: string = '';
}
