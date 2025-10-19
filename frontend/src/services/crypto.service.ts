export class CryptoService {
  static async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest("SHA-384", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  static hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  static async verifySignature(
    hash: string,
    signature: string,
    publicKeyPem: string
  ): Promise<boolean> {
    try {
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      const pemContents = publicKeyPem
        .replace(pemHeader, "")
        .replace(pemFooter, "")
        .replace(/\s/g, "");

      const binaryDer = this.base64ToArrayBuffer(pemContents);

      const publicKey = await crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["verify"]
      );

      const hashBuffer = new TextEncoder().encode(hash);
      const signatureBuffer = this.hexToArrayBuffer(signature);

      const isValid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signatureBuffer,
        hashBuffer
      );

      return isValid;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  static async verifyUserSignature(
    email: string,
    emailHash: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      const computedHash = await this.hashEmail(email);
      if (computedHash !== emailHash) {
        console.error("Hash mismatch");
        return false;
      }

      return await this.verifySignature(emailHash, signature, publicKey);
    } catch (error) {
      console.error("User signature verification error:", error);
      return false;
    }
  }
}
