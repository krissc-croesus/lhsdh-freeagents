import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Offer } from '../models/offer';
import { Auth } from 'aws-amplify';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  OFFERS_RESSOURCE_URL = 'https://lhsdb-fa-api.piriwin.com/offers';
  //OFFERS_RESSOURCE_URL = 'https://localhost:44351/offers';

  constructor(private restClient: HttpClient) { }

  async sendNewContractOffer(
    player: Player,
    amount: number,
    isOwner: boolean
  ): Promise<boolean> {
    var success: boolean = false;

    await Auth.currentUserInfo()
      .then((info) => {
        const team = info.attributes['custom:team'];
        const newOffer: Offer = new Offer(
          player.uniqueID,
          team,
          info.username,
          isOwner,
          amount,
          player.status,
          player.name
        );

        this.restClient
          .post(this.OFFERS_RESSOURCE_URL, newOffer, { responseType: 'text' })
          .subscribe(
            (data) => {
              console.log('Success data=' + data);
              success = true;
            },
            (error) => {
              console.error('There was an error!' + error, error.message);
              success = false;
            }
          );
      })
      .catch(() => {
        console.log('Not signed in');
      });
    return false;
  }

  getOffersByTeam(teamId: number): Observable<Offer[]> {
    return this.restClient
      .get<Offer>(this.OFFERS_RESSOURCE_URL + '/teams/' + teamId)
      .pipe(
        map((responseData) => {
          const playersArray: Offer[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const offerResponse = { ...responseData[key] };
              // const mappedPlayer = this.playerMapper.playerResponseToPlayer(playerResponse);
              playersArray.push(offerResponse);
            }
          }
          return playersArray;
        })
      );
  }

  getOffersForPlayer(playerId: number): Observable<Offer[]> {
    return this.restClient
      .get<Offer>(this.OFFERS_RESSOURCE_URL + '/players/' + playerId)
      .pipe(
        map((responseData) => {
          const offersArray: Offer[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const offerResponse = { ...responseData[key] };
              offersArray.push(offerResponse);
            }
          }
          return offersArray;
        })
      );
  }

  removeOffer(playerId: number): Observable<any> {
    return this.restClient.delete(this.OFFERS_RESSOURCE_URL + "/" + playerId);
  }
}
