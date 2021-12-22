import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { confirmationModalComponent } from './confirmation-modal.component';
@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer!: number;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(confirmationModalComponent);
  }
}
