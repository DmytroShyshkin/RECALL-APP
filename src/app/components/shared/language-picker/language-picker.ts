import { Component, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Drop-in replacement for a plain <input> language field. Works with
 * Reactive Forms exactly like a native input (formControlName="...") thanks
 * to ControlValueAccessor — see https://angular.dev/guide/forms/create-custom-form-controls
 *
 * You can always type freely; the dropdown is just a shortcut for languages
 * you've already used, so you never end up with "en" in one word and "EN"
 * in another by accident.
 */
@Component({
  selector: 'app-language-picker',
  imports: [],
  templateUrl: './language-picker.html',
  styleUrl: './language-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguagePicker),
      multi: true,
    },
  ],
})
export class LanguagePicker implements ControlValueAccessor {
  // Languages already used in the user's account — passed in by the parent form.
  @Input() options: string[] = [];
  @Input() placeholder = 'e.g. en';
  // Forwarded onto the inner <input> so <label for="..."> still focuses it —
  // an `id` on the host tag itself wouldn't reach the real input otherwise.
  @Input() id = '';
  // 'single'    — picking an option replaces the whole value.
  // 'multi-csv' — value is a comma-separated list (the Quiz "languages" field);
  //               picking an option toggles it in/out of that list instead.
  @Input() mode: 'single' | 'multi-csv' = 'single';

  inputValue = '';
  isOpen = false;
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  // --- ControlValueAccessor ---

  writeValue(value: string): void {
    this.inputValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- Filtering ---

  get filteredOptions(): string[] {
    const term = this.currentTypedTerm.toLowerCase();
    if (!term) return this.options;
    return this.options.filter((option) => option.toLowerCase().includes(term));
  }

  // The part of inputValue relevant to filtering — in multi-csv mode that's
  // only whatever is being typed after the last comma.
  private get currentTypedTerm(): string {
    if (this.mode === 'single') return this.inputValue;
    const parts = this.inputValue.split(',');
    return parts[parts.length - 1].trim();
  }

  private get selectedInCsv(): string[] {
    if (this.mode !== 'multi-csv') return [];
    return this.inputValue
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);
  }

  isSelected(option: string): boolean {
    return this.selectedInCsv.includes(option);
  }

  // --- Interactions ---

  onInput(value: string): void {
    this.inputValue = value;
    this.isOpen = true;
    this.onChange(this.inputValue);
  }

  onFocus(): void {
    this.isOpen = true;
  }

  selectOption(option: string): void {
    if (this.mode === 'single') {
      this.inputValue = option;
      this.onChange(this.inputValue);
      this.isOpen = false;
      return;
    }

    // multi-csv: toggle the option in/out of the comma-separated list,
    // dropdown stays open so more than one language can be picked in a row.
    const current = this.selectedInCsv;
    const next = current.includes(option)
      ? current.filter((l) => l !== option)
      : [...current, option];
    this.inputValue = next.join(', ');
    this.onChange(this.inputValue);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.isOpen) this.onTouched();
      this.isOpen = false;
    }
  }
}
