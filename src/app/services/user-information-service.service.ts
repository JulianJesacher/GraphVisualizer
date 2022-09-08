import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InformationType, InformationCardData } from '../types/user-information-card.types';

@Injectable({
  providedIn: 'root',
})
export class UserInformationServiceService {
  public cardInformationType$ = new BehaviorSubject<InformationType | null>(null);
  public cardInformation$ = new BehaviorSubject<InformationCardData[] | null>(null);
  public cardVisible$ = new BehaviorSubject<boolean>(false);

  constructor() {}
}
