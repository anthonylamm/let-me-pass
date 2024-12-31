import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private key: CryptoKey | null = null;
  private salt: string = 'unique-salt'; // Ideally, generate a unique salt per user and store it securely

  constructor() { }

  /**
   * Derive an AES-GCM encryption key from the master password using PBKDF2
   * @param masterPassword - The user's master password
   */
  async deriveKey(masterPassword: string): Promise<void> {
    const encoder = new TextEncoder();
    const passphraseKey = encoder.encode(masterPassword);
    const salt = encoder.encode(this.salt);

    // Import the passphrase as a key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passphraseKey,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive a key using PBKDF2
    this.key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // Higher iterations increase security
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-GCM
   * @param data - The plaintext data to encrypt
   * @returns Base64-encoded encrypted data
   */
  async encryptData(data: string): Promise<string> {
    if (!this.key) {
      throw new Error('Encryption key not derived.');
    }

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to Base64 for storage/transmission
    return btoa(String.fromCharCode(...combined));
  }

  /**
   * Decrypt data using AES-GCM
   * @param data - Base64-encoded encrypted data
   * @returns The decrypted plaintext data
   */
  async decryptData(data: string): Promise<string> {
    if (!this.key) {
      throw new Error('Encryption key not derived.');
    }

    try {
      const combined = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Decryption failed. The data might be corrupted or the key is incorrect.');
    }
  }

  /**
   * Clear the derived key from memory
   */
  clearKey(): void {
    this.key = null;
  }

  /**
   * Check if the key has been derived
   */
  isKeyDerived(): boolean {
    return this.key !== null;
  }
}