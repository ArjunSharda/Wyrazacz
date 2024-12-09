import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { ThemeProvider } from "@/providers/theme-provider"
import { TextEditor } from "@/components/text-editor"
import { TextComparison } from "@/components/text-comparison"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function Home() {
  const { t } = useTranslation()

  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container flex h-16 items-center justify-between">
              <div className="text-2xl font-bold">{t('title')}</div>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="container py-6">
            <Tabs defaultValue="editor" className="space-y-4">
              <TabsList>
                <TabsTrigger value="editor">{t('textEditor')}</TabsTrigger>
                <TabsTrigger value="comparison">{t('textComparison')}</TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                <TextEditor />
              </TabsContent>
              <TabsContent value="comparison">
                <TextComparison />
              </TabsContent>
            </Tabs>
          </main>

          <Footer />
        </div>
      </ThemeProvider>
  )
}

