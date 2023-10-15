// Angular modules
import { Injectable } from '@angular/core';

@Injectable()
export class StringHelper {
  /** JavaScript equivalent to printf/String.Format
   *  https://stackoverflow.com/a/31007976/7462178
   */
  public static interpolate(theString: string, argumentArray: string[]): string {
    let regex = /%s/;
    let _r = function (p: string, c: string) { return p.replace(regex, c); };
    return argumentArray.reduce(_r, theString);
  }

  public static buildURIParams(parameters: object): string {
    const parts = new URLSearchParams()

    for (const [key, value] of Object.entries(parameters)) {
      if (key === undefined || value === undefined)
        continue;
      parts.append(key, value)
    }

    return '?' + parts.toString()
  }

  public static numberOnly(evt: any) {
    const key = evt.keyCode
    const char = String.fromCharCode((96 <= key && key <= 105) ? key - 48 : key)
    if (![8, 10, 13, 46].includes(evt.keyCode) && !/[0-9]/.test(char)) {
      evt.preventDefault()
    }
  }

  public static phoneNumber14Digit(evt: any) {
    const currentValue = evt.target.value;
    const newValue = currentValue.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    const formattedValue = newValue.slice(0, 14); // Ensure the value has a maximum length of 14 characters
  
    const pressedKey = evt.key;
    const isBackspace = pressedKey === 'Backspace';
  
    if (newValue.length >= 13 && !isBackspace) {
      evt.preventDefault(); // Prevent the default event from occurring (typing / pasting)
    } else {
      if (formattedValue !== currentValue) {
        evt.target.value = formattedValue;
      }
    }
  }

  public static getFinancialYearStart() {
    let currentYear: number;
    if (new Date().getMonth() > 5) {
       currentYear = new Date().getFullYear();
    } else  currentYear = new Date().getFullYear() - 1;
    
    return currentYear;
  }
}
