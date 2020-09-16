import { Injectable } from '@angular/core';
import { Player } from '../models/player';

export interface ExpectedSalary{
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalaryScaleService {
  constructor() {}

  getPlayerExpectedSalary(player: Player): ExpectedSalary {
    let ret: ExpectedSalary = { min: 0, max: 8000000 };

    switch (player.position) {
      case 'Attaquant':
      case 'Défenseur':
        ret = this.getForwardExpectedSalary(player);
      case 'Gardien':
        ret = this.getGoalieExpectedSalary(player);
    }

    if (player.status === '35+') {
      return { min: ret.min, max: 10000000 };
    }
    return ret;
  }
  private getGoalieExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case ovk > 83:
        return { min: 6500000, max: 8000000 };
      case ovk >= 81 && ovk <= 83:
        return { min: 5000000, max: 6500000 };
      case ovk >= 77 && ovk <= 80:
        return { min: 3000000, max: 5000000 };
      case ovk >= 75 && ovk <= 76:
        return { min: 2000000, max: 3000000 };
      case ovk >= 73 && ovk <= 74:
        return { min: 1500000, max: 2000000 };
      case ovk >= 71 && ovk <= 72:
        return { min: 1000000, max: 1500000 };
      case ovk >= 69 && ovk <= 70:
        return { min: 750000, max: 1000000 };
      case ovk >= 65 && ovk <= 68:
        return { min: 500000, max: 750000 };
      case ovk < 65:
        return { min: 300000, max: 500000 };

      default:
        return { min: 0, max: 0 };
    }
  }
  private getForwardExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case ovk > 83:
        return { min: 6500000, max: 8000000 };

      case ovk >= 81 && ovk <= 83:
        return { min: 5000000, max: 6500000 };

      case ovk >= 77 && ovk <= 80:
        return { min: 3500000, max: 5000000 };

      case ovk >= 74 && ovk <= 76:
        return { min: 2500000, max: 3500000 };

      case ovk >= 69 && ovk <= 73:
        return { min: 1000000, max: 2500000 };

      case ovk >= 65 && ovk <= 68:
        return { min: 500000, max: 1000000 };

      case ovk < 65:
        return { min: 300000, max: 500000 };

      default:
        return { min: 0, max: 0 };
    }
  }
  /*
  Compensation pour obtenir un RFA
    7M à 8 M---> 3 choix de 1ere + 2 choix de 2eme
    6M à 7,99M ---> 2 choix de 1ere + 2 choix de 2eme
    5M à 5,99M ---> 2 choix de 1ere + 1 choix de 2eme
    4,2M à 4,99M ---> 2 choix de 1ere
    3,5M à 4,19M ---> 1 choix de 1ere + 1 choix de 2eme
    2,7M à 3,49M ---> 1 choix de 1ere
    2M à 2,69M ---> 2 choix de 2eme
    1M à 1,99M ---> 1 choix de 2eme
  */
  getCompensationForSalary(salary: number): string {
    if (salary >= 7000000) {
      return '3x 1st round + 2x 2nd round';
    } else if (salary >= 6000000) {
      return '2x 1st round + 2x 2nd round';
    } else if (salary >= 5000000) {
      return '2x 1st round + 1 2nd round';
    } else if (salary >= 4200000) {
      return '2x 1st round';
    } else if (salary >= 3500000) {
      return '1x 1st round + 1x 2nd round';
    } else if (salary >= 2700000) {
      return '1st round pick';
    } else if (salary >= 2000000) {
      return '2x 2nd round';
    } else if (salary >= 1000000) {
      return '2nd round pick';
    }
    return '';
  }
}
