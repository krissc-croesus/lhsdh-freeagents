import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { Offer } from 'src/app/models/offer';
import { PlayersService } from 'src/app/services/players.service';
import { OffersService } from 'src/app/services/offers.service';
import { Auth } from 'aws-amplify';
import { AlertServiceService } from 'src/app/services/alert-service.service';

const formatter = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0
});

@Component({
  selector: 'app-negotiations',
  templateUrl: './negotiations.component.html',
  styleUrls: ['./negotiations.component.css'],
})

export class NegotiationsComponent implements OnInit {
  storageKey: string = 'LHSDB-FA-2022';
  allPlayers: Player[] = [];
  playersWithOfferIds: number[] = [];
  offersMade: Offer[] = [];
  isDeleteButtonEnabled: boolean = true;
  
  wantedPlayers: Player[] = [];
  playersWithOffer: Player[] = [];

  constructor(private playerService: PlayersService, private offerService: OffersService, private alertService: AlertServiceService) {}

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
        this.alertService.showErrorMsg("Nous n'avons pas réussi a charger les agents libres. Contacter Kriss");
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

  deleteOffer(playerId : number){
    this.offerService.removeOffer(playerId).subscribe(
      () => {
        console.log("Deleted");
        this.alertService.showConfirmMsg("L'offre a été effacé correctement");
      },
      error => {
        console.log("Error inconnue");
        this.alertService.showErrorMsg("Une erreur s'est produite.");
      }
    );
  }

}
