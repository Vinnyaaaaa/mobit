// import DialogSwap from "@/components/Dialogs/DialogSwap/DialogSwap"

import { useMemo, useState } from "react"
import SwapView from "./SwapView"

export enum TradeType {
    Swap = "swap",
    Leap = "leap",
    Receive = "receive",
    Staking = "staking",
    TopUp = "topUp"
}

const TRADE_LIST = [
    {
        label: "Swap",
        value: TradeType.Swap,
        svg: (
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21.5 4.5V14.25C21.5 14.6478 21.342 15.0294 21.0607 15.3107C20.7794 15.592 20.3978 15.75 20 15.75H9.81031L10.7806 16.7194C10.8503 16.7891 10.9056 16.8718 10.9433 16.9628C10.981 17.0539 11.0004 17.1515 11.0004 17.25C11.0004 17.3485 10.981 17.4461 10.9433 17.5372C10.9056 17.6282 10.8503 17.7109 10.7806 17.7806C10.7109 17.8503 10.6282 17.9056 10.5372 17.9433C10.4461 17.981 10.3485 18.0004 10.25 18.0004C10.1515 18.0004 10.0539 17.981 9.96283 17.9433C9.87178 17.9056 9.78906 17.8503 9.71937 17.7806L7.46937 15.5306C7.39964 15.461 7.34432 15.3783 7.30658 15.2872C7.26884 15.1962 7.24941 15.0986 7.24941 15C7.24941 14.9014 7.26884 14.8038 7.30658 14.7128C7.34432 14.6217 7.39964 14.539 7.46937 14.4694L9.71937 12.2194C9.86011 12.0786 10.051 11.9996 10.25 11.9996C10.449 11.9996 10.6399 12.0786 10.7806 12.2194C10.9214 12.3601 11.0004 12.551 11.0004 12.75C11.0004 12.949 10.9214 13.1399 10.7806 13.2806L9.81031 14.25H20V4.5H9.5V5.25C9.5 5.44891 9.42098 5.63968 9.28033 5.78033C9.13968 5.92098 8.94891 6 8.75 6C8.55109 6 8.36032 5.92098 8.21967 5.78033C8.07902 5.63968 8 5.44891 8 5.25V4.5C8 4.10218 8.15804 3.72064 8.43934 3.43934C8.72064 3.15804 9.10218 3 9.5 3H20C20.3978 3 20.7794 3.15804 21.0607 3.43934C21.342 3.72064 21.5 4.10218 21.5 4.5ZM16.25 18C16.0511 18 15.8603 18.079 15.7197 18.2197C15.579 18.3603 15.5 18.5511 15.5 18.75V19.5H5V9.75H15.1897L14.2194 10.7194C14.0786 10.8601 13.9996 11.051 13.9996 11.25C13.9996 11.449 14.0786 11.6399 14.2194 11.7806C14.3601 11.9214 14.551 12.0004 14.75 12.0004C14.949 12.0004 15.1399 11.9214 15.2806 11.7806L17.5306 9.53063C17.6004 9.46097 17.6557 9.37825 17.6934 9.28721C17.7312 9.19616 17.7506 9.09856 17.7506 9C17.7506 8.90144 17.7312 8.80384 17.6934 8.71279C17.6557 8.62175 17.6004 8.53903 17.5306 8.46937L15.2806 6.21937C15.1399 6.07864 14.949 5.99958 14.75 5.99958C14.551 5.99958 14.3601 6.07864 14.2194 6.21937C14.0786 6.36011 13.9996 6.55098 13.9996 6.75C13.9996 6.94902 14.0786 7.13989 14.2194 7.28063L15.1897 8.25H5C4.60218 8.25 4.22064 8.40804 3.93934 8.68934C3.65804 8.97064 3.5 9.35218 3.5 9.75V19.5C3.5 19.8978 3.65804 20.2794 3.93934 20.5607C4.22064 20.842 4.60218 21 5 21H15.5C15.8978 21 16.2794 20.842 16.5607 20.5607C16.842 20.2794 17 19.8978 17 19.5V18.75C17 18.5511 16.921 18.3603 16.7803 18.2197C16.6397 18.079 16.4489 18 16.25 18Z"
                    fill="#18181B"
                />
            </svg>
        )
    },
    {
        label: "Leap",
        value: TradeType.Leap
    },
    {
        label: "Receive",
        value: TradeType.Receive
    },
    {
        label: "Staking",
        value: TradeType.Staking
    },
    {
        label: "Top up",
        value: TradeType.TopUp
    }
]

