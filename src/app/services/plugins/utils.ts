import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Utils {

    formatCurrency (price) {
      return new Intl.NumberFormat('sk', { style: 'currency', currency: 'EUR' }).format(price);
    }

    formatCurrencyNoZero (price) {
      if (price === 0) {
        return '- €';
      }
      return new Intl.NumberFormat('sk', { style: 'currency', currency: 'EUR' }).format(price);
    }
}
