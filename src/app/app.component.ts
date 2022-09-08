import { Component, OnInit } from '@angular/core';
import { tutorialCardInformation } from './config/tutorialConfig';
import { UserInformationServiceService } from './services/user-information-service.service';
import { InformationType } from './types/user-information-card.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public informationService: UserInformationServiceService) {}

  ngOnInit(): void {
    this.informationService.cardInformationType$.next(InformationType.TUTORIAL);
    this.informationService.cardInformation$.next(tutorialCardInformation);
    this.informationService.cardVisible$.next(true);
  }

  closeInformationCard(): void {
    this.informationService.cardVisible$.next(false);
  }
}
