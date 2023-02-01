export enum WhitelistTypeEnum {
  Airdrop = 'Airdrop',
}

export interface WhiteList {
  id: number;
  authority: string;
  type: string;
  data: number;
  token: string;
}
