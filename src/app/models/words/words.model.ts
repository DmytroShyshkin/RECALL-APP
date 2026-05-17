import { TranslationDTO } from "../translations/translations.model";

// models/words.model.ts
export interface WordsDTO {
  id: string;
  sourceLanguage: string;
  originalWord: string;
  synonymIds: string[];
  translations?: TranslationDTO[];
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}