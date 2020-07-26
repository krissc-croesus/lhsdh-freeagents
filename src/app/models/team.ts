export class Team {
  teamID: number;
  teamName: string;
  teamCity: string;
  logoId: number;

  constructor( teamID: number, teamCity: string, teamName: string, logoID: number){
    this.teamID = teamID;
    this.teamCity = teamCity;
    this.teamName = teamName;
    this.logoId = logoID;
  }
}
