import crypto from "crypto";
import fs from "fs";
import path from "path";

const KEYS_DIR = path.join(__dirname, "../../keys");
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, "private.pem");
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, "public.pem");

// Ensure keys directory exists
if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

// Generate or load RSA keypair
let privateKey: string;
let publicKey: string;

function generateKeyPair() {
  const { privateKey: privKey, publicKey: pubKey } = crypto.generateKeyPairSync(
    "rsa",
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    }
  );

  fs.writeFileSync(PRIVATE_KEY_PATH, privKey);
  fs.writeFileSync(PUBLIC_KEY_PATH, pubKey);

  return { privateKey: privKey, publicKey: pubKey };
}

function loadOrGenerateKeys() {
  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
    console.log("Loaded existing RSA keys");
  } else {
    const keys = generateKeyPair();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
    console.log("Generated new RSA keys");
  }
}

// Initialize keys on module load
loadOrGenerateKeys();

/**
 * Hash email using SHA-384
 */
export function hashEmail(email: string): string {
  return crypto.createHash("sha384").update(email).digest("hex");
}

/**
 * Sign a hash with the private key
 */
export function signHash(hash: string): string {
  const sign = crypto.createSign("SHA256");
  sign.update(hash);
  sign.end();
  return sign.sign(privateKey, "hex");
}

/**
 * Verify a signature with the public key
 */
export function verifySignature(
  hash: string,
  signature: string,
  pubKey?: string
): boolean {
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(hash);
    verify.end();
    return verify.verify(pubKey || publicKey, signature, "hex");
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Get the public key for sharing with clients
 */
export function getPublicKey(): string {
  return publicKey;
}

/**
 * Hash and sign an email
 */
export function hashAndSignEmail(email: string): {
  emailHash: string;
  signature: string;
} {
  const emailHash = hashEmail(email);
  const signature = signHash(emailHash);
  return { emailHash, signature };
}
