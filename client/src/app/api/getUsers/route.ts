import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      // Fetch paginated users
      const { data: users } = await clerkClient.users.getUserList();
  
      if (!users) {
        return NextResponse.json({ error: "No users found" }, { status: 404 });
      }
  
      // Format the response properly
      const formattedUsers = users.map((user) => ({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
  
      return NextResponse.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching users from Clerk:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  }