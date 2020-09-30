import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { AlertServiceService } from 'src/app/services/alert-service.service';
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

  constructor(private playerService: PlayersService, private alertService: AlertServiceService) { }

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

      if(player.status === 'UFA'){
       // if(this.allUFAs.length < 10){
          this.allUFAs.push(player);
        //}
      }else if(player.status === 'RFA'){
        this.allRFAs.push(player);
      }
    }
    this.filter();
  }

  filter() {
    for (let index = 0; index < 20; index++) {
      const ufa = this.allUFAs[index];

      this.filteredUFAs.push(ufa);
    }
  }

}
