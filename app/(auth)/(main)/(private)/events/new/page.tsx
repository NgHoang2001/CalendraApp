import EventForm from "@/components/forms/EventForm";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEventPage() {
    return (
        <Card className="max-w-md mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
            <CardHeader>
                <CardTitle>Tạo Sự Kiện</CardTitle>
            </CardHeader>
            {/* New content */}
            <CardContent>
                <EventForm />
            </CardContent>

        </Card>
    );
};
