import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tutorialCardInformation } from '../config/tutorialConfig';
import { InformationType, InformationCardData } from '../types/user-information-card.types';

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  public cardInformationType$ = new BehaviorSubject<InformationType | null>(null);
  public cardInformation$ = new BehaviorSubject<InformationCardData[] | null>(null);
  public cardVisible$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public showTutorial(): void {
    this.cardInformationType$.next(InformationType.TUTORIAL);
    this.cardInformation$.next(tutorialCardInformation);
    this.cardVisible$.next(true);
  }
}
