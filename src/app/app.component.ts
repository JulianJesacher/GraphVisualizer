import { Component, OnInit } from '@angular/core';
import { UserInformationService } from './services/user-information.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public informationService: UserInformationService) {}

  ngOnInit(): void {
    this.informationService.showTutorial();
  }

  closeInformationCard(): void {
    this.informationService.cardVisible$.next(false);
  }
}
