import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/models/player';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @ViewChild('pageTop') pageTop: ElementRef;

  freeAgentsDataSource: Player[] = [];
  allRFAs: Player[] = [];
  allUFAs: Player[] = [];

  filteredPlayers: Player[] = [];

  selectedStatus: string = 'UFA';

  pageSize: number = 20;
  pageStart: number = 0;
  pageEnd: number = 0;

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
    this.allUFAs = [];
    this.allRFAs = [];

    for (let index = 0; index < this.freeAgentsDataSource.length; index++) {
      const player = this.freeAgentsDataSource[index];

      if (player.status === 'UFA') {
        this.allUFAs.push(player);
      } else if (player.status === 'RFA') {
        this.allRFAs.push(player);
      }
    }

    this.goToFirstPage();
  }

  get activePlayers(): Player[] {
    return this.selectedStatus === 'RFA' ? this.allRFAs : this.allUFAs;
  }

  get maxPlayers(): number {
    return this.activePlayers.length;
  }

  selectStatus(status: string) {
    if (status == null || status === this.selectedStatus) {
      return;
    }

    this.selectedStatus = status;
    this.goToFirstPage();
    this.scrollToTop();
  }

  // Le conteneur qui défile est le mat-sidenav-content, pas la fenêtre, donc
  // window.scrollTo n'aurait aucun effet. On remonte les parents jusqu'au
  // premier conteneur défilable au lieu de coder le sélecteur en dur.
  // (Chrome ignore behavior:'smooth' sur ce conteneur, d'où le saut instantané.)
  scrollToTop() {
    let element: HTMLElement = this.pageTop?.nativeElement.parentElement;

    while (element != null) {
      const overflowY = getComputedStyle(element).overflowY;

      if (element.scrollHeight > element.clientHeight && (overflowY === 'auto' || overflowY === 'scroll')) {
        element.scrollTop = 0;
        return;
      }

      element = element.parentElement;
    }

    window.scrollTo(0, 0);
  }

  goToFirstPage() {
    this.pageStart = 0;
    this.pageEnd = Math.min(this.pageSize, this.maxPlayers);
    this.filter();
  }

  filter() {
    this.filteredPlayers = this.activePlayers.slice(this.pageStart, this.pageEnd);
  }

  nextPage() {
    if (this.pageEnd >= this.maxPlayers) {
      return;
    }

    this.pageStart += this.pageSize;
    this.pageEnd = Math.min(this.pageEnd + this.pageSize, this.maxPlayers);

    this.filter();
    this.scrollToTop();
  }

  previousPage() {
    if (this.pageStart === 0) {
      return;
    }

    this.pageStart = Math.max(this.pageStart - this.pageSize, 0);
    this.pageEnd = Math.min(this.pageStart + this.pageSize, this.maxPlayers);

    this.filter();
    this.scrollToTop();
  }

}
