interface InputProps {
    Title: string,
    Caption: string
}

export default function Success({ Title, Caption }: InputProps) {
    return (
        <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
        >
            <strong className="font-bold">{Title} </strong>
            <span className="block sm:inline">
                {Caption}
            </span>
        </div>
    )
}