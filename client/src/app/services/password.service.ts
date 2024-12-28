import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private selectedPasswordData: any;

  setSelectedPasswordData(data: any): void {
    this.selectedPasswordData = data;
  }

  getSelectedPasswordData(): any {
    return this.selectedPasswordData;
  }

  clearSelectedPasswordData(): void {
    this.selectedPasswordData = null;
  }
  
}