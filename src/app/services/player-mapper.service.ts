import { Injectable } from '@angular/core';
import { PlayerResponse } from '../models/backend/playerResponse';
import { Player } from '../models/player';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root',
})
export class PlayerMapperService {
  constructor() {}

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
    player.team = this.mapTeam(playerResponse.team);
    player.status = this.mapStatus(playerResponse.isFA, playerResponse.age);
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
        return new Team(teamId, 'Buffalo', 'Sabres');
      case 2:
        return new Team(teamId, 'Ottawa ', 'Senators');
      case 3:
        return new Team(teamId, 'Montreal', 'Canadiens');
      case 4:
        return new Team(teamId, 'Boston', 'Bruins');
      case 5:
        return new Team(teamId, 'Toronto', 'Maple Leafs');
      case 6:
        return new Team(teamId, 'Pittsburgh', 'Penguins');
      case 7:
        return new Team(teamId, 'Philadelphia', 'Flyers');
      case 8:
        return new Team(teamId, 'Winnipeg', 'Jets');
      case 9:
        return new Team(teamId, 'Florida', 'Panthers');
      case 10:
        return new Team(teamId, 'Tampa Bay', 'Lightning');
      case 11:
        return new Team(teamId, 'NYR', 'Rangers');
      case 12:
        return new Team(teamId, 'NYI', 'Islanders');
      case 13:
        return new Team(teamId, 'New Jersey', 'Devils');
      case 14:
        return new Team(teamId, 'Washington', 'Capitals');
      case 15:
        return new Team(teamId, 'Carolina', 'Hurricanes');
      case 16:
        return new Team(teamId, 'Dallas', 'Stars');
      case 17:
        return new Team(teamId, 'Chicago', 'Blackhawks');
      case 18:
        return new Team(teamId, 'San Jose', 'Sharks');
      case 19:
        return new Team(teamId, 'St. Louis', 'Blues');
      case 20:
        return new Team(teamId, 'Vancouver', 'Canucks');
      case 21:
        return new Team(teamId, 'Columbus', 'Blue Jackets');
      case 22:
        return new Team(teamId, 'Detroit', 'Red Wings');
      case 23:
        return new Team(teamId, 'Colorado', 'Avalanche');
      case 24:
        return new Team(teamId, 'Calgary', 'Flames');
      case 25:
        return new Team(teamId, 'Edmonton', 'Oilers');
      case 26:
        return new Team(teamId, 'Phoenix', 'Coyotes');
      case 27:
        return new Team(teamId, 'Anaheim', 'Ducks');
      case 28:
        return new Team(teamId, 'Los Angeles', 'Kings');
      case 29:
        return new Team(teamId, 'Nashville', 'Predators');
      case 30:
        return new Team(teamId, 'Minnesota', 'Wild');
      case 31:
        return new Team(teamId, 'Vegas', 'Golden Knights');
      default:
        return new Team(teamId, 'Unknown', 'Team');
    }
  }
}
