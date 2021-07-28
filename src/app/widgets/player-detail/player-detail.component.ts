import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Player } from 'src/app/models/player';
import { OfferSenderComponent } from '../offer-sender/offer-sender.component';
import { OffersService } from 'src/app/services/offers.service';
import { AlertServiceService } from 'src/app/services/alert-service.service';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player: Player;
  @ViewChild('offerSender') offerSenderWidget: OfferSenderComponent;
  isSendBtnEnabled: boolean = true;

  constructor(
    private offerService: OffersService,
    private alertService: AlertServiceService
  ) {}

  ngOnInit(): void {}

  getHeaderBackgroundImageUrl() {
    const teamLogoURL =
      'https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/' +
      this.player.team.logoId +
      '.svg';
    return `url(${teamLogoURL})`;
  }

  getPlayerFaceImage() {
    const nhlAvatarsURL =
      'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/';
    var playerID = this.player.URLLink.substring(
      this.player.URLLink.lastIndexOf('/') + 1
    );
    const playerAvatarURL = nhlAvatarsURL + playerID + '.jpg';

    return playerAvatarURL;
  }

  getBlendUrl() {
    return `url(${this.getPlayerFaceImage()}), url("/assets/img/backgrounds/NHL20_UltimateBG_2.jpg")`;
  }

  submitOffer() {
    if (this.offerSenderWidget != null) {
      if (this.offerSenderWidget.getOfferTextBox().valid) {
        this.setSendBtnEnabled(false);
        var contractOffer = this.offerSenderWidget.getOfferTextBox().value;

        if (!this.offerService.sendNewContractOffer(this.player, contractOffer, true)) {
          this.setSendBtnEnabled(true);
          this.alertService.showErrorMsg("Une erreur s'est produite. Veuillez réessayer");
        }
        else{
          this.alertService.showConfirmMsg('Vous avez offert un contrat à ' + this.player.name);
        }
      } else {
        this.alertService.showErrorMsg('Le salaire offert est invalide.');
      }
    }
  }

  releasePlayer(){
    this.setSendBtnEnabled(false);
    if (!this.offerService.sendNewContractOffer(this.player, 0, true)) {
      this.setSendBtnEnabled(true);
      this.alertService.showErrorMsg("Une erreur s'est produite. Veuillez réessayer");
    }else{
      this.alertService.showConfirmMsg('Vous avez libéré ' + this.player.name);
    }
  }

  setSendBtnEnabled(enabled: boolean) {
    this.isSendBtnEnabled = enabled;
  }
}
