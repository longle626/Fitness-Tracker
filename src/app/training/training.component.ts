import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  showCurrentTrainings = false;
  exerciseSubscription?: Subscription;
  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseChange.subscribe(
      (x) => {
        if (x) {
          this.showCurrentTrainings = true;
        } else {
          this.showCurrentTrainings = false;
        }
      }
    );
  }
}
