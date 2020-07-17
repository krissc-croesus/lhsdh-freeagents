import { Injectable } from '@angular/core';
import { Player } from '../models/player';

export interface ExpectedSalary{
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryScaleService {

  constructor() { }

  getPlayerExpectedSalary(player: Player): ExpectedSalary{
    let ret: ExpectedSalary = {min:0, max:8000000};

    if(player.status === '35+')
    {
      return {min:0, max:10000000};
    }

    switch (player.position) {
      case 'Attaquant':
      case 'Défenseur':
      return this.getForwardExpectedSalary(player);

      case 'Gardien':
      return this.getGoalieExpectedSalary(player);
      default:
        return ret;
    }
  }
  private getGoalieExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case (ovk > 83):
        return {min:6500000, max:8000000};
      case (ovk >= 81 && ovk <= 83):
        return {min:5000000, max:6500000};
      case (ovk >= 77 && ovk <= 80):
        return {min:3000000, max:5000000};
      case (ovk >= 75 && ovk <= 76):
        return {min:2000000, max:3000000};
      case (ovk >= 73 && ovk <= 74):
          return {min:1500000, max:2000000};
      case (ovk >= 71 && ovk <= 72):
        return {min:1000000, max:1500000};
      case (ovk >= 69 && ovk <= 70):
        return {min:750000, max:1000000};
      case (ovk >= 65 && ovk <= 68):
        return {min:500000, max:750000};
      case (ovk < 65):
        return {min:300000, max:500000};

      default:
        return {min:0, max:0};
    }

  }
  private getForwardExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case (ovk > 83):
        return {min:6500000, max:8000000};

      case (ovk >= 81 && ovk <= 83):
        return {min:5000000, max:6500000};

      case (ovk >= 77 && ovk <= 80):
        return {min:3500000, max:5000000};

      case (ovk >= 74 && ovk <= 76):
        return {min:2500000, max:3500000};

      case (ovk >= 69 && ovk <= 73):
        return {min:1000000, max:2500000};

      case (ovk >= 65 && ovk <= 68):
        return {min:500000, max:1000000};

      case (ovk < 65):
        return {min:300000, max:500000};

      default:
        return {min:0, max:0};
    }
  }
}
