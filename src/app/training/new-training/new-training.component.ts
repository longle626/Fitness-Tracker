import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  constructor(private trainingService: TrainingService) {}

  exercises: Exercise[] = [];
  @Output() trainingStart = new EventEmitter<void>();

  ngOnInit(): void {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  startTraining() {
    this.trainingStart.emit();
  }
}
