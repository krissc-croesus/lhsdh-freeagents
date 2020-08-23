import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Offer } from '../models/offer';
import { Auth } from 'aws-amplify';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  OFFERS_RESSOURCE_URL = 'https://lhsdb-fa.us-east-2.elasticbeanstalk.com/players';

  constructor( private restClient: HttpClient) { }

  sendNewContractOffer(player: Player, amount: number){

    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];

      const newOffer: Offer = new Offer(player.uniqueID, team, player.team.teamID, amount, player.status);

      this.restClient.post(this.OFFERS_RESSOURCE_URL, newOffer ).subscribe({
        next: data => console.log(data),
        error: error => console.error('There was an error!', error)
    });
    })
    .catch(() => console.log('Not signed in'));

  }
}
