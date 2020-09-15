export class Offer{
  playerId: number;
  teamId: number;
  offeredBy: string;
  isOwner: boolean;
  amount: number;
  playerType: string;
  playerName: string;

  constructor(playerId: number, teamId: number, offeredBy: string, isOwner: boolean, amount: number, playerType: string, playerName: string){
    this.playerId = playerId;
    this.teamId = teamId;
    this.offeredBy = offeredBy;
    this.isOwner = isOwner;
    this.amount = amount,
    this.playerType = playerType;
    this.playerName = playerName;
  }

}
