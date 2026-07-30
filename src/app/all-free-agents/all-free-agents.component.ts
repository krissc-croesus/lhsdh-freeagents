import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Player } from '../models/player';
import { Team } from '../models/team';
import { PlayersService } from '../services/players.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Auth } from 'aws-amplify';
import { AlertServiceService } from '../services/alert-service.service';

interface FilterCriteria {
  text: string;
  teamIds: number[];
  positions: string[];
  statuses: string[];
}

@Component({
  selector: 'app-all-free-agents',
  templateUrl: './all-free-agents.component.html',
  styleUrls: ['./all-free-agents.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AllFreeAgentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'teamCity',
    'name',
    'position',
    'OVK',
    'age',
    'status',
    'expSalary',
  ];
  dataSource: MatTableDataSource<Player> = new MatTableDataSource();
  expandedElement: Player | null;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  connectedUserTeam: number = 0;

  // Choix offerts dans les listes de filtres, batis a partir des joueurs charges
  teamOptions: Team[] = [];
  positionOptions: string[] = [];
  statusOptions: string[] = [];

  // Filtres actuellement selectionnes
  searchText: string = '';
  selectedTeamIds: number[] = [];
  selectedPositions: string[] = [];
  selectedStatuses: string[] = [];

  constructor(private playerService: PlayersService, private alertService: AlertServiceService) {
    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];
      this.connectedUserTeam = +team;
    })
    .catch(() => console.log('Not signed in'));
  }

  ngOnInit(): void {
    this.setupFilterPredicate();
    this.playerService.getFreeAgents().subscribe(
      (players) => {
        players.sort((a: Player, b: Player) => {
          if (a.team.teamCity.localeCompare(b.team.teamCity) === 0) {
            if (a.status.localeCompare(b.status) === 0) {
              return a.position.localeCompare(b.position);
            }
            return a.status.localeCompare(b.status) * -1;
          }
          return a.team.teamCity.localeCompare(b.team.teamCity);
        });
        this.dataSource.data = players as Player[];
        this.buildFilterOptions(players as Player[]);
        this.applyFilters();
      },
      (error) => {
        this.alertService.showErrorMsg("Nous n'avons pas réussi a charger les agents libres. Contacter Kriss");
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // Un filtre vide n'impose aucune contrainte : les criteres actifs se cumulent (ET).
  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Player, filter: string) => {
      const criteria: FilterCriteria = JSON.parse(filter);

      if (
        criteria.teamIds.length > 0 &&
        (!data.team || criteria.teamIds.indexOf(data.team.teamID) === -1)
      ) {
        return false;
      }

      if (
        criteria.positions.length > 0 &&
        criteria.positions.indexOf(data.position) === -1
      ) {
        return false;
      }

      if (
        criteria.statuses.length > 0 &&
        criteria.statuses.indexOf(data.status) === -1
      ) {
        return false;
      }

      if (criteria.text) {
        const searchable = [data.name, data.teamCity, data.position]
          .filter((value) => !!value)
          .join(' ')
          .toLowerCase();
        return searchable.includes(criteria.text);
      }

      return true;
    };
  }

  applyFilters(): void {
    const criteria: FilterCriteria = {
      text: this.searchText.trim().toLowerCase(),
      teamIds: this.selectedTeamIds,
      positions: this.selectedPositions,
      statuses: this.selectedStatuses,
    };
    this.dataSource.filter = JSON.stringify(criteria);
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedTeamIds = [];
    this.selectedPositions = [];
    this.selectedStatuses = [];
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchText.trim().length > 0 ||
      this.selectedTeamIds.length > 0 ||
      this.selectedPositions.length > 0 ||
      this.selectedStatuses.length > 0
    );
  }

  // On n'offre que les valeurs reellement presentes chez les agents libres,
  // ce qui evite les choix qui ne ramenent aucun joueur.
  private buildFilterOptions(players: Player[]): void {
    const teams = new Map<number, Team>();
    const positions = new Set<string>();
    const statuses = new Set<string>();

    players.forEach((player) => {
      if (player.team) {
        teams.set(player.team.teamID, player.team);
      }
      if (player.position) {
        positions.add(player.position);
      }
      if (player.status) {
        statuses.add(player.status);
      }
    });

    this.teamOptions = Array.from(teams.values()).sort((a, b) =>
      a.teamCity.localeCompare(b.teamCity)
    );
    this.positionOptions = Array.from(positions).sort((a, b) =>
      a.localeCompare(b)
    );
    this.statusOptions = Array.from(statuses).sort((a, b) => a.localeCompare(b));
  }
}
