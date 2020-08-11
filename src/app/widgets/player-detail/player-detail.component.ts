import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit(): void {
  }

  getHeaderBackgroundImageUrl() {
    const teamLogoURL = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/" + this.player.team.logoId + ".svg"
    return `url(${teamLogoURL})`;
  }

  getPlayerFaceImage()
  {
    const nhlAvatarsURL = "https://nhl.bamcontent.com/images/headshots/current/168x168/";
    var playerID = this.player.URLLink.substring(this.player.URLLink.lastIndexOf('/') + 1);
    const playerAvatarURL = nhlAvatarsURL + playerID + ".jpg";

    return playerAvatarURL;
  }

  getBlendUrl(){
    return `url(${this.getPlayerFaceImage()}), url("/assets/img/backgrounds/NHL20_UltimateBG_2.jpg")`;
  }
}
