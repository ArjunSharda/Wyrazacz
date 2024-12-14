"use client"

import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useEffect} from 'react'

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({value, onChange, placeholder}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 dark:prose-invert',
            },
        },
        onUpdate: ({editor}) => {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className="border rounded-md dark:border-gray-700">
            <EditorContent editor={editor} placeholder={placeholder}/>
        </div>
    )
}

