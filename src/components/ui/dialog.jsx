import { useState } from "react"

export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null
}

export function DialogTrigger({ asChild, children }) {
  return children
}

export const DialogHeader = ({ children }) => <div>{children}</div>
export const DialogTitle = ({ children }) => (
  <h3 className="text-xl font-semibold mb-2">{children}</h3>
)
export const DialogFooter = ({ children }) => <div className="mt-4">{children}</div>
export const DialogContent = ({ children }) => <div>{children}</div>
