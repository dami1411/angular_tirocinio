import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/servizi/firebase.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  constructor(private firebase: FirebaseService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  ngOnInit(): void {

  }

  onDelete() {
    this.firebase.deleteUtente(this.data.id).subscribe((data) => {
      console.log(data);
    });
  }
  onClose() {
    this.dialogRef.close();
  }
}
