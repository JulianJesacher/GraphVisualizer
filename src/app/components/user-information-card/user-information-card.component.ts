import { Component, Input, OnInit } from '@angular/core';
import { InformationCardData, InformationType } from 'src/app/types/user-information-card.types';
import { tutorialCardInformation } from '../../config/tutorialConfig';

@Component({
  selector: 'app-user-information-card',
  templateUrl: './user-information-card.component.html',
  styleUrls: ['./user-information-card.component.css'],
})
export class UserInformationCardComponent implements OnInit {
  public _currentInformation: InformationCardData[] = [tutorialCardInformation[0]];
  @Input() set currentInformation(newInformation: InformationCardData[]) {
    this._currentInformation = newInformation;
    this._activeIndex = 0;
    this._informationCardAmount = newInformation.length;
    this._singleCard = newInformation.length === 1;
  }

  @Input() currentCardNumber: number = 1;
  public _informationCardAmount: number = 2;
  public _activeIndex: number = 0;
  public _singleCard: boolean = true;

  @Input() currentInformationType: InformationType = InformationType.TUTORIAL;
  public informationTypes = InformationType;

  constructor() {}

  ngOnInit(): void {}

  public nextCard(): void {
    if (this._activeIndex >= this._informationCardAmount - 1) {
      throw new Error('Already at the last card, can no go further!');
    }

    this._activeIndex++;
  }

  public previousCard(): void {
    if (this._activeIndex <= 0) {
      throw new Error('Already at the first card, can not go back!');
    }

    this._activeIndex--;
  }
}
