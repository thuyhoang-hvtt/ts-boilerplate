import * as solana from '@solana/web3.js';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { REG_APTOS_ADDRESS, REG_USERNAME } from '@/common/regex';

export function IsSolanaAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSolanaAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && solana.PublicKey.isOnCurve(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `(${args.property}) must be a Solana address.`;
        },
      },
    });
  };
}

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSolanaAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && REG_USERNAME.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `(${args.property}) must be a proper username: ["Only contains alphabets, digits and _", "8-20 character long", "Not starts with _ or .", "Not ends with _ ."]`;
        },
      },
    });
  };
}

export function IsAptosAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAptosAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && REG_APTOS_ADDRESS.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `(${args.property}) must be a Aptos address.`;
        },
      },
    });
  };
}
