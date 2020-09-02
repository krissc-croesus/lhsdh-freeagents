import { Component, OnInit } from '@angular/core';
import { Auth, Hub } from 'aws-amplify';
import { PlayersService } from 'src/app/services/players.service';
import { Player } from 'src/app/models/player';
import {MatTableDataSource} from '@angular/material/table';
import { PlayerMapperService } from 'src/app/services/player-mapper.service';
import { Team } from 'src/app/models/team';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-my-salary-cap',
  templateUrl: './my-salary-cap.component.html',
  styleUrls: ['./my-salary-cap.component.css'],
})
export class MySalaryCapComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'position',
    'OVK',
    'statut',
    'salary',
    'expectedSalary',
  ];
  allTeams: Team[] = [];
  selectedTeam: Team;
  isAdmin: boolean = true;

  forwards: Player[] = [];
  defensemen: Player[] = [];
  goalies: Player[] = [];
  players35: Player[] = [];

  forwardDataSource: MatTableDataSource<Player> = new MatTableDataSource();
  defenseDataSource: MatTableDataSource<Player> = new MatTableDataSource();
  goalieDataSource: MatTableDataSource<Player> = new MatTableDataSource();
  players35DataSource: MatTableDataSource<Player> = new MatTableDataSource();

  currentTeamName: string = '';
  currentTeamLogoURL: string = '';

  constructor(
    private playerService: PlayersService,
    private playerMapperService: PlayerMapperService
  ) {}

  ngOnInit(): void {
    Auth.currentUserInfo()
      .then((info) => {
        // For admin
        const isAdmin = info.attributes['custom:isAdmin'];
        this.isAdmin = (isAdmin == 1);

        if (this.isAdmin) {
          this.fillTeamList();
        }

        const team = info.attributes['custom:team'];
        this.initTables(team);
      })
      .catch(() => console.log('Not signed in'));
  }

  initTables(team: number) {
    this.setTeam(team);
    this.splitPlayers(team);
  }

  fillTeamList() {
    for (let index = 1; index <= 31; index++) {
      const team: Team = this.playerMapperService.mapTeam(index);
      this.allTeams.push(team);
    }
    this.allTeams.sort((a, b) => a.teamCity.localeCompare(b.teamCity));
  }

  onTeamSelect(event: MatSelectChange) {
    var newTeam: Team = event.value;

    // clear tables
    this.forwards = [];
    this.defensemen = [];
    this.goalies = [];
    this.players35 = [];

    this.initTables(newTeam.teamID);
  }

  setTeam(teamID: number) {
    const team: Team = this.playerMapperService.mapTeam(+teamID);
    this.selectedTeam = team;
    this.currentTeamName = team.teamCity + ' ' + team.teamName;
    this.currentTeamLogoURL =
      'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/' +
      team.logoId +
      '.svg';
  }

  splitPlayers(team: number) {
    this.playerService.getPlayersFromTeam(team, false).subscribe((players) => {
      for (let player of players) {
        if (player.status === '35+') {
          this.players35.push(player);
        } else {
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
        }
      }

      this.sortPlayers(this.forwards);
      this.forwardDataSource.data = this.forwards as Player[];

      this.sortPlayers(this.defensemen);
      this.defenseDataSource.data = this.defensemen as Player[];

      this.sortPlayers(this.goalies);
      this.goalieDataSource.data = this.goalies as Player[];

      this.sortPlayers(this.players35);
      this.players35DataSource.data = this.players35 as Player[];
    });
  }

  sortPlayers(players: Player[]) {
    var sortedArray = players.sort((a: Player, b: Player) => {
      if (a.OVK < b.OVK) {
        return 1;
      }

      if (a.OVK > b.OVK) {
        return -1;
      }

      if (a.salary < b.salary) {
        return -1;
      }
      return 0;
    });
    return sortedArray;
  }

  displayExpectedSalary(player: Player) {
    if (player.status === 'UFA') {
      return player.expectedSalary.max;
    } else if (player.status === 'RFA') {
      return player.expectedSalary.min;
    } else if (player.status === '35+') {
      return player.expectedSalary.min;
    }
    return player.salary;
  }

  getFwdTop12Cap() {
    return this.getCapForTop(this.forwards, 12);
  }

  getFwdTop12ExpCap() {
    return this.getExpectedCapFor(this.forwards, 12);
  }

  getDefTop6Cap() {
    return this.getCapForTop(this.defensemen, 6);
  }

  getDefTop6ExpCap() {
    return this.getExpectedCapFor(this.defensemen, 6);
  }

  getGoalTop2Cap() {
    return this.getCapForTop(this.goalies, 2);
  }

  getGoalTop2ExpCap() {
    return this.getExpectedCapFor(this.goalies, 2);
  }

  getTotalCap() {
    return this.getFwdTop12Cap() + this.getDefTop6Cap() + this.getGoalTop2Cap();
  }

  getTotalExpCap() {
    return (
      this.getFwdTop12ExpCap() +
      this.getDefTop6ExpCap() +
      this.getGoalTop2ExpCap()
    );
  }

  getTotalFreeSpace() {
    return 50000000 - this.getTotalCap();
  }

  getTotalExpFreeSpace() {
    return 50000000 - this.getTotalExpCap();
  }

  getCapForTop(players: Player[], top: number) {
    let cap = 0;

    if(players.length < top)
    {
      return cap;
    }

    for (let index = 0; index < top; index++) {
      const player = players[index];
      if(player.salary){
        cap += player.salary;
      }
    }

    if (players.length > top) {
      for (let index = top; index < players.length; index++) {
        const player = players[index];

        if (player.salary && player.salary > 1000000) {
          cap += player.salary - 1000000;
        }
      }
    }
    return cap;
  }

  getExpectedCapFor(players: Player[], top: number) {
    let cap = 0;
    if(players.length < top)
    {
      return cap;
    }

    for (let index = 0; index < top; index++) {
      const player = players[index];
      cap += this.displayExpectedSalary(player);
    }

    if (players.length > top) {
      for (let index = top; index < players.length; index++) {
        const player = players[index];

        const expectedSalary = this.displayExpectedSalary(player);
        if (expectedSalary > 1000000) {
          cap += expectedSalary - 1000000;
        }
      }
    }
    return cap;
  }

  getColorPlayer(player: Player) {
    if (player.salary > 1000000) {
      return 'yellow';
    } else {
      return 'inherited';
    }
  }
}
