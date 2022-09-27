import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure to stop?</h1>
    <mat-dialog-content>
      <p>You already got {{ data.progress }}%</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>No</button>
      <button mat-button [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions> `,
})
export class StopTrainingComponenet {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
