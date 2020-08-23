import { Injectable, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlayerResponse } from '../models/backend/playerResponse';
import { PlayerMapperService } from './player-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  PLAYER_RESSOURCE_URL = 'https://lhsdb-fa-api.piriwin.com/players';

  constructor(
    private restClient: HttpClient,
    private playerMapper: PlayerMapperService) { }

  getFreeAgents(): Observable<Player[]> {
    return this.restClient.get<PlayerResponse>(this.PLAYER_RESSOURCE_URL + '/freeagents')
      .pipe(
        map(responseData => {
          const playersArray: Player[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const playerResponse = { ...responseData[key] };
              const mappedPlayer = this.playerMapper.playerResponseToPlayer(playerResponse);
              playersArray.push(mappedPlayer);
            }
          }
          return playersArray;
        }));
  }

  getPlayersFromTeam (teamId: number, onlyFA:boolean): Observable<Player[]>{

    let queryParams = new HttpParams().set('faOnly', String(onlyFA));

    return this.restClient.get<PlayerResponse>(this.PLAYER_RESSOURCE_URL + '/teams/' + teamId, { params: queryParams })
    .pipe(
      map(responseData => {
        const playersArray: Player[] = [];

        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const playerResponse = { ...responseData[key] };
            const mappedPlayer = this.playerMapper.playerResponseToPlayer(playerResponse);
            playersArray.push(mappedPlayer);
          }
        }
        return playersArray;
      }));
  }


}
