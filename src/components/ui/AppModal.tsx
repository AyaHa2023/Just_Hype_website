'use client'

import { useEffect, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'

type ModalAction = {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: 'check' | 'x' | 'none'
}

type AppModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  actions?: ModalAction[]
  showClose?: boolean
}

export function AppModal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  showClose = true,
}: AppModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={showClose ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-modal-title"
    >
      <div
        className="w-full sm:max-w-md bg-white border-t sm:border border-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-8 pb-6 sm:p-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
            Just Hype
          </p>
          <h2
            id="app-modal-title"
            className="text-xl sm:text-2xl font-light tracking-wide text-black leading-snug"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-5">{children}</div>}

          {actions && actions.length > 0 && (
            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className={actionButtonClass(action.variant)}
                >
                  {action.icon === 'check' && <Check size={16} strokeWidth={1.5} />}
                  {action.icon === 'x' && <X size={16} strokeWidth={1.5} />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function actionButtonClass(variant: ModalAction['variant'] = 'primary') {
  const base =
    'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-xs tracking-[0.2em] uppercase transition-colors duration-200'

  if (variant === 'secondary') {
    return `${base} border border-black text-black hover:bg-gray-50`
  }
  if (variant === 'ghost') {
    return `${base} text-gray-500 hover:text-black`
  }
  return `${base} bg-black text-white hover:bg-gray-900`
}

type ChoiceOption = {
  id: string
  label: string
  hint?: string
}

export function AppModalChoices({
  options,
  onSelect,
}: {
  options: ChoiceOption[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className="border border-black text-left py-4 px-5 hover:bg-black hover:text-white transition-colors duration-200 group"
        >
          <p className="text-sm tracking-widest uppercase">{option.label}</p>
          {option.hint && (
            <p className="text-xs text-gray-500 group-hover:text-gray-300 mt-1">
              {option.hint}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}
