import PrivateNavbar from "@/components/PrivateNavbar";
import PublicNavbar from "@/components/PublicNavbar";
import { currentUser } from "@clerk/nextjs/server";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    // comp này là để tạo giao điện chung cho trang web
    // children đại diện cho các comp con có thể lồng vào bên trong
    const user = await currentUser();

    return (
        <main className="relative">
            {/* Hiển thị Navbar */}
            {user ? <PrivateNavbar /> : <PublicNavbar />}

            {/* Hiển thị comp con */}
            <section className="pt-36">
                {children}
            </section>

        </main>
    );
};
