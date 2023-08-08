import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseProductsService } from 'src/app/servizi/firebase-products.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  constructor(private firebase: FirebaseService,private prodService:FirebaseProductsService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  ngOnInit(): void {

  }

  onDelete() {
    if(this.data.type.toLowerCase() === 'utente'.toLocaleLowerCase())
      this.firebase.deleteUtente(this.data.id).subscribe((data) => {
        console.log(data);
        this.dialogRef.close();
      });
    if(this.data.type.toLowerCase() === 'prodotto'.toLocaleLowerCase())
      this.prodService.deleteProdotto(this.data.prodotto.id).subscribe((data) => {
        console.log(data);
        this.dialogRef.close()
      });  
  }
  onClose() {
    this.dialogRef.close();
  }
}
