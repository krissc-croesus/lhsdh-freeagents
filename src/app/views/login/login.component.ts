import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth, Hub } from 'aws-amplify';
import { AmplifyService } from 'aws-amplify-angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private amplifyService: AmplifyService,
    private zone: NgZone,
    private spinner: NgxSpinnerService) {


    // Used for listening to login events
    Hub.listen("auth", ({ payload: { event, data } }) => {
      if (event === "cognitoHostedUI" || event === "signedIn" || event === 'signIn') {
        console.log(event);
        this.zone.run(() => this.router.navigate(['/all-free-agents']));
      } else {
        this.spinner.hide();
      }
    });

    //currentAuthenticatedUser: when user comes to login page again
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.router.navigate(['/all-free-agents'], { replaceUrl: true });
      }).catch((err) => {
        this.spinner.hide();
        console.log(err);
      })

  }

  ngOnInit(): void {
  }
}
