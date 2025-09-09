'use server'

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/eventForm";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function createEvent(unsafeData: z.infer<typeof eventFormSchema>): Promise<void> {
    try {
        // Thông tin xác thực người dùng bởi Clerk
        const { userId } = await auth();
        const { success, data } = eventFormSchema.safeParse(unsafeData);
        if (!success || !userId)
            throw new Error(`Dữ liệu không hợp lệ hoặc chưa đăng nhập`);

        // thêm dữ liệu vào bảng event
        await db.insert(EventTable).values({ ...data, clerkUserId: userId });

    } catch (error: any) {
        throw new Error(`Tạo event thất bại: ${error.message || error}`);
    } finally {
        // làm mới lại trang event cho phép cập nhật dự liệu mới
        revalidatePath('/events');

    }
};

export async function updateEvent(id: string, unsafeData: z.infer<typeof eventFormSchema>): Promise<void> {
    try {
        // Thông tin xác thực người dùng bởi Clerk
        const { userId } = await auth();
        const { success, data } = eventFormSchema.safeParse(unsafeData);
        if (!success || !userId)
            throw new Error(`Dữ liệu không hợp lệ hoặc chưa đăng nhập`);

        // cập nhật dữ liệu trong bảng event
        const { rowCount } = await db
            .update(EventTable)
            .set({ ...data })
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));
        if (rowCount === 0) {
            throw new Error('Sự kiện không tìm thấy hoặc người dùng không đủ quyền truy cập sự kiện.')
        }
    } catch (error: any) {
        throw new Error(`Cập nhật event thất bại: ${error.message || error}`);
    } finally {
        // làm mới lại trang event cho phép cập nhật dự liệu mới
        revalidatePath('/events');

    }
};

export async function deleteEvent(id: string): Promise<void> {
    try {
        // Thông tin xác thực người dùng bởi Clerk
        const { userId } = await auth();

        if (!userId)
            throw new Error(`Chưa đăng nhập`);

        // cập nhật dữ liệu trong bảng event
        const { rowCount } = await db
            .delete(EventTable)
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));
        if (rowCount === 0) {
            throw new Error('Sự kiện không tìm thấy hoặc người dùng không đủ quyền truy cập sự kiện.')
        }
    } catch (error: any) {
        throw new Error(`Xóa event thất bại: ${error.message || error}`);
    } finally {
        // làm mới lại trang event cho phép cập nhật dự liệu mới
        revalidatePath('/events');
    }
}

//
type EventRow = typeof EventTable.$inferSelect;
export default async function getEvents(clerkUserId: string): Promise<EventRow[]> {
    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId: userId }, { eq }) => eq(userId, clerkUserId),
        orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`)
    })

    return events;
};

// Fetch a specific event for a given user
export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
    const event = await db.query.EventTable.findFirst({
        where: ({ id, clerkUserId }, { and, eq }) =>
            and(eq(clerkUserId, userId), eq(id, eventId)), // Make sure the event belongs to the user
    })

    return event ?? undefined // Explicitly return undefined if not found
}

// Define a new type for public events, which are always active
// It removes the generic 'isActive' field and replaces it with a literal true
export type PublicEvent = Omit<EventRow, "isActive"> & { isActive: true }
// “This version of an event is guaranteed to be active — no maybe, no false.”


// Async function to fetch all active (public) events for a specific user
export async function getPublicEvents(clerkUserId: string): Promise<PublicEvent[]> {
    // Query the database for events where:
    // - the clerkUserId matches
    // - the event is marked as active
    // Events are ordered alphabetically (case-insensitive) by name
    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
            and(eq(userIdCol, clerkUserId), eq(isActive, true)),
        orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
    })

    // Cast the result to the PublicEvent[] type to indicate all are active
    return events as PublicEvent[]
}