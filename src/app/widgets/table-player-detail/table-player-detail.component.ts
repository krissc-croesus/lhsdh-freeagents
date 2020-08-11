import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-table-player-detail',
  templateUrl: './table-player-detail.component.html',
  styleUrls: ['./table-player-detail.component.css'],
})
export class TablePlayerDetailComponent implements OnInit {
  @Input() player: Player;

  constructor() {}

  ngOnInit(): void {}

  getPlayerFaceImage() {
    const nhlAvatarsURL =
      'https://nhl.bamcontent.com/images/headshots/current/168x168/';
    var playerID = this.player.URLLink.substring(
      this.player.URLLink.lastIndexOf('/') + 1
    );
    const playerAvatarURL = nhlAvatarsURL + playerID + '.jpg';

    return playerAvatarURL;
  }

  getHeaderBackgroundImageUrl() {
    const teamLogoURL =
      'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/' +
      this.player.team.logoId +
      '.svg';
    return `url(${teamLogoURL})`;
  }

  isButtonDisabled() {
    return this.player.status === '35+';
  }

  onStartNegociations() {
    const storageKey = 'NEGOCIATIONS';
    let currentNegociations: Player[] = [];
    let savedNegociations = JSON.parse(localStorage.getItem(storageKey));

    if (savedNegociations != null) {
      currentNegociations = savedNegociations;
    }

    for (const player of currentNegociations) {
      if (this.player.uniqueID === player.uniqueID) {
        return;
      }
    }
    currentNegociations.push(this.player);
    localStorage.setItem(storageKey, JSON.stringify(currentNegociations));
  }
}
