import { Team } from './team';
import { ExpectedSalary } from '../services/salary-scale.service';

const formatter = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0
})

export class Player {
	uniqueID: number;
	name: string;
	URLLink: string;
	team: Team;
	contract: number;
	salary: number;
	OVK: number;
	position: string;
	isFA: boolean;
	age: number;
  status: string;
  expectedSalary: ExpectedSalary;

  constructor(	uniqueID: number, name: string){
    this.uniqueID = uniqueID;
    this.name = name;
  }

  get teamCity(){
    if(this.team)
    {
      return this.team.teamCity;
    }
    return null;
  }

  get expSalary(): string{
    if(this.expectedSalary)
    {
      const min = formatter.format(this.expectedSalary.min);
      const max = formatter.format(this.expectedSalary.max);
      return min + " à " + max;
    }
    return "";
  }

}
