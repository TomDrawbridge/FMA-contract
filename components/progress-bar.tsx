interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 via-purple-500 to-green-400"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}
