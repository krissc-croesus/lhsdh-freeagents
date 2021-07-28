import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Player } from 'src/app/models/player';
import { OfferSenderComponent } from '../offer-sender/offer-sender.component';
import { OffersService } from 'src/app/services/offers.service';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { Router } from '@angular/router';
import { SalaryScaleService } from 'src/app/services/salary-scale.service';

@Component({
  selector: 'app-nego-player-detail',
  templateUrl: './nego-player-detail.component.html',
  styleUrls: ['./nego-player-detail.component.css'],
})
export class NegoPlayerDetailComponent implements OnInit {
  @Input() player: Player;
  @Input() nbOffers: number;
  @ViewChild('offerSender') offerSenderWidget: OfferSenderComponent;
  isSendBtnDisabled: boolean = false;
  storageKey: string = 'WANTED';

  constructor(
    private offerService: OffersService,
    private alertService: AlertServiceService,
    private router: Router,
    private salaryScale: SalaryScaleService
  ) {}

  ngOnInit(): void {}

  getPlayerFaceImage() {
    const nhlAvatarsURL =
      'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';
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
    return teamLogoURL;
  }

  isButtonDisabled() {
    return this.isSendBtnDisabled ;
  }

  getChipColor() {
    if (this.player != null) {
      if (this.player.status === 'UFA') {
        return 'primary';
      }
      if (this.player.status === 'RFA') {
        return 'accent';
      }
      if (this.player.status === '35+') {
        return 'warn';
      }
    }
  }

  submitOffer() {
    if (this.nbOffers >= 30) {
      this.alertService.showErrorMsg("Vous avez dépassé le nombre maximal d'offres");
    } else {
      if (this.offerSenderWidget != null) {
        if (this.offerSenderWidget.getOfferTextBox().valid) {
          this.setSendBtnDisabled(true);
          var contractOffer = this.offerSenderWidget.getOfferTextBox().value;

          if (
            !this.offerService.sendNewContractOffer(
              this.player,
              contractOffer,
              false
            )
          ) {
            this.setSendBtnDisabled(false);
            this.alertService.showErrorMsg(
              "Une erreur s'est produite. Veuillez réessayer"
            );
          } else {
            this.alertService.showConfirmMsg(
              'Vous avez offert un contrat à ' + this.player.name
            );
            this.delay(3000).then((any) => {
              window.location.reload();
              //this.router.navigateByUrl("/negociations");
            });
          }
        } else {
          this.alertService.showErrorMsg('Le salaire offert est invalide.');
        }
      }
    }
  }

  setSendBtnDisabled(enabled: boolean) {
    this.isSendBtnDisabled = enabled;
  }

  onRemovePlayer() {
    this.setSendBtnDisabled(true);
    var currentNegociations = [];
    var savedNegociations = JSON.parse(localStorage.getItem(this.storageKey));

    if (savedNegociations != null) {
      currentNegociations = savedNegociations;

      currentNegociations.splice(
        currentNegociations.indexOf(this.player.uniqueID),
        1
      );

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(currentNegociations)
      );
      this.alertService.showConfirmMsg(
        this.player.name + ' a été enlevé de votre liste de négociations.'
      );

      this.delay(2000).then((any) => {
        window.location.reload();
        //this.router.navigateByUrl("/negociations");
      });
    }
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log('offre envoyé')
    );
  }

  getCompensation() {
    if (this.offerSenderWidget != null) {
      var offer = this.offerSenderWidget.getOfferTextBox().value;
      return this.salaryScale.getCompensationForSalary(offer);
    }
    return '';
  }
}
