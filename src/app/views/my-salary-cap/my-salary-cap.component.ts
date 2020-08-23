import { Component, OnInit } from '@angular/core';
import { Auth, Hub } from 'aws-amplify';
import { PlayersService } from 'src/app/services/players.service';
import { Player } from 'src/app/models/player';
import {MatTableDataSource} from '@angular/material/table';
import { PlayerMapperService } from 'src/app/services/player-mapper.service';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-my-salary-cap',
  templateUrl: './my-salary-cap.component.html',
  styleUrls: ['./my-salary-cap.component.css']
})
export class MySalaryCapComponent implements OnInit {

  displayedColumns: string[] = ['name', 'position', 'OVK', 'statut', 'salary', 'expectedSalary'];

  forwards: Player[] = [];
  defensemen: Player[] = [];
  goalies: Player[] = [];

  forwardDataSource: MatTableDataSource<Player> = new MatTableDataSource();
  defenseDataSource: MatTableDataSource<Player> = new MatTableDataSource();
  goalieDataSource: MatTableDataSource<Player> = new MatTableDataSource();

  currentTeamName: string = "";
  currentTeamLogoURL: string = "";

  constructor(private playerService: PlayersService, private playerMapperService: PlayerMapperService) { }

  ngOnInit(): void {
    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];
      this.setTeam(team);
      this.splitPlayers(team);
    })
    .catch(() => console.log('Not signed in'));
  }

  setTeam(teamID: number){
    const team: Team = this.playerMapperService.mapTeam(+teamID);
    this.currentTeamName= team.teamCity + " " + team.teamName;
    this.currentTeamLogoURL = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/" + team.logoId + ".svg"
  }

  splitPlayers(team : number)
  {
    this.playerService.getPlayersFromTeam(4, false).subscribe((players) => {

      for (let player of players)
      {
        switch (player.position) {
          case 'Attaquant':
            this.forwards.push(player);
            break;
          case 'Défenseur':
            this.defensemen.push(player);
            break;
          case 'Gardien':
            this.goalies.push(player);
            break;

          default:
            break;
        }

        this.sortPlayers(this.forwards);
        this.forwardDataSource.data = this.forwards as Player[];

        this.sortPlayers(this.defensemen);
        this.defenseDataSource.data = this.defensemen as Player[];

        this.sortPlayers(this.goalies);
        this.goalieDataSource.data = this.goalies as Player[];
      }
    });
  }

  sortPlayers(players: Player[])
  {
    var sortedArray = players.sort((a:Player, b:Player) => {
      if(a.OVK < b.OVK)
      {
        return 1;
      }

      if(a.OVK > b.OVK)
      {
        return -1;
      }

      if(a.salary < b.salary)
      {
        return -1;
      }
      return 0;

    });
    return sortedArray;
  }

  displayExpectedSalary(player: Player)
  {
    if(player.status === 'UFA')
    {
      return player.expectedSalary.max;
    }
    else if(player.status === 'RFA')
    {
      return player.expectedSalary.min;
    }
    else if(player.status === '35+')
    {
      return player.expectedSalary.min;
    }
    return player.salary;
  }

  getFwdTop12Cap() {
    return this.getCapForTop(this.forwards, 12);
  }

  getFwdTop12ExpCap(){
    return this.getExpectedCapFor(this.forwards, 12);
  }

  getDefTop6Cap(){
    return this.getCapForTop(this.defensemen, 6);
  }

  getDefTop6ExpCap(){
    return this.getExpectedCapFor(this.defensemen, 6);
  }

  getGoalTop2Cap(){
    return this.getCapForTop(this.goalies, 2);
  }

  getGoalTop2ExpCap(){
    return this.getExpectedCapFor(this.goalies, 2);
  }

  getTotalCap(){
    return this.getFwdTop12Cap() + this.getDefTop6Cap() + this.getGoalTop2Cap();
  }

  getTotalExpCap(){
    return this.getFwdTop12ExpCap() + this.getDefTop6ExpCap() + this.getGoalTop2ExpCap();
  }

  getTotalFreeSpace(){
    return 50000000 - this.getTotalCap();
  }

  getTotalExpFreeSpace(){
    return 50000000 - this.getTotalExpCap();
  }

  getCapForTop(players:Player[], top:number){
    let cap = 0;
    for (let index = 0; index < top; index++) {
      const player = players[index];
      cap += player.salary;
    }

    if(players.length > top)
    {
      for (let index = top; index < players.length; index++) {
        const player = players[index];

        if(player.salary > 1000000)
        {
          cap += (player.salary - 1000000);
        }
      }
    }
    return cap;
  }

  getExpectedCapFor(players:Player[], top:number){
    let cap = 0;
    for (let index = 0; index < top; index++) {
      const player = players[index];
      cap += this.displayExpectedSalary(player);
    }

    if(players.length > top)
    {
      for (let index = top; index < players.length; index++) {
        const player = players[index];

        const expectedSalary = this.displayExpectedSalary(player);
        if(expectedSalary > 1000000)
        {
          cap += (expectedSalary - 1000000);
        }
      }
    }
    return cap;
  }

  getColorPlayer(player: Player){
      if(player.salary > 1000000)
      {
        return "yellow";
      }
      else{
        return "inherited";
      }
  }


}
