import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordGeneratorService {

  constructor() { }

  /**
   * Generates a secure random password.
   * @param length - Length of the password.
   * @param includeNumbers - Whether to include numbers.
   * @param includeSymbols - Whether to include symbols.
   * @param includeUppercase - Whether to include uppercase letters.
   * @param includeLowercase - Whether to include lowercase letters.
   * @returns The generated password.
   */
  generatePassword(
    length: number = 12,
    includeNumbers: boolean = true,
    includeSymbols: boolean = true,
    includeUppercase: boolean = true,
    includeLowercase: boolean = true
  ): string {
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';

    let characterSet = '';
    if (includeNumbers) characterSet += numbers;
    if (includeSymbols) characterSet += symbols;
    if (includeUppercase) characterSet += uppercase;
    if (includeLowercase) characterSet += lowercase;

    if (characterSet.length === 0) {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    const cryptoObj = window.crypto || (window as any).msCrypto;

    if (cryptoObj && cryptoObj.getRandomValues) {
      const randomValues = new Uint32Array(length);
      cryptoObj.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        const randomIndex = randomValues[i] % characterSet.length;
        password += characterSet.charAt(randomIndex);
      }
    } else {
      // Fallback to Math.random (not recommended for security-critical applications)
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        password += characterSet.charAt(randomIndex);
      }
    }

    return password;
  }
}