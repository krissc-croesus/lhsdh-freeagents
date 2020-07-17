import { Team } from './team';

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

  constructor(	uniqueID: number, name: string){
    this.uniqueID = uniqueID;
    this.name = name;
  }
}
