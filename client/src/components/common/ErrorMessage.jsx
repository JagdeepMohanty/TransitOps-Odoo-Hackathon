import { AlertCircle } from 'lucide-react'
import { cn } from '@/utils'

/**
 * ErrorMessage — displays an inline error with an icon.
 *
 * @prop {string}  message   — error text to display
 * @prop {string}  className — optional extra classes
 */
export default function ErrorMessage({ message, className }) {
  if (!message) return null
  return (
    <div className={cn('flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg', className)}>
      <AlertCircle size={15} className="text-red-500 shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  )
}
