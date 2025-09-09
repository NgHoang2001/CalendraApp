'use client'

import { eventFormSchema } from "@/schema/eventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";
import { useRouter } from "next/navigation";

export default function EventForm({ event }: {
    event?: {
        id: string,
        name: string,
        description?: string,
        durationInMinutes: number,
        isActive: boolean,
    }
}) {
    // hook
    const [isDeletePending, startDeletePending] = useTransition();
    const router = useRouter();

    //
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ? { ...event } : {
            name: '',
            description: '',
            durationInMinutes: 30,
            isActive: true,
        }
    });

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id);
        try {
            await action(values);
            router.push('/events');
        } catch (error: any) {
            form.setError('root', {
                message: `Có lỗi lưu trữ với sự kiện: ${error.message}`
            })
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
                {/* Show error */}
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm ">
                        {form.formState.errors.root.message}
                    </div>
                )}
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên sự kiện</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                Tên của người dùng sẽ thấy khi đặt lịch
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* duration Field */}
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Khoảng thời gian</FormLabel>
                            <FormControl>
                                <Input type='number' {...field} />
                            </FormControl>
                            <FormDescription>
                                phút
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* description Field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none h-32" {...field} />
                            </FormControl>
                            <FormDescription>
                                Mô tả thêm về sự kiện
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Is active Field */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Có hiệu lực</FormLabel>
                            </div>
                            <FormDescription>
                                Các sự kiện không hoạt động sẽ không hiển thị để người dùng đặt chỗ.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2 justify-end">
                    {event && (
                        <AlertDialog>
                            {/* Nút delete */}
                            <AlertDialogTrigger asChild>
                                <Button className="cursor-pointer hover:scale-105 hover:bg-red-700"
                                    variant='destructive'
                                    disabled={isDeletePending || form.formState.isSubmitting}>Xóa</Button>
                            </AlertDialogTrigger>
                            {/* Nội dung thẻ */}
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này không thể được hoàn tác. Điều này sẽ xóa vĩnh viễn sự kiện của bạn.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-500 hover:bg-red-700 cursor-pointer "
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                        onClick={() => {
                                            startDeletePending(async () => {
                                                try {
                                                    await deleteEvent(event.id);
                                                    router.push('/events');
                                                } catch (error: any) {
                                                    form.setError('root', {
                                                        message: `Có lỗi xóa với sự kiện: ${error.message}`
                                                    })
                                                }
                                            })
                                        }}>Tiếp tục</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {/* cancel button - chuyển hướng về danh sách events */}
                    <Button disabled={isDeletePending || form.formState.isSubmitting}
                        variant='outline'
                        type="button"
                        asChild>
                        <Link href={'/events'}>Hủy bỏ</Link>
                    </Button>
                    {/* save button - tạo mới event */}
                    <Button
                        className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-500"
                        disabled={isDeletePending || form.formState.isSubmitting}
                        type="submit">
                        Lưu
                    </Button>

                </div>
            </form>
        </Form>
    )
};
