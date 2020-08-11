import { Component, OnInit } from '@angular/core';
import { PlayersService } from 'src/app/services/players.service';
import { Player } from 'src/app/models/player';
import { Auth, Hub } from 'aws-amplify';

@Component({
  selector: 'app-my-free-agents',
  templateUrl: './my-free-agents.component.html',
  styleUrls: ['./my-free-agents.component.css'],
})
export class MyFreeAgentsComponent implements OnInit {
  ufas: Player[] = [];
  rfas: Player[] = [];
  trenteCinq: Player[] = [];

  constructor(private playerService: PlayersService) {}

  ngOnInit(): void {

    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];

      this.playerService.getPlayersFromTeam(team, true).subscribe((players) => {
        for (let player of players) {

          switch (player.status) {
            case 'UFA':
              this.ufas.push(player);
              break;
            case 'RFA':
              this.rfas.push(player);
              break;
            case '35+':
              this.trenteCinq.push(player);
              break;

            default:
              break;
          }
        }
      });
    })
    .catch(() => console.log('Not signed in'));
  }

}
