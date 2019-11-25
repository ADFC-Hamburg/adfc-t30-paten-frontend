import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, Validators, FormGroup } from '@angular/forms';

export function requiredOptionValues(values: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const allowed = values.includes(control.value);
    return allowed ? null : { 'requiredOptionValues': { value: control.value } };
  };
}
@Component({
  selector: 'app-street-section-edit',
  templateUrl: './street-section-edit.component.html',
  styleUrls: ['./street-section-edit.component.css']
})
export class StreetSectionEditComponent {

  public isLoading = false;
  @Input() strassenliste: string[] = [];
  filteredStrassen: string[] = [
  ];
  @Input() fg: FormGroup;
  @Input() fgIndex: number;
  @Output() deleteStrassenAbschnitt = new EventEmitter();

  public static createAngrStrassenFbGroup(fob: FormBuilder) {
    const fg = fob.group({
      id: [''],
      street: ['', Validators.required],
      house_no_from: ['', Validators.required],
      house_no_to: ['', Validators.required],
      entrance: ['0', requiredOptionValues(['0', '1', '2'])],
      time_restriction: [''],
      status: ['0', requiredOptionValues(['1', '2', '3', '4', '5', '6'])],
      reason_slower_buses: [''],
      bus_lines: [''],
      much_bus_traffic: ['0', requiredOptionValues(['1', '2', '3'])],
      user_note: [''],
      mail_sent: [false],
      multilane: ['0', requiredOptionValues(['0', '1'])],
      progress_report: [''],
    });
    fg.get('much_bus_traffic').valueChanges.subscribe(
      much_bus_traffic => {
        if (['2', '3'].includes(much_bus_traffic)) {
          fg.get('bus_lines').enable();
          fg.get('reason_slower_buses').enable();
        } else {
          fg.get('bus_lines').disable();
          fg.get('reason_slower_buses').disable();
        }
      }
    );
    fg.get('status').valueChanges.subscribe(
      status => {
        if (['2', '5'].includes(status)) {
          fg.get('time_restriction').enable();
        } else {
          fg.get('time_restriction').disable();
        }
      }
    );
    fg.get('mail_sent').valueChanges.subscribe(
      mail_sent => {
        if (mail_sent) {
          fg.get('street').disable();
          fg.get('house_no_from').disable();
          fg.get('house_no_to').disable();
          fg.get('entrance').disable();
          fg.get('multilane').disable();
        } else {
          fg.get('street').enable();
          fg.get('house_no_from').enable();
          fg.get('house_no_to').enable();
          fg.get('entrance').enable();
          fg.get('multilane').enable();
        }
      }
    );
    return fg;
  }

  changeStrassenname(search) {
    this.isLoading = true;
    const newEntries = [];
    if (search.length > 3) {
      const lowerSearch = search.toLowerCase();
      //
      for (const entry of this.strassenliste) {
        const idx = entry.toLowerCase().indexOf(lowerSearch);
        if (idx !== -1) {
          newEntries.push(entry);
          if (newEntries.length > 40) {
            break;
          }
        }
      }
    }
    this.filteredStrassen = newEntries;
    this.isLoading = false;

  }
  onDeleteStrassenAbschnitt() {
    this.deleteStrassenAbschnitt.emit(this.fgIndex);
  }
}
