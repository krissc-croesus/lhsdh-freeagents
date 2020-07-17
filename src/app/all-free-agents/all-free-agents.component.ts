import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Player } from '../models/player';
import { PlayersService } from '../services/players.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-all-free-agents',
  templateUrl: './all-free-agents.component.html',
  styleUrls: ['./all-free-agents.component.css']
})
export class AllFreeAgentsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['team', 'name', 'position', 'overall', 'age', 'status'];
  dataSource: MatTableDataSource<Player> = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private playerService: PlayersService
  ) { }

  ngOnInit(): void {
    this.playerService.getFreeAgents().subscribe(players =>{
      players.sort((a:Player, b:Player) => {
        if(a.team.teamCity.localeCompare(b.team.teamCity) === 0 )
        {
          if(a.status.localeCompare(b.status) === 0)
          {
            return a.position.localeCompare(b.position);
          }
          return a.status.localeCompare(b.status) * -1;
        }
        return a.team.teamCity.localeCompare(b.team.teamCity);
      }
      );
      this.dataSource.data = players as Player[];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
