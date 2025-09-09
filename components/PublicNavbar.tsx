import { SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function PublicNavbar() {
    return (
        <nav className="flex justify-between items-center fixed z-50 w-full h-28 bg-gray-300 px-10 gap-4 shadow-2xl">
            {/* Logo */}
            <Link href='/login' className="flex items-center gap-1 hover:scale-120 duration-500">
                <Image src="/assets/logo.svg"
                    width={60}
                    height={60}
                    alt="calendra logo" />
            </Link>
            {/* Nav link */}
            <section className="sticky top-0 flex justify-between">
                <div className="flex flex-1 max-sm:gap-0 sm:gap-6">
                    <SignInButton>
                        <Button >Login</Button>
                    </SignInButton>
                    <SignOutButton>
                        <Button variant='outline'>Register</Button>
                    </SignOutButton>
                </div>
            </section>
        </nav>
    )
};
