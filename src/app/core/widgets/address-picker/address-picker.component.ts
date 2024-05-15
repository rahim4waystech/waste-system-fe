import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressPickerService } from '../../services/address-picker.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss']
})
export class AddressPickerComponent implements OnInit {
  @Input() address1:string = '';
  @Input() address2:string = '';
  @Input() city:string = '';
  @Input() country:string = '';
  @Input() postcode:string = '';

  @Output() onAddressFound: EventEmitter<any> = new EventEmitter();



  completeAddresses: any = [];
  addressList: any = [];

  constructor(
    private addressPickerService: AddressPickerService
  ) { }

  ngOnInit(): void {
  }

  postcodeLookup(){
    if(this.postcode !== '' && this.postcode !== ' ' && this.postcode !== undefined && this.postcode !== null){
      this.addressPickerService.getPostcode(this.postcode)
      .pipe(catchError((e) => {
        if(e.status === 429) {
          alert('Usage limit reached for postcode finder. Contact support');
        } else if(e.status === 404) {
          alert('No addresses found for this postcode. Contact support');
        } else if(e.status === 400) {
          alert('You must enter a valid postcode. Please try again.');
        } else {
          alert('Something went wrong. Contact support');
        }
        return e;
      }))
      .subscribe((data:any) => {
        if(data.addresses.length === 0){
          alert('No Addresses found for ' + this.postcode)
        } else {
          this.addressList = data.addresses;
          this.addressList.forEach(item => {
            // const line = item.split(",");
            let addObj = {
              address1:item.line_1,
              address2:item.line_2,
              address3:item.locality,
              city:item.town_or_city,
              country:item.county,
              postcode: data.postcode,
              sanitisedAddress: ''
            }

            if(addObj.address1 !== '' && addObj.address1 !== ' '){addObj.sanitisedAddress += addObj.address1 + ', ';}
            if(addObj.address2 !== '' && addObj.address2 !== ' '){addObj.sanitisedAddress += addObj.address2 + ', ';}
            if(addObj.address3 !== '' && addObj.address3 !== ' '){addObj.sanitisedAddress += addObj.address3 + ', ';}
            if(addObj.city !== '' && addObj.city !== ' '){addObj.sanitisedAddress += addObj.city + ', ';}
            if(addObj.country !== '' && addObj.country !== ' '){addObj.sanitisedAddress += addObj.country + ', ';}
            if(addObj.postcode !== '' && addObj.postcode !== ' '){addObj.sanitisedAddress += addObj.postcode;}

            this.completeAddresses.push(addObj)
          })

          for(let i=0;i<this.completeAddresses.length;i++){
            this.completeAddresses[i].id = i;
          }
        }
      })
    } else {
      alert('No postcode added')
    }

  }

  changedAddress(event){
    const id = parseInt(event.target.value);
    if(id !== -1){
      const finalAddress = this.completeAddresses.filter(f=>f.id===id);

      this.onAddressFound.next(finalAddress[0]);
    }
  }
}
