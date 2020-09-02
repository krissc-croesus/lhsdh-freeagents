import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(private _snackBar: MatSnackBar) { }

  showConfirmMsg(msg: string)
  {
    this._snackBar.open(msg, 'OK', {duration: 5000, panelClass: ['mat-toolbar', 'mat-primary']});
  }

  showErrorMsg(msg: string)
  {
    this._snackBar.open(msg, 'Oups', {duration: 5000, panelClass: ['mat-toolbar', 'mat-warn']});
  }

  showAccentMsg(msg: string)
  {
    this._snackBar.open(msg, 'OK', {duration: 5000, panelClass: ['mat-toolbar', 'mat-accent']});
  }
}
