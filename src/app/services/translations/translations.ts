import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslationDTO } from '../../models/translations/translations.model';

@Injectable({
  providedIn: 'root',
})
export class Translations {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';
  currentTranslations: TranslationDTO | null = null;

  constructor(private http: HttpClient, private router: Router){}

  updateTranslations(translation: TranslationDTO) {
    this.currentTranslations = translation;
  }

  updateTranslationForBackend(){
    return this.h
  }
}
