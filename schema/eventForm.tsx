import { z } from "zod";

export const eventFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    description: z.string().optional(),
    durationInMinutes: z.coerce.number<number>().int()
        .positive("Khoảng thời gian phải lớn hơn 0")
        .max(60 * 12, `Khoảng thời gian phải nhỏ hơn or bằng 12 tiếng (${60 * 12}) phút)`),
    isActive: z.boolean(),
})
