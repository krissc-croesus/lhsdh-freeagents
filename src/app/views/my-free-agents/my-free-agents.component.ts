import { Component, OnInit } from '@angular/core';
import { PlayersService } from 'src/app/services/players.service';
import { Player } from 'src/app/models/player';
import { Auth, Hub } from 'aws-amplify';
import { OffersService } from 'src/app/services/offers.service';
import { Offer } from 'src/app/models/offer';

const formatter = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0
})

@Component({
  selector: 'app-my-free-agents',
  templateUrl: './my-free-agents.component.html',
  styleUrls: ['./my-free-agents.component.css'],
})

export class MyFreeAgentsComponent implements OnInit {
  // players
  ufas: Player[] = [];
  rfas: Player[] = [];
  trenteCinq: Player[] = [];

  // offers
  playersWithOfferIds: number[] = [];
  playersWithOffer: Player[] = [];
  myOffers: Offer[] = [];

  constructor(private playerService: PlayersService, private offerService: OffersService) {}

  ngOnInit(): void {

    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];
      this.fetchPlayersWithOffer(team);
    })
    .catch(() => console.log('Not signed in'));
  }

  fetchPlayersWithOffer(team: number){
    this.offerService.getOffersByTeam(team).subscribe(
      (offers) => {
        this.myOffers = offers;

        this.myOffers.forEach(offer => {
          if(offer.isOwner){
            this.playersWithOfferIds.push(offer.playerId);
          }
        });

        this.fetchFreeAgents(team);
      },
      (error) => {
        console.error(error);
        this.fetchFreeAgents(team);
      }
    );
  }

  fetchFreeAgents(team: number){

    this.playerService.getPlayersFromTeam(team, true).subscribe((players) => {
      for (let player of players) {

        if (this.playersWithOfferIds.indexOf(player.uniqueID) !== -1) {
          this.playersWithOffer.push(player);

        } else {
          switch (player.status) {
            case 'UFA':
              this.ufas.push(player);
              break;
            case 'RFA':
              this.rfas.push(player);
              break;
            case '35+':
              this.trenteCinq.push(player);
              break;

            default:
              break;
          }
        }
      }
    }, (error) => {
        window.alert(error);
    });
  }

  getContractFor(playerId: number){
    var amount = "0$";
    this.myOffers.forEach(offer => {
      if(offer.playerId == playerId){
        amount = formatter.format(offer.amount);
      }
    });

    return amount;
  }

}
