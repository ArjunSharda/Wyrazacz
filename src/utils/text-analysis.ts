export function analyzeText(text: string) {
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.match(/\b[\w']+\b/g) || [];
    const characters = plainText.length;
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = plainText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const wordFrequency: { [key: string]: number } = {};
    words.forEach(word => {
        const normalized = word.toLowerCase();
        wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
    });
    const keywordDensity = Object.entries(wordFrequency)
        .map(([word, count]) => ({
            word,
            count,
            density: (count / words.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const longestWord = words.reduce((longest, current) =>
            current.length > longest.length ? current : longest
        , '');
    return {
        wordCount: words.length,
        characterCount: characters,
        characterCountNoSpaces: plainText.replace(/\s/g, '').length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        averageWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
        averageCharactersPerWord: words.length > 0 ? characters / words.length : 0,
        uniqueWordCount: uniqueWords,
        uniqueWordPercentage: (uniqueWords / words.length) * 100,
        longestWord,
        keywordDensity,
        readingTime: calculateReadingTime(words.length),
        speakingTime: calculateSpeakingTime(words.length),
    };
}

function calculateReadingTime(wordCount: number): string {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    if (minutes < 1) return "Less than a minute";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
}

function calculateSpeakingTime(wordCount: number): string {
    const wordsPerMinute = 150;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    if (minutes < 1) return "Less than a minute";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
}

