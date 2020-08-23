export class Offer{
  playerId: number;
  offeredBy: number;
  owner: number;
  amount: number;
  type: string;

  constructor(playerId: number, offeredBy: number, owner: number, amount: number, type: string){
    this.playerId = playerId;
    this.offeredBy = offeredBy;
    this.owner = owner;
    this.amount = amount,
    this.type = type;
  }

}
