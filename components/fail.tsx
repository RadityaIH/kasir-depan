interface InputProps {
    Title: string,
    Caption: string
}

export default function Fail({ Title, Caption }: InputProps) {
    return (
        <div
            className="mt-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
        >
            <strong className="font-bold">{Title} </strong>
            <span className="block sm:inline">
                {Caption}
            </span>
        </div>
    )
}