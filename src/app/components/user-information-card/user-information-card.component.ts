import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InformationCardData, InformationType } from 'src/app/types/user-information-card.types';
import { tutorialCardInformation } from '../../config/tutorialConfig';

@Component({
  selector: 'app-user-information-card',
  templateUrl: './user-information-card.component.html',
  styleUrls: ['./user-information-card.component.css'],
})
export class UserInformationCardComponent implements OnInit {
  public _currentInformation: InformationCardData[] = tutorialCardInformation;
  @Input() set currentInformation(newInformation: InformationCardData[] | null) {
    if (newInformation == null) {
      throw new Error("Information can't be null!");
    }

    this._currentInformation = newInformation;
    this._activeIndex = 0;
    this._informationCardAmount = newInformation.length;
    this._singleCard = newInformation.length === 1;
  }

  public _informationCardAmount!: number;
  public _activeIndex!: number;
  public _singleCard!: boolean;

  public _currentInformationType: InformationType = InformationType.TUTORIAL;
  @Input() set currentInformationType(newValue: InformationType | null) {
    if (newValue == null) {
      throw new Error("Information type can't be null!");
    }

    this._currentInformationType = newValue;
  }
  public informationTypes = InformationType;

  @Output() closeCard = new EventEmitter<void>();

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

  public triggerCloseCard(): void {
    this.closeCard.next();
  }
}
