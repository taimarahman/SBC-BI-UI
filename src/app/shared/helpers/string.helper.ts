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

  // GET CURRENT YEAR 
  public static getFinancialYearStart() {
    let currentYear: number;
    if (new Date().getMonth() > 5) {
       currentYear = new Date().getFullYear();
    } else  currentYear = new Date().getFullYear() - 1;
    
    return currentYear;
  }

// GET MONTH AND YEAR FROM PROVIDED DATE (i.e. Jan'23)
  public static getFullMonthNameFromDate(dateString:any) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fullMonthName = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year

    return `${fullMonthName}'${year}`;
  }

  public static convertCapToTitleCase(inputString: string): string {
    const words = inputString.split(/(?=[A-Z])/); // Split by capital letters
    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return titleCaseWords;
  }

  public static convertSnakeToTitleCase(inputString: string): string {
    return inputString.replace(/_/g, ' ');
  }
}
