export class Team {
  teamID: number;
  teamName: string;
  teamCity: string;
  logoId: string;

  constructor( teamID: number, teamCity: string, teamName: string, logoID: string){
    this.teamID = teamID;
    this.teamCity = teamCity;
    this.teamName = teamName;
    this.logoId = logoID;
  }
}
