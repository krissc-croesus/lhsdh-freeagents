export class Team {
  teamID: number;
  teamName: string;
  teamCity: string;

  constructor( teamID: number, teamCity: string, teamName: string){
    this.teamID = teamID;
    this.teamCity = teamCity;
    this.teamName = teamName;
  }
}
