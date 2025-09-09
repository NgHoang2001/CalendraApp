
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const createAt = timestamp('createAt').notNull().defaultNow();
const updateAt = timestamp('updateAt').notNull().defaultNow().$onUpdate(() => new Date());
// Event Table : lưu trữ thông tin xự kiện được tạo
export const EventTable = pgTable(
    "events",
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        description: text('description'),
        durationInMinutes: integer("durationInMinutes").notNull(),
        clerkUserId: text('clerkUserId').notNull(),
        isActive: boolean('isActive').notNull().default(true),
        createAt,
        updateAt,
    },
    table => ([
        index('clerkUserIdIndex').on(table.clerkUserId)
    ])
)
// Schedule Table: lên lịch thông tin trong nhiều ngày của 1 người
export const ScheduleTable = pgTable(
    "schedules",
    {
        id: uuid('id').primaryKey().defaultRandom(),
        timezone: text('timezone').notNull(),
        clerkUserId: text('clerkUserId').notNull().unique(),
        createAt,
        updateAt,
    })
// tạo liên kết 1 -> n từ bảng Schedule -> schedulesAvailabilities
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable)
}))
//
export const scheduleDayOfWeekEnum = pgEnum('day', DAYS_OF_WEEK_IN_ORDER)
// Schedule Availability Table: thông tin bảng lịch hiện đang có trong 1 ngày

export const ScheduleAvailabilityTable = pgTable(
    "schedulesAvailabilities",
    {
        id: uuid('id').primaryKey().defaultRandom(),
        scheduleId: uuid('scheduleId').notNull().references(() => ScheduleTable.id, { onDelete: 'cascade' }),
        startTime: text('startTime').notNull(),
        endTime: text('endTime').notNull(),
        dayOfWeek: scheduleDayOfWeekEnum('dayOfWeek').notNull(),
    },
    table => ([
        index('scheduleIdIndex').on(table.scheduleId)
    ])
)
// tạo liên kết 1 -> 1 từ bảng schedulesAvailabilities -> Schedule 
export const schedulesAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId], // local key
        references: [ScheduleTable.id] // foreign key
    })
}))