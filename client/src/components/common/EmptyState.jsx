import {
  Inbox, SearchX, WifiOff, ShieldOff, FolderOpen, Plus,
} from 'lucide-react'
import { cn } from '@/utils'

const PRESETS = {
  empty:       { icon: Inbox,      title: 'No data yet',          description: 'Nothing to show here yet.' },
  search:      { icon: SearchX,    title: 'No results found',     description: 'Try adjusting your search or filters.' },
  offline:     { icon: WifiOff,    title: 'You\'re offline',      description: 'Check your internet connection and try again.' },
  unauthorized:{ icon: ShieldOff,  title: 'Access denied',        description: 'You don\'t have permission to view this.' },
  folder:      { icon: FolderOpen, title: 'This folder is empty', description: 'Add items to get started.' },
}

/**
 * EmptyState
 * @prop {string}  type        — empty | search | offline | unauthorized | folder  (default: empty)
 * @prop {string}  title       — override heading
 * @prop {string}  description — override body text
 * @prop {node}    icon        — custom icon component (overrides preset)
 * @prop {node}    action      — CTA button/node rendered below description
 * @prop {boolean} compact     — smaller padding, smaller text
 * @prop {string}  className
 */
export default function EmptyState({
  type = 'empty',
  title,
  description,
  icon: CustomIcon,
  action,
  compact = false,
  className,
}) {
  const preset  = PRESETS[type] ?? PRESETS.empty
  const Icon    = CustomIcon ?? preset.icon
  const heading = title       ?? preset.title
  const body    = description ?? preset.description

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-8 px-4' : 'py-16 px-6',
      className,
    )}>
      {/* Icon container */}
      <div className={cn(
        'rounded-2xl bg-slate-100 flex items-center justify-center mb-4',
        compact ? 'w-10 h-10' : 'w-14 h-14',
      )}>
        <Icon
          className="text-slate-400"
          size={compact ? 20 : 26}
          strokeWidth={1.5}
        />
      </div>

      <p className={cn('font-semibold text-slate-700', compact ? 'text-sm' : 'text-base')}>
        {heading}
      </p>

      {body && (
        <p className={cn('text-slate-400 mt-1 max-w-xs leading-relaxed', compact ? 'text-xs' : 'text-sm')}>
          {body}
        </p>
      )}

      {action && (
        <div className="mt-5">{action}</div>
      )}
    </div>
  )
}
