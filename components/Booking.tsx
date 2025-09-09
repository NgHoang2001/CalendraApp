'use client'
import { BlinkBlur } from "react-loading-indicators"

const Booking = () => {
    return (
        <div className="flex items-center justify-center">
            <BlinkBlur
                color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                size="large"
                text="Sự kiện đang lên lịch, đừng nhấp vào bất cứ điều gì⛔⛔..."
                textColor="black"
            />
        </div>
    )

}

export default Booking