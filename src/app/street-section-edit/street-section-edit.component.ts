import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-street-section-edit',
  templateUrl: './street-section-edit.component.html',
  styleUrls: ['./street-section-edit.component.css']
})
export class StreetSectionEditComponent implements OnInit {

  public isLoading = false;
  @Input() strassenliste: string[] = [];
  filteredStrassen: string[] = [
  ];
  @Input() fg: FormGroup;
  @Input() fgIndex: number;
  @Output() deleteStrassenAbschnitt = new EventEmitter();

  public static createAngrStrassenFbGroup(fob: FormBuilder) {
    return fob.group({
      id: [''],
      street: ['', Validators.required],
      house_no_from: [''],
      house_no_to: [''],
      entrance: ['0', Validators.required],
      time_restriction: [''],
      status: ['1', Validators.required],
      reason_slower_buses: [''],
      bus_lines: [''],
      much_bus_traffic: ['0', Validators.required],
      user_note: [''],
      multilane: ['0', Validators.required],
    });
  }

  constructor(
  ) { }

  ngOnInit() {
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
