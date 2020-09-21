import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { OffersService } from 'src/app/services/offers.service';
import { PlayerMapperService } from 'src/app/services/player-mapper.service';

export interface TeamSummary{
  team: Team;
  owned: number;
  others: number;
}

@Component({
  selector: 'app-adm-teams-summary',
  templateUrl: './adm-teams-summary.component.html',
  styleUrls: ['./adm-teams-summary.component.css']
})

export class AdmTeamsSummaryComponent implements OnInit {
  allTeams: Team[] = [];
  teamSummaries: TeamSummary[] = [];
  waitingFor: string[] = [];

  constructor(private playerMapperService: PlayerMapperService, private offerService: OffersService) { }

  ngOnInit(): void {
    this.fillTeamList();
    this.fillSummaries();

  }

  fillSummaries() {
    this.allTeams.forEach(teamIterator => {
      this.offerService.getOffersByTeam(teamIterator.teamID).subscribe(
        (offers) => {
          let ownedCount: number = 0;
          let othersCounts: number = 0;

          offers.forEach(offer => {
            if(offer.isOwner){
              ownedCount++;
            }
            else{
              othersCounts++;
            }
          });

          let teamSummary: TeamSummary = {
            team : teamIterator,
            owned : ownedCount,
            others : othersCounts
          }

          this.teamSummaries.push(teamSummary);

          if(ownedCount === 0 && othersCounts === 0){
            this.waitingFor.push(teamIterator.teamName);
          }

        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  fillTeamList() {
    for (let index = 1; index <= 31; index++) {
      const team: Team = this.playerMapperService.mapTeam(index);
      this.allTeams.push(team);
    }
    this.allTeams.sort((a, b) => a.teamCity.localeCompare(b.teamCity));
  }

}
