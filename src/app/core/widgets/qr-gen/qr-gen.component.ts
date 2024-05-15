import { Component, OnInit, Input } from '@angular/core';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ContainerService } from 'src/app/container/services/container.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-qr-gen',
  templateUrl: './qr-gen.component.html',
  styleUrls: ['./qr-gen.component.scss']
})
export class QrGenComponent implements OnInit {
  @Input()
  input = '';

  @Input()
  size = 0;

  constructor(private domS: DomSanitizer, private containerService: ContainerService) { }

  ngOnInit(): void {

  }

  saveCanvas(){
    var link = document.createElement('a');
    let canvas = document.querySelector('#canvas-area canvas') as HTMLCanvasElement;
    link.download = 'SN-' + this.input + '.png';
    const base64Image = canvas.toDataURL();

    this.containerService.pdf({
      image: base64Image,
      serial: this.input,
      companyInfo: environment.invoicing.address1 + '<br>' + environment.invoicing.address2 + '<br>' + environment.invoicing.addressCity + '<br>' + environment.invoicing.addressCountry + '<br>' + environment.invoicing.addressPostcode,
      logo: environment.invoicing.companyLogo,
    })
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not download pdf');
      return e;
    }))
    .subscribe((data: any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
    })

  }

  getQRFill(): string {
    return environment.defaults.qrFillColor;
  }

  getQRImage() {
    return document.getElementById("img-buffer");
  }

  getQRImageSrc() {
    return this.domS.bypassSecurityTrustUrl(environment.defaults.qrImage);
  }
}
