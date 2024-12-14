"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {analyzeText} from "@/utils/text-analysis"
import {RichTextEditor} from "./rich-text-editor"
import {Progress} from "@/components/ui/progress"
import {Button} from "@/components/ui/button"
import {Download, Upload} from 'lucide-react'

export function TextEditor() {
    const [text, setText] = useState("")
    const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeText>>()

    useEffect(() => {
        const result = analyzeText(text)
        setAnalysis(result)
    }, [text])

    const handleTextChange = (newText: string) => {
        setText(newText)
    }

    const handleExport = () => {
        const blob = new Blob([text], {type: 'text/plain'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'wordcounter-export.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="space-y-6">
            <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-import')?.click()}>
                    <Upload className="h-4 w-4 mr-2"/>
                    Import
                </Button>
                <input
                    id="file-import"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={handleImport}
                />
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2"/>
                    Export
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <RichTextEditor
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Start typing, or copy and paste your text here..."
                    />
                </CardContent>
            </Card>

            {analysis && (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Words" value={analysis.wordCount}/>
                        <StatCard title="Characters" value={analysis.characterCount}/>
                        <StatCard title="Characters (no spaces)" value={analysis.characterCountNoSpaces}/>
                        <StatCard title="Sentences" value={analysis.sentenceCount}/>
                        <StatCard title="Paragraphs" value={analysis.paragraphCount}/>
                        <StatCard title="Reading Time" value={analysis.readingTime}/>
                        <StatCard title="Speaking Time" value={analysis.speakingTime}/>
                        <StatCard title="Unique Words"
                                  value={`${analysis.uniqueWordCount} (${analysis.uniqueWordPercentage.toFixed(1)}%)`}/>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Text Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Avg. words per sentence</span>
                                    <span>{analysis.averageWordsPerSentence.toFixed(1)}</span>
                                </div>
                                <Progress value={Math.min(analysis.averageWordsPerSentence / 20 * 100, 100)}/>
                                <div className="flex justify-between">
                                    <span>Avg. characters per word</span>
                                    <span>{analysis.averageCharactersPerWord.toFixed(1)}</span>
                                </div>
                                <Progress value={Math.min(analysis.averageCharactersPerWord / 7 * 100, 100)}/>
                                <div className="flex justify-between">
                                    <span>Longest word</span>
                                    <span>{analysis.longestWord}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {analysis.keywordDensity.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Keyword Density</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {analysis.keywordDensity.map(({word, count, density}) => (
                                        <div key={word} className="flex justify-between items-center">
                                            <span className="font-medium">{word}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-muted-foreground">{count} times</span>
                                                <Progress value={density} className="w-20"/>
                                                <span className="text-sm">{density.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    )
}

function StatCard({title, value}: { title: string; value: string | number }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

