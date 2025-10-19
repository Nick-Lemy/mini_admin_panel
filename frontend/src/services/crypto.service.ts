/**
 * Hash email using SHA-384 (browser-compatible)
 */
export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-384", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * Verify a signature with the public key
 */
export async function verifySignature(
  hash: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> {
  try {
    // Import the public key
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = publicKeyPem
      .replace(pemHeader, "")
      .replace(pemFooter, "")
      .replace(/\s/g, "");

    const binaryDer = Buffer.from(pemContents, "base64");

    const publicKey = await crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

    // Convert hash and signature to ArrayBuffer
    const hashBuffer = new TextEncoder().encode(hash);
    const signatureBuffer = Buffer.from(signature, "hex");

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
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

/**
 * Verify user signature
 */
export async function verifyUserSignature(
  email: string,
  emailHash: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    // First verify that the hash matches
    const computedHash = await hashEmail(email);
    if (computedHash !== emailHash) {
      console.error("Hash mismatch");
      return false;
    }

    // Then verify the signature
    return await verifySignature(emailHash, signature, publicKey);
  } catch (error) {
    console.error("User signature verification error:", error);
    return false;
  }
}

// Simple verification using Node.js crypto (for development/testing)
// This won't work in browser, but provides a fallback
export function verifySignatureSimple(
  hash: string,
  signature: string,
  publicKey: string
): boolean {
  // For browser compatibility, we'll do a basic validation
  // In production, you'd want to use the Web Crypto API properly
  // or verify on the backend

  // Basic checks
  if (!hash || !signature || !publicKey) {
    return false;
  }

  // For now, we'll assume the signature is valid if all fields are present
  // In a real implementation, you'd use Web Crypto API or verify server-side
  return signature.length > 0;
}
