import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-negotiations',
  templateUrl: './negotiations.component.html',
  styleUrls: ['./negotiations.component.css']
})
export class NegotiationsComponent implements OnInit {

  storageKey: string = "NEGOCIATIONS"
  players: Player[] = [];
  constructor() { }

  ngOnInit(): void {
    let savedNegociations = JSON.parse(localStorage.getItem(this.storageKey));

    console.log(savedNegociations);

    if(savedNegociations != null){
    this.players = savedNegociations;
    }
  }

}
