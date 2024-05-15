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
export class HeaderService {

  /**
   * Visible property for setting if header is shown or not
   */
  private _visible: boolean = true;

  /**
   * Title to display within the header
   */
  private _title: string  = '';

  /**
   * An array of all current header items
   */
  private _items: HeaderItem[] = [];
  
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


  /**
   * Gets the title of the header
   * 
   * @returns string
   */
  get title(): string {
    return this._title;
  }

  /**
   * Sets the title of the header
   * if null or undefined is provided error is thrown
   * 
   * @params value string text for title
   * 
   * @returns void
   */
  set title(value: string) {

    if(value === null || value === undefined) {
      throw new Error('HeaderService: Value must be a string');
    }

    this._title = value;
  }

  /**
   * Adds a single item to the header
   * @param item HeaderItem header item to add.
   * 
   * @returns void
   */
  addHeaderItem(item: HeaderItem): void {
      this.errorCheckHeaderItem(item);

      this._items.push(item);
  }

  /**
   * Returns back all current menu items
   * 
   * @returns HeaderItem[]
   */
  get items(): HeaderItem[] {
    return this._items;
  }

  /**
   * Sets the items for the header
   * 
   * @param items HeaderItem[] items for header
   * 
   * @returns void
   */
  set items(items: HeaderItem[]) {
    if(items === undefined || items === null) {
      throw new Error('HeaderService: Items must be defined');
    }
    // Error checks each item
    items.map(this.errorCheckHeaderItem);

    this._items = items;
  } 

  /**
   * Clears down all menu items
   * 
   * @returns void
   */
  clearItems(): void {
    this._items = [];
  }

  /**
   * This function ensures the provided header item does not contain any invalid data.
   * 
   * @param item HeaderItem Header item to check.
   * 
   * @returns void 
   */
  private errorCheckHeaderItem(item: HeaderItem): void {
    if(item.isExternal === null || item.isExternal === undefined) {
      throw new Error('HeaderService: header item isExternal must be bool');

    }

    if(item.foreColor === '' || item.foreColor === undefined || item.foreColor === null) {
      throw new Error('HeaderService: header item foreColor must be a valid colour');
    }

    if((item.name === '' || item.name === undefined || item.name === null) && !item.icon) {
      throw new Error('HeaderService: header item name must be a valid string');
    }
  }
}
