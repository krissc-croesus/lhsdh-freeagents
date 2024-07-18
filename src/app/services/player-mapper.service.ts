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
    player.isFA = playerResponse.isFA;
    player.position = playerResponse.position;
    player.salary = playerResponse.salary;
    player.team = this.mapTeam(playerResponse.team);
    player.status = this.mapStatus(playerResponse.isFA, playerResponse.age);
    player.contract = this.mapContract(playerResponse.contract, playerResponse.isFA, playerResponse.age);
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
        return new Team(teamId, 'Buffalo', 'Sabres', "BUF");
      case 2:
        return new Team(teamId, 'Ottawa ', 'Senators', "OTT");
      case 3:
        return new Team(teamId, 'Montreal', 'Canadiens', "MTL");
      case 4:
        return new Team(teamId, 'Boston', 'Bruins', "BOS");
      case 5:
        return new Team(teamId, 'Toronto', 'Maple Leafs', "TOR");
      case 6:
        return new Team(teamId, 'Pittsburgh', 'Penguins', "PIT");
      case 7:
        return new Team(teamId, 'Philadelphia', 'Flyers', "PHI");
      case 8:
        return new Team(teamId, 'Winnipeg', 'Jets', "WPG");
      case 9:
        return new Team(teamId, 'Florida', 'Panthers', "FLA");
      case 10:
        return new Team(teamId, 'Tampa Bay', 'Lightning', "TBL");
      case 11:
        return new Team(teamId, 'NYR', 'Rangers', "NYR");
      case 12:
        return new Team(teamId, 'NYI', 'Islanders', "NYI");
      case 13:
        return new Team(teamId, 'New Jersey', 'Devils', "NJD");
      case 14:
        return new Team(teamId, 'Washington', 'Capitals', "WSH");
      case 15:
        return new Team(teamId, 'Carolina', 'Hurricanes', "CAR");
      case 16:
        return new Team(teamId, 'Dallas', 'Stars', "DAL");
      case 17:
        return new Team(teamId, 'Chicago', 'Blackhawks', "CHI");
      case 18:
        return new Team(teamId, 'San Jose', 'Sharks', "SJS");
      case 19:
        return new Team(teamId, 'St. Louis', 'Blues', "STL");
      case 20:
        return new Team(teamId, 'Vancouver', 'Canucks', "VAN");
      case 21:
        return new Team(teamId, 'Columbus', 'Blue Jackets', "CBJ");
      case 22:
        return new Team(teamId, 'Detroit', 'Red Wings', "DET");
      case 23:
        return new Team(teamId, 'Colorado', 'Avalanche', "COL");
      case 24:
        return new Team(teamId, 'Calgary', 'Flames', "CGY");
      case 25:
        return new Team(teamId, 'Edmonton', 'Oilers', "EDM");
      case 26:
        return new Team(teamId, 'Phoenix', 'Coyotes', "UTA");
      case 27:
        return new Team(teamId, 'Anaheim', 'Ducks', "ANA");
      case 28:
        return new Team(teamId, 'Los Angeles', 'Kings', "LAK");
      case 29:
        return new Team(teamId, 'Nashville', 'Predators', "NSH");
      case 30:
        return new Team(teamId, 'Minnesota', 'Wild', "MIN");
      case 31:
        return new Team(teamId, 'Vegas', 'Golden Knights', "VGK");
      case 32:
        return new Team(teamId, 'Seattle', 'Kraken', "SEA");
      case 33:
        return new Team(teamId, 'Agent Libres','Libre', "NHL");
      default:
        return new Team(teamId, 'Unknown', 'Team', "NHL");
    }
  }

  mapContract(Contract: number, IsFA: boolean, Age: number): number {
    if (IsFA && Age > 34) {
      return 0;
    }
    return Contract;
  }
}
