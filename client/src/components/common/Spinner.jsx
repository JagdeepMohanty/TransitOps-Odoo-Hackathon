import { cn } from '@/utils'

export default function Spinner({ size = 'md', className }) {
  const DIM = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const BRD = { sm: 'border-2', md: 'border-[3px]', lg: 'border-4' }
  return (
    <div className={cn('relative flex items-center justify-center', DIM[size], className)}>
      <div className={cn('absolute inset-0 rounded-full border-slate-200', BRD[size])} />
      <div className={cn('absolute inset-0 rounded-full border-transparent border-t-brand-600 animate-spin', BRD[size])} />
    </div>
  )
}
