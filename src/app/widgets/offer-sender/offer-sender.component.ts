import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-offer-sender',
  templateUrl: './offer-sender.component.html',
  styleUrls: ['./offer-sender.component.css'],
})
export class OfferSenderComponent implements OnInit {
  @Input() player: Player;

  sliderMax: number = 100;
  sliderMin: number = 0;
  sliderStep: number = 10000;
  offerValue: number = 0;

  offerTextBox = new FormControl(this.offerValue);

  constructor() {}

  ngOnInit(): void {
    if (this.player != null) {
      this.sliderMax = this.player.expectedSalary.max;
      this.sliderMin = this.player.expectedSalary.min;

      if (this.player.status === 'UFA') {
        this.offerValue = this.player.expectedSalary.max;
      }
    }

    //[Validators.required, Validators.max(this.sliderMax), Validators.min(this.sliderMin)]
    this.offerTextBox.setValidators([
      Validators.required,
      Validators.max(this.sliderMax),
      Validators.min(this.sliderMin),
    ]);
  }

  getErrorMessage() {
    return "Veuillez entrer une offre valide respectant l'intervalle.";
  }

  formatLabel(value: number) {
    if (value >= 1000000) {
      return value / 1000000 + 'M$';
    }
    return value;
  }

  getOfferTextBox() : FormControl{
    return this.offerTextBox;
  }
}
