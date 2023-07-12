import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player';
import { AlertServiceService } from 'src/app/services/alert-service.service';

@Component({
  selector: 'app-table-player-detail',
  templateUrl: './table-player-detail.component.html',
  styleUrls: ['./table-player-detail.component.css'],
})
export class TablePlayerDetailComponent implements OnInit {
  @Input() player: Player;
  @Input() connectedTeam: number;

  constructor(private alertService: AlertServiceService) {}

  ngOnInit(): void {}

  getPlayerFaceImage() {
    const nhlAvatarsURL =
      'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';

    if(this.player.URLLink == null)
    {
      console.log(this.player.name);
      return "";
    }

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
    return this.player.status === '35+' || this.player.team.teamID == this.connectedTeam;
  }

  onStartNegociations() {
    const storageKey = 'LHSDB-FA-2023';
    var currentNegociations = [];
    var savedNegociations = JSON.parse(localStorage.getItem(storageKey));

    if (savedNegociations != null) {
      currentNegociations = savedNegociations;
    }

    for (const playerId of currentNegociations) {
      if (this.player.uniqueID === playerId) {
        this.alertService.showErrorMsg("Ce joueur est déjà dans votre liste");
        return;
      }
    }
    currentNegociations.push(this.player.uniqueID);
    localStorage.setItem(storageKey, JSON.stringify(currentNegociations));
    this.alertService.showConfirmMsg(this.player.name + " a été ajouté à votre liste de négociations.");
  }
}
