import { randomBytes, randomUUID } from 'crypto';
import { random } from 'lodash';

export class RandomUtil {
  static generateUUID(): string {
    return randomUUID();
  }

  static generateArbitraryNumber(length = 4): string {
    return Math.round(Math.pow(10, length) * Math.random())
      .toString()
      .padStart(length, '0');
  }

  static generateBase64(length = 64): string {
    return randomBytes(length).toString('base64');
  }

  static generateAlphanumeric(length = 6): string {
    return random(true)
      .toString(36)
      .slice(2, Math.min(length + 2, 32));
  }
}