export default function Trade() {
    const [tradeType, setTradeType] = useState<TradeType>(TradeType.Swap)

    const tradeView = useMemo(() => {
        switch (tradeType) {
            case TradeType.Swap:
                return <SwapView />
            default:
                return <SwapView />
        }
    }, [tradeType])


    return (
        <div
            style={{
                background: 'url("/images/trade-bg.png") center center no-repeat',
                backgroundSize: "100% 100%",
                minHeight: "calc(100vh - 160px)"
            }}
            className="relative"
        >
            {/* <div className="absolute top-0 left-0 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="663" height="793" viewBox="0 0 663 793" fill="none">
                    <path d="M-22.5001 99.5C157.5 254.5 270 -21 406 42C530.102 99.4884 475.513 354.785 75.5 462.5C-333 572.5 21.5 1138.5 641.5 559" stroke="url(#paint0_linear_1483_3472)" stroke-width="63" />
                    <defs>
                        <linearGradient id="paint0_linear_1483_3472" x1="-124.5" y1="4.10235" x2="772.629" y2="263.697" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#B9B2A0" />
                            <stop offset="0.0742138" stop-color="#B8AA9D" />
                            <stop offset="0.200371" stop-color="#FFF1F3" />
                            <stop offset="0.265" stop-color="#DD9EE8" />
                            <stop offset="0.43" stop-color="#9D92C5" />
                            <stop offset="0.565" stop-color="#E8E6E4" />
                            <stop offset="0.685" stop-color="#5CD7CB" />
                            <stop offset="0.8" stop-color="#70AF9C" />
                            <stop offset="0.895" stop-color="#EAE0E3" />
                            <stop offset="1" stop-color="#B7CE5D" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="absolute top-0 right-0 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="777" height="915" viewBox="0 0 777 915" fill="none">
                    <path d="M667 -24.5C343.5 412 829.5 239.5 856 389.5C875.33 498.916 442.5 571.5 847 801.5C866.5 1070 587.5 600 16.5 941" stroke="url(#paint0_linear_1483_3468)" stroke-width="63" />
                    <defs>
                        <linearGradient id="paint0_linear_1483_3468" x1="1047.5" y1="119.104" x2="150.371" y2="378.699" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#B9B2A0" />
                            <stop offset="0.0742138" stop-color="#B8AA9D" />
                            <stop offset="0.200371" stop-color="#FFF1F3" />
                            <stop offset="0.359129" stop-color="#9D92C5" />
                            <stop offset="0.501367" stop-color="#F7C8FF" />
                            <stop offset="0.613608" stop-color="#E8E6E4" />
                            <stop offset="0.685" stop-color="#5CD7CB" />
                            <stop offset="0.8" stop-color="#70AF9C" />
                            <stop offset="0.895" stop-color="#EAE0E3" />
                            <stop offset="1" stop-color="#D8F272" />
                        </linearGradient>
                    </defs>
                </svg>
            </div> */}

            <div className="max-w-[--page-with]  mx-auto pt-4 md:pt-10 pb-10">
                <div className="flex items-center gap-4 justify-between overflow-x-scroll px-3">
                    {TRADE_LIST.map(({ value, label, svg }) => (
                        <div
                            className={`flex items-center justify-center gap-1 text-[#7B7C7B] text-sm font-semibold py-3 px-[18px] rounded-[38px] w-[128px] cursor-pointer ${tradeType === value ? "bg-white/70 text-[#272928]" : ""
                                }`}
                            onClick={() => {
                                setTradeType(value)
                            }}
                        >
                            {svg}
                            {label}
                        </div>
                    ))}
                </div>
                {tradeView}
            </div>
        </div>
    )
}
