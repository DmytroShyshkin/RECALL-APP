import { Component, ElementRef, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
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
export class LanguagePicker implements ControlValueAccessor, OnInit, OnDestroy {
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

  // Bound once so it can be added/removed with the exact same reference.
  private readonly handleDocumentClick = (event: MouseEvent): void => {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.isOpen) this.onTouched();
      this.isOpen = false;
    }
  };

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Registered on the CAPTURE phase (the `true` below), not the default
    // bubble phase. Inside a modal, the modal's own click handler calls
    // event.stopPropagation() on every click that isn't on the overlay
    // itself (that's what keeps clicking inside the modal from closing it) —
    // that stops the click from ever bubbling up to `document`, so a plain
    // `document:click` listener never fires and the dropdown was staying
    // open forever once you clicked anywhere else in the form. The capture
    // phase runs top-down *before* the click reaches the modal's own
    // handler, so it always sees the click regardless of any later
    // stopPropagation() call.
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

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
}
