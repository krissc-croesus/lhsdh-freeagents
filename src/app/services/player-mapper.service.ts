import { Injectable } from '@angular/core';
import { PlayerResponse } from '../models/backend/playerResponse';
import { Player } from '../models/player';
import { Team } from '../models/team';
import { SalaryScaleService } from './salary-scale.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerMapperService {
  constructor(private salaryScaleService: SalaryScaleService) {}

  playerResponseToPlayer(playerResponse: PlayerResponse): Player {
    var player: Player = new Player(
      playerResponse.uniqueID,
      playerResponse.name
    );
    player.OVK = playerResponse.ovk;
    player.URLLink = playerResponse.urlLink;
    player.age = playerResponse.age;
    player.contract = playerResponse.contract;
    player.isFA = playerResponse.isFA;
    player.position = playerResponse.position;
    player.salary = playerResponse.salary;
    player.team = this.mapTeam(playerResponse.team);
    player.status = this.mapStatus(playerResponse.isFA, playerResponse.age);
    player.expectedSalary = this.salaryScaleService.getPlayerExpectedSalary(player);
    return player;
  }

  mapStatus(IsFA: boolean, Age: number): string {
    if (IsFA) {
      if (Age > 26) {
        if (Age > 34) {
          return '35+';
        }
        return 'UFA';
      } else {
        return 'RFA';
      }
    } else {
      return 'Signed';
    }
  }

  mapTeam(teamId: number): Team {
    switch (teamId) {
      case 1:
        return new Team(teamId, 'Buffalo', 'Sabres', 7);
      case 2:
        return new Team(teamId, 'Ottawa ', 'Senators', 9);
      case 3:
        return new Team(teamId, 'Montreal', 'Canadiens', 8);
      case 4:
        return new Team(teamId, 'Boston', 'Bruins', 6);
      case 5:
        return new Team(teamId, 'Toronto', 'Maple Leafs', 10);
      case 6:
        return new Team(teamId, 'Pittsburgh', 'Penguins', 5);
      case 7:
        return new Team(teamId, 'Philadelphia', 'Flyers', 4);
      case 8:
        return new Team(teamId, 'Winnipeg', 'Jets', 52);
      case 9:
        return new Team(teamId, 'Florida', 'Panthers', 13);
      case 10:
        return new Team(teamId, 'Tampa Bay', 'Lightning', 14);
      case 11:
        return new Team(teamId, 'NYR', 'Rangers', 3);
      case 12:
        return new Team(teamId, 'NYI', 'Islanders', 2);
      case 13:
        return new Team(teamId, 'New Jersey', 'Devils', 1);
      case 14:
        return new Team(teamId, 'Washington', 'Capitals', 15);
      case 15:
        return new Team(teamId, 'Carolina', 'Hurricanes', 12);
      case 16:
        return new Team(teamId, 'Dallas', 'Stars', 25);
      case 17:
        return new Team(teamId, 'Chicago', 'Blackhawks', 16);
      case 18:
        return new Team(teamId, 'San Jose', 'Sharks', 28);
      case 19:
        return new Team(teamId, 'St. Louis', 'Blues', 19);
      case 20:
        return new Team(teamId, 'Vancouver', 'Canucks', 23);
      case 21:
        return new Team(teamId, 'Columbus', 'Blue Jackets', 29);
      case 22:
        return new Team(teamId, 'Detroit', 'Red Wings', 17);
      case 23:
        return new Team(teamId, 'Colorado', 'Avalanche', 21);
      case 24:
        return new Team(teamId, 'Calgary', 'Flames', 20);
      case 25:
        return new Team(teamId, 'Edmonton', 'Oilers', 22);
      case 26:
        return new Team(teamId, 'Phoenix', 'Coyotes', 53);
      case 27:
        return new Team(teamId, 'Anaheim', 'Ducks', 24);
      case 28:
        return new Team(teamId, 'Los Angeles', 'Kings', 26);
      case 29:
        return new Team(teamId, 'Nashville', 'Predators', 18);
      case 30:
        return new Team(teamId, 'Minnesota', 'Wild', 30);
      case 31:
        return new Team(teamId, 'Vegas', 'Golden Knights', 54);
      default:
        return new Team(teamId, 'Unknown', 'Team', 0);
    }
  }
}
