import { Injectable } from '@angular/core';
import { HeaderItem } from '../models/header-item.model';

/**
 * This class is used for all header state through out the app
 *
 * @package Signin
 * @author Four Ways Technology
 */
@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  /**
   * Visible property for setting if header is shown or not
   */
  private _visible: boolean = true;

  /**
   * Title to display within the header
   */
  private _title: string  = '';


  constructor() { }

  /**
   * Gets the if the header is visible or not;.
   *
   * @returns boolean
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Sets if the header is visible
   * throws an error if the provided value is null or undefined.
   *
   * @param value boolean value for setting visible
   *
   * @returns void
   */
  set visible(value: boolean) {

    if(value === null || value === undefined) {
      throw new Error('HeaderService: Value must be a bool');
    }
    this._visible = value;
  }

}
