import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private key: CryptoKey | null = null;
  private salt: string = ''; // To be set upon user login

  constructor() { }

  /**
   * Set the salt value retrieved from the server
   * @param salt - Base64 encoded salt string
   */
  setSalt(salt: string): void {
    this.salt = atob(salt); // Decode from Base64
  }

  /**
   * Derive an AES-GCM encryption key from the user's master password using PBKDF2
   * @param masterPassword - The user's master password
   */
  async deriveKey(masterPassword: string): Promise<void> {
    if (!this.salt) {
      throw new Error('Salt is not set. Cannot derive key.');
    }

    const encoder = new TextEncoder();
    const passphraseKey = encoder.encode(masterPassword);
    const saltBytes = encoder.encode(this.salt);

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
        salt: saltBytes,
        iterations: 100000, // Higher iterations increase security
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    console.log('Encryption key derived and stored in memory.');
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
  }

  /**
   * Check if the encryption key has been derived
   * @returns boolean indicating the presence of the key
   */
  isKeyDerived(): boolean {
    return this.key !== null;
  }

  /**
   * Clear the derived key from memory
   */
  clearKey(): void {
    this.key = null;
    console.log('Encryption key cleared from memory.');
  }
}