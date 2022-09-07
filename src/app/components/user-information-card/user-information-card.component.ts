import { Component, Input, OnInit } from '@angular/core';
import { InformationCardData } from 'src/app/types/user-information-card.types';
import { tutorialCardInformation } from '../../config/tutorialConfig';

@Component({
  selector: 'app-user-information-card',
  templateUrl: './user-information-card.component.html',
  styleUrls: ['./user-information-card.component.css'],
})
export class UserInformationCardComponent implements OnInit {
  @Input() currentInformation: InformationCardData = tutorialCardInformation[0];

  constructor() {}

  ngOnInit(): void {}
}
