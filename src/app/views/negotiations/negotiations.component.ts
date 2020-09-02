import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { Offer } from 'src/app/models/offer';
import { PlayersService } from 'src/app/services/players.service';
import { OffersService } from 'src/app/services/offers.service';
import { Auth } from 'aws-amplify';

const formatter = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0
})
@Component({
  selector: 'app-negotiations',
  templateUrl: './negotiations.component.html',
  styleUrls: ['./negotiations.component.css'],
})
export class NegotiationsComponent implements OnInit {
  storageKey: string = 'WANTED';
  allPlayers: Player[] = [];
  wantedPlayers: Player[] = [];
  playersWithOffer: Player[] = [];
  playersWithOfferIds: number[] = [];
  offersMade: Offer[] = [];

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
        this.offersMade = offers;

        this.offersMade.forEach(offer => {
          if(!offer.isOwner){
            this.playersWithOfferIds.push(offer.playerId);
          }
        });

        this.getAllPlayers();
      },
      (error) => {
        console.error(error);
        this.getAllPlayers();
      }
    );
  }

  getAllPlayers() {
    this.playerService.getFreeAgents().subscribe(
      (players) => {
        this.allPlayers = players;

        var savedNegociations = JSON.parse(
          localStorage.getItem(this.storageKey)
        );
        if (savedNegociations != null) {

          this.allPlayers.forEach((player) => {
           savedNegociations.forEach((element)=> {

             if (player.uniqueID === element) {
              if (this.playersWithOfferIds.indexOf(player.uniqueID) !== -1) {
                this.playersWithOffer.push(player);
              }else {
                this.wantedPlayers.push(player);
              }
              }
            });
          });
        }
      },
      (error) => {
        window.alert(error);
      }
    );
  }

  getContractFor(playerId: number){
    var amount = "0$";
    this.offersMade.forEach(offer => {
      if(offer.playerId == playerId){
        amount = formatter.format(offer.amount);
      }
    });
    return amount;
  }

  getChipColor(player: Player){
    if(player != null){
      if(player.status === 'UFA')
      {
        return 'primary';
      }
      if(player.status === 'RFA')
      {
        return 'accent';
      }
      if(player.status === '35+')
      {
        return 'warn';
      }
    }
  }

}
