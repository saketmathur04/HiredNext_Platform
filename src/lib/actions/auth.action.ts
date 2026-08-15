"use server";

import { cookies } from "next/headers";
import { auth, db } from "../../../firebase/admin";

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRocord = await db.collection("users").doc(uid).get();

    if (userRocord.exists) {
      return {
        success: false,
        message: "User already exists. Please login.",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "User created successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error signing up:", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Error signing up",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    // Ensure user document exists in Firestore (handles case where
    // sign-up occurred before the database was created)
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      await db.collection("users").doc(userRecord.uid).set({
        name: userRecord.displayName || email.split("@")[0],
        email: email,
      });
    }

    await setSessionCookie(idToken);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error signing up:", error);
    return {
      success: false,
      message: "Error signing in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<null | User> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const user = await db.collection("users").doc(decodedClaims.uid).get();

    if (!user.exists) {
      return null;
    }
    return {
      ...user.data(),
      id: user.id,
    } as User;
  } catch (error) {
    // console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
