interface AdSlotProps {
    slotId: string;
    width: number;
    height: number;
    label: string;
}

function AdSlot({ slotId, width, height, label }: AdSlotProps) {
    return (
        <div
            id={slotId}
            style={{ width: `${width}px`, height: `${height}px` }}
            className="bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 text-sm mx-auto my-4 shadow-sm"
        >
            Google GPT Test Ad: {label} ({width}x{height})
        </div>
    )
}

export default AdSlot
