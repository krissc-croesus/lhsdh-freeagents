import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Player } from '../models/player';
import { PlayersService } from '../services/players.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Auth } from 'aws-amplify';
import { AlertServiceService } from '../services/alert-service.service';

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

  constructor(private playerService: PlayersService, private alertService: AlertServiceService) {
    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];
      this.connectedUserTeam = +team;
    })
    .catch(() => console.log('Not signed in'));
  }

  ngOnInit(): void {
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
        this.dataSource.filterPredicate = (data: Player, filter: string) => {
          return (
            data.name.toLowerCase().includes(filter) ||
            data.teamCity.toLowerCase().includes(filter) ||
            data.position.toLowerCase().includes(filter)
          );
        };
      },
      (error) => {
        this.alertService.showErrorMsg("Nous n'avons pas réussi a charger les agents libres. Contacter Kriss");
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
