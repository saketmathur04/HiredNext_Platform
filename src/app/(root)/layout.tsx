import { isAuthenticated, signOut, getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  const user = await getCurrentUser();

  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm text-gray-300">
             <Image src="/user-avatar.png" alt="user avatar" width={32} height={32} className="rounded-full object-cover" />
             <span className="hidden md:block font-medium">{user?.name || "Profile"}</span>
          </div>
          <form action={async () => {
             "use server";
             await signOut();
             redirect("/sign-in");
          }}>
            <button type="submit" className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
