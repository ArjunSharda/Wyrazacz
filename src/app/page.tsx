"use client"

import {useState} from "react"
import {ThemeProvider} from "@/providers/theme-provider"
import {TextEditor} from "@/components/text-editor"
import {TextComparison} from "@/components/text-comparison"
import {ThemeToggle} from "@/components/theme-toggle"
import {Footer} from "@/components/footer"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("editor")

  return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex flex-col min-h-screen bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <header
                className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between mx-auto">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold">Wyrazacz</h1>
                  <TabsList className="hidden sm:flex">
                    <TabsTrigger value="editor">Text Editor</TabsTrigger>
                    <TabsTrigger value="comparison">Text Comparison</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle/>
                </div>
              </div>
            </header>

            <main className="flex-1 container py-6 mx-auto max-w-4xl flex flex-col items-center">
              <TabsList className="sm:hidden w-full mb-4">
                <TabsTrigger value="editor" className="flex-1">
                  Text Editor
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex-1">
                  Text Comparison
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-0 w-full">
                <TextEditor />
              </TabsContent>
              <TabsContent value="comparison" className="mt-0 w-full">
                <TextComparison />
              </TabsContent>
            </main>
          </Tabs>

          <Footer />
        </div>
      </ThemeProvider>
  )
}

