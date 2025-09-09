import EventCard from "@/components/cards/EventCard";
import { Button } from "@/components/ui/button";
import getEvents from "@/server/actions/events";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

    const events = await getEvents(userId);
    return (
        <div className="container m-auto">

            <section className="flex flex-col items-center gap-16 animate-fade-in ">
                {/* Page title and new event button */}
                <div className="flex gap-4 items-baseline">
                    <h1 className="text-3xl md:text-4xl xl:text-5xl font-black mb-6">Sự Kiện</h1>
                    <Button className="bg-blue-500 hover:bg-blue-400 text-white py-6 hover:scale-110 duration-500 border-b-4 border-blue-700 hover:border-blue-500 rounded-2xl shadow-accent-foreground text-2xl font-black" asChild>
                        <Link href='/events/new'>
                            <CalendarPlus className="mr-4 size-7" /> Tạo Sự Kiện
                        </Link>
                    </Button>
                </div>

                {/* Show event cards if any exist, otherwise show empty state */}
                {events.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-10">
                        {events.map(event => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <CalendarRange className="size-16 mx-auto text-black" />
                        Bạn chưa có bất kỳ sự kiện nào. Tạo sự kiện đầu tiên của bạn để bắt đầu!
                        <Button
                            className="bg-blue-500 hover:bg-blue-400 text-white py-6 hover:scale-110 duration-500 border-b-4 border-blue-700 hover:border-blue-500 rounded-2xl shadow-accent-foreground shadow-2xl text-2xl font-black"
                            asChild>
                            <Link href="/events/new">
                                <CalendarPlus className="mr-4 size-7" /> Tạo Sự Kiện
                            </Link>
                        </Button>
                    </div>
                )}
            </section>
        </div>
    )
};
