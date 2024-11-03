import { NextResponse } from "next/server";
import { verifyAppleNotification } from "@/lib/auth/apple";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const authorization = headersList.get("authorization");
    
    if (!authorization) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const payload = await request.json();
    
    // Verify the JWT token in the Authorization header
    const isValid = await verifyAppleNotification(authorization, payload);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid notification signature" },
        { status: 401 }
      );
    }

    // Handle different types of notifications
    switch (payload.type) {
      case "email-disabled":
        // User has disabled email forwarding
        await handleEmailDisabled(payload);
        break;
      
      case "consent-revoked":
        // User has revoked consent
        await handleConsentRevoked(payload);
        break;
      
      case "account-delete":
        // User has requested account deletion
        await handleAccountDelete(payload);
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Apple notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleEmailDisabled(payload: any) {
  // Implement email disabled logic
  // e.g., Update user preferences in database
  console.log("Email disabled for user:", payload.sub);
}

async function handleConsentRevoked(payload: any) {
  // Implement consent revoked logic
  // e.g., Remove user's Apple Sign In data
  console.log("Consent revoked for user:", payload.sub);
}

async function handleAccountDelete(payload: any) {
  // Implement account deletion logic
  // e.g., Delete or anonymize user data
  console.log("Account deletion requested for user:", payload.sub);
}
