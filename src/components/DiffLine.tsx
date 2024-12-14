import React from 'react'

type DiffLineProps = {
    type: 'normal' | 'addition' | 'deletion'
    oldLineNumber: number | null
    newLineNumber: number | null
    content: string
    addedChars?: number
    removedChars?: number
}

export const DiffLine: React.FC<DiffLineProps> = ({
                                                      type,
                                                      oldLineNumber,
                                                      newLineNumber,
                                                      content,
                                                      addedChars,
                                                      removedChars,
                                                  }) => {
    const lineClass = {
        normal: 'bg-transparent',
        addition: 'bg-green-100 dark:bg-green-900',
        deletion: 'bg-red-100 dark:bg-red-900',
    }[type]

    return (
        <div className={`flex ${lineClass} font-mono text-sm`}>
            <div className="w-12 text-right pr-2 text-gray-500 select-none">{oldLineNumber ?? ' '}</div>
            <div className="w-12 text-right pr-2 text-gray-500 select-none">{newLineNumber ?? ' '}</div>
            <div className="flex-grow pl-2">
                {content}
                {type !== 'normal' && (
                    <span className="ml-2 text-xs text-gray-500">
                        {type === 'addition' && addedChars && `+${addedChars}`}
                        {type === 'deletion' && removedChars && `-${removedChars}`}
                    </span>
                )}
            </div>
        </div>
    )
}

