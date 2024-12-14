"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Switch} from "@/components/ui/switch"
import {analyzeText} from "@/utils/text-analysis"
import {RichTextEditor} from "./rich-text-editor"
import DiffMatchPatch from 'diff-match-patch'
import {Download, Upload} from 'lucide-react'

type Comparison = {
    wordCountDiff: number
    characterCountDiff: number
    diff: Array<[number, string]>
    addedChars: number
    removedChars: number
}

export function TextComparison() {
    const [text1, setText1] = useState("")
    const [text2, setText2] = useState("")
    const [comparison, setComparison] = useState<Comparison | null>(null)
    const [sideBySide, setSideBySide] = useState(false)

    const compareTexts = () => {
        const analysis1 = analyzeText(text1)
        const analysis2 = analyzeText(text2)

        const dmp = new DiffMatchPatch()
        const diff = dmp.diff_main(text1.replace(/<[^>]*>/g, ''), text2.replace(/<[^>]*>/g, ''))
        dmp.diff_cleanupSemantic(diff)

        let addedChars = 0
        let removedChars = 0

        diff.forEach(([type, text]) => {
            if (type === 1) {
                addedChars += text.length
            } else if (type === -1) {
                removedChars += text.length
            }
        })

        setComparison({
            wordCountDiff: analysis2.wordCount - analysis1.wordCount,
            characterCountDiff: analysis2.characterCount - analysis1.characterCount,
            diff,
            addedChars,
            removedChars,
        })
    }

    const renderInlineDiff = (diff: Array<[number, string]>) => {
        return diff.map(([type, text], index) => {
            if (type === 0) {
                return <span key={index}>{text}</span>
            } else if (type === 1) {
                return <span key={index} className="bg-green-200 dark:bg-green-900">{text}</span>
            } else {
                return <span key={index} className="bg-red-200 dark:bg-red-900 line-through">{text}</span>
            }
        })
    }

    const handleExport = (text: string, filename: string) => {
        const blob = new Blob([text], {type: 'text/plain'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>, setText: (text: string) => void) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result
                if (typeof content === 'string') {
                    setText(content)
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-end space-x-2 mb-2">
                            <Button variant="outline" size="sm"
                                    onClick={() => document.getElementById('file-import-1')?.click()}>
                                <Upload className="h-4 w-4 mr-2"/>
                                Import
                            </Button>
                            <input
                                id="file-import-1"
                                type="file"
                                accept=".txt"
                                className="hidden"
                                onChange={(e) => handleImport(e, setText1)}
                            />
                            <Button variant="outline" size="sm"
                                    onClick={() => handleExport(text1, 'comparison-text-1.txt')}>
                                <Download className="h-4 w-4 mr-2"/>
                                Export
                            </Button>
                        </div>
                        <RichTextEditor
                            value={text1}
                            onChange={setText1}
                            placeholder="Enter original text here"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-end space-x-2 mb-2">
                            <Button variant="outline" size="sm"
                                    onClick={() => document.getElementById('file-import-2')?.click()}>
                                <Upload className="h-4 w-4 mr-2"/>
                                Import
                            </Button>
                            <input
                                id="file-import-2"
                                type="file"
                                accept=".txt"
                                className="hidden"
                                onChange={(e) => handleImport(e, setText2)}
                            />
                            <Button variant="outline" size="sm"
                                    onClick={() => handleExport(text2, 'comparison-text-2.txt')}>
                                <Download className="h-4 w-4 mr-2"/>
                                Export
                            </Button>
                        </div>
                        <RichTextEditor
                            value={text2}
                            onChange={setText2}
                            placeholder="Enter modified text here"
                        />
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center space-x-4">
                <Button onClick={compareTexts}>Compare</Button>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="side-by-side"
                        checked={sideBySide}
                        onCheckedChange={setSideBySide}
                    />
                    <label htmlFor="side-by-side">Side-by-side view</label>
                </div>
            </div>
            {comparison && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Differences</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>Word Count Difference: {comparison.wordCountDiff}</div>
                            <div>Character Count Difference: {comparison.characterCountDiff}</div>
                            <div>Added Characters: {comparison.addedChars}</div>
                            <div>Removed Characters: {comparison.removedChars}</div>
                        </div>
                        <div className={`${sideBySide ? 'flex' : 'block'} border rounded overflow-x-auto p-4`}>
                            {sideBySide ? (
                                <>
                                    <div className="w-1/2 border-r pr-2">
                                        {renderInlineDiff(comparison.diff.filter(([type]) => type !== 1))}
                                    </div>
                                    <div className="w-1/2 pl-2">
                                        {renderInlineDiff(comparison.diff.filter(([type]) => type !== -1))}
                                    </div>
                                </>
                            ) : (
                                <div>{renderInlineDiff(comparison.diff)}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

