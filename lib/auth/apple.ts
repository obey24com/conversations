import jwt from "jsonwebtoken";
import { JWK, JWS } from "node-jose";

const APPLE_PUBLIC_KEYS_URL = "https://appleid.apple.com/auth/keys";

export async function verifyAppleNotification(
  authorization: string,
  payload: any
): Promise<boolean> {
  try {
    // Extract the JWT token from the Authorization header
    const token = authorization.replace("Bearer ", "");

    // Fetch Apple's public keys
    const response = await fetch(APPLE_PUBLIC_KEYS_URL);
    const { keys } = await response.json();

    // Find the key used to sign this JWT
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) return false;

    const kid = decodedToken.header.kid;
    const signingKey = keys.find((k: any) => k.kid === kid);
    if (!signingKey) return false;

    // Convert the JWK to PEM format
    const keystore = await JWK.asKeyStore({
      keys: [signingKey]
    });
    const key = keystore.get(kid);
    if (!key) return false;

    // Verify the JWT signature and claims
    const verified = await JWS.createVerify(key).verify(token);
    if (!verified) return false;

    // Verify additional claims as needed
    const claims = jwt.decode(token) as any;
    
    // Verify the token was issued by Apple
    if (claims.iss !== "https://appleid.apple.com") return false;
    
    // Verify the token hasn't expired
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp < now) return false;

    // Verify the audience matches your client ID
    const clientId = process.env.APPLE_CLIENT_ID;
    if (claims.aud !== clientId) return false;

    return true;
  } catch (error) {
    console.error("Error verifying Apple notification:", error);
    return false;
  }
}
