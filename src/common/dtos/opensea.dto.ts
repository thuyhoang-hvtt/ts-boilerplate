import { IsString } from 'class-validator';

export class OpenSeaAttributeDto {
  @IsString()
  'trait_type': string;

  @IsString()
  'value': string;

  static fromRaw(raw: any): OpenSeaAttributeDto {
    return {
      trait_type: raw.traitType,
      value: raw.value,
    };
  }
}
