import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { Auth, Hub } from 'aws-amplify';
import { Router } from '@angular/router';
import { PlayerMapperService } from './services/player-mapper.service';
import { Team } from './models/team';
import { Player } from './models/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lhsdb-freeagents';
  isSignedIn: boolean = false;
  connectedUsername: string;
  mobileQuery: MediaQueryList;
  teamLogoURL: string = "";
  isAdmin: boolean = false;

  private _mobileQueryListener: () => void;
  @ViewChild('sidenav') sideNav;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private ngZone: NgZone,
    private playerMapperService: PlayerMapperService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signOut':
          console.log('Logout Clicked');
          this.isSignedIn = false;
          this.sideNav.toggle();
          this.ngZone.run(() => this.router.navigate(['login'],  { replaceUrl: true }));
          break;
        case 'signIn':
          this.onLogin();
      }
    });
  }

  ngOnInit() {
    this.onLogin();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onLogin(){
    Auth.currentUserInfo()
    .then((info) => {
      const team = info.attributes['custom:team'];
      const isAdm = info.attributes['custom:isAdmin'];

      this.setTeamLogoURL(team);
      this.isSignedIn = true;
      this.isAdmin = (isAdm == 1);
    })
    .catch(() => console.log('Not signed in'));
  }

  setTeamLogoURL(teamID: number)
  {
    const team: Team = this.playerMapperService.mapTeam(+teamID);
    this.connectedUsername= team.teamCity + " " + team.teamName;
    this.teamLogoURL = 'https://assets.nhle.com/logos/nhl/svg/'+ team.logoId + '_dark.svg';
  }

  getNegociationsCount()
  {
    const storageKey =  "LHSDB-FA-2024";
    let currentNegociations = [];
    let savedNegociations = JSON.parse(localStorage.getItem(storageKey));

    if(savedNegociations != null){
      currentNegociations = savedNegociations;
    }
    return currentNegociations.length;
  }
}
