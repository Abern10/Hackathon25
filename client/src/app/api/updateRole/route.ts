import { NextResponse } from "next/server";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    console.log("📨 API Request - UserID:", userId, "Role:", role);

    if (!userId || !role) {
      console.error("❌ Error: Missing userId or role in request.");
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }

    if (!CLERK_SECRET_KEY) {
      console.error("❌ Clerk Secret Key is missing.");
      return NextResponse.json({ error: "Server misconfiguration: Missing Clerk Secret Key" }, { status: 500 });
    }

    // ✅ Fetch user metadata to check if the role is already set
    const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("❌ Clerk API Error:", errorText);
      return NextResponse.json({ error: `Failed to fetch user: ${errorText}` }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const existingRole = userData.public_metadata?.role;

    if (existingRole) {
      console.log("✅ Role already exists. No update needed.");
      return NextResponse.json({ success: true, message: "Role already set" });
    }

    // ✅ Update Clerk user metadata with role
    const updateResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        public_metadata: { role },
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("❌ Failed to update metadata:", errorText);
      return NextResponse.json({ error: `Clerk API Error: ${errorText}` }, { status: updateResponse.status });
    }

    console.log("✅ Successfully updated role.");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
