import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { OffersService } from 'src/app/services/offers.service';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  freeAgentsDataSource: Player[] = [];
  allRFAs: Player[] = [];
  allUFAs: Player[] = [];

  filteredUFAs: Player[] = [];
  filteredRFAs: Player[] = [];

  pageStart: number = 0;
  pageEnd: number = 20;
  maxUFA: number = 0;

  constructor(private playerService: PlayersService, private alertService: AlertServiceService, private offerService: OffersService) { }

  ngOnInit(): void {
    this.fetchAllFreeAgents();
  }

  fetchAllFreeAgents() {
    this.playerService.getFreeAgents().subscribe(
      (players) => {
        players.sort((a: Player, b: Player) => {
          const n1 = a.OVK;
          const n2 = b.OVK;
          if (n1 < n2) {
            return 1;
          }

          if (n1 > n2) {
            return -1;
          }

          return 0;
        });
        this.freeAgentsDataSource = players as Player[];
        this.split();
      },
      (error) => {
        this.alertService.showErrorMsg(
          "Nous n'avons pas réussi a charger les agents libres. Contacter Kriss"
        );
      }
    );
  }
  split() {
    for (let index = 0; index < this.freeAgentsDataSource.length; index++) {
      const player = this.freeAgentsDataSource[index];

      if (player.status === 'UFA') {
        // if(this.allUFAs.length < 10){
        this.allUFAs.push(player);
        //}
      } else if (player.status === 'RFA') {
        this.allRFAs.push(player);
      }
    }
    this.maxUFA = this.allUFAs.length;
    this.filter();
    //this.filterRFA();
  }

  filter() {
    this.filteredUFAs = []
    for (let index = this.pageStart; index < this.pageEnd; index++) {
      const ufa = this.allUFAs[index];

      this.filteredUFAs.push(ufa);
    }
  }

  filterRFA() {
    this.allRFAs.forEach(
      (player) => {
        this.offerService.getOffersForPlayer(player.uniqueID).subscribe(
          (offers) => {
            if (offers?.length > 0) {
              this.filteredRFAs.push(player);
            }
          },
          (error) => {
            console.error("Error retrieving RFA offers:" + error);
          }
        );
      }
    );
  }

  nextPage() {

    if (this.pageEnd === this.maxUFA) {
      return;
    }

    this.pageStart += 20;
    this.pageEnd += 20;

    if (this.pageEnd > this.maxUFA) {
      this.pageEnd = this.maxUFA;
    }

    this.filter();
  }

  previousPage() {
    if (this.pageStart === 0) {
      return;
    }

    this.pageStart -= 20;
    this.pageEnd -= 20;

    if (this.pageStart < 0) {
      this.pageStart = 0;
    }

    this.filter();
  }

}
