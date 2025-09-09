"use client"
// Marks this file for client-side rendering (required for hooks like useState)

import { VariantProps } from "class-variance-authority"
// VariantProps là một loại tiện ích TypeScript từ thư viện biến thể biến đổi lớp (CVA). Nó được sử dụng để gõ các props cho các biến thể (như kích thước, màu sắc, kiểu dáng, v.v.)
import { Button, buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import { CopyIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"


// Define the possible visual states for the copy action
type CopyState = "idle" | "copied" | "error"

// Xác định các đạo cụ cho thành phần CopyEventButton
interface CopyEventButtonProps
    extends Omit<React.ComponentProps<"button">, "children" | "onClick">, // Kế thừa tất cả các nút gốc trừ trẻ em & onclick
    VariantProps<typeof buttonVariants> // Cho phép các đạo cụ biến thể và kích thước từ kiểu nút
{
    eventId: string // Required: event ID for the booking link
    clerkUserId: string // Required: user ID for the booking link
}

// Trả về nhãn nút thích hợp dựa trên trạng thái sao chép hiện tại
function getCopyLabel(state: CopyState) {
    switch (state) {
        case "copied":
            return "Đã sao chép!"
        case "error":
            return "Lỗi"
        case "idle":
        default:
            return "Sao chép"
    }
}



// Thành phần nút có thể tái sử dụng sao chép URL vào bảng tạm
export function CopyEventButton({
    eventId,
    clerkUserId,
    className,
    variant,
    size,
    ...props // Any other button props like disabled, type, etc.
}: CopyEventButtonProps) {


    const [copyState, setCopyState] = useState<CopyState>("idle") // Manage the copy feedback state

    const handleCopy = () => {
        const url = `${location.origin}/book/${clerkUserId}/${eventId}` // Construct the booking URL

        navigator.clipboard
            .writeText(url) // Try to copy the URL
            .then(() => {
                setCopyState("copied") // On success, show "Copied!" state
                toast("Sao chép thành công.", {
                    duration: 3000
                })
                setTimeout(() => setCopyState("idle"), 2000) // Reset after 2 seconds
            })
            .catch(() => {
                setCopyState("error") // On failure, show "Error" state
                setTimeout(() => setCopyState("idle"), 2000) // Reset after 2 seconds
            })
    }


    return (
        <Button
            onClick={handleCopy}
            className={cn(buttonVariants({ variant, size }), 'cursor-pointer', className)} // Áp dụng các lớp biến thể/kích thước + bất kỳ lớp tùy chỉnh nào
            variant={variant}
            size={size}
            {...props}
        >
            <CopyIcon className="size-4 mr-2" /> {/* Icon that changes with copy state */}
            {getCopyLabel(copyState)} {/* Text label that changes with copy state */}
        </Button>
    )
}