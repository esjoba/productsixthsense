export interface Category {
  name: string
  keywords: string[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Performance',
    keywords: ['slow', 'fast', 'speed', 'lag', 'delay', 'loading', 'latency', 'performance'],
  },
  {
    name: 'UI/UX',
    keywords: ['ui', 'ux', 'interface', 'design', 'layout', 'button', 'confusing', 'unclear'],
  },
  {
    name: 'Features',
    keywords: ['feature', 'add', 'implement', 'request', 'functionality', 'capability'],
  },
  {
    name: 'Integrations',
    keywords: ['integration', 'api', 'connect', 'sync', 'webhook', 'import', 'export'],
  },
  {
    name: 'Documentation',
    keywords: ['docs', 'documentation', 'guide', 'tutorial', 'help', 'instructions'],
  },
  {
    name: 'Bug',
    keywords: ['bug', 'issue', 'error', 'crash', 'broken', 'fail', 'problem'],
  },
]

export function categorizeText(text: string): string {
  const lowerText = text.toLowerCase()
  
  for (const category of CATEGORIES) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword)) {
        return category.name
      }
    }
  }
  
  return 'General'
}

export function calculateScore(text: string, sentiment: 'positive' | 'negative' | 'neutral'): number {
  let score = 50 // base score

  // Sentiment scoring
  if (sentiment === 'positive') score += 15
  if (sentiment === 'negative') score += 25

  // Length scoring - more detailed feedback is valuable
  const wordCount = text.split(/\s+/).length
  if (wordCount > 20) score += 10
  if (wordCount > 50) score += 5

  // Urgency keywords
  const urgencyKeywords = ['urgent', 'critical', 'asap', 'blocking', 'broken', 'crash', 'emergency']
  if (urgencyKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
    score += 20
  }

  // Request specificity
  const specificity = (text.match(/\?/g) || []).length
  if (specificity > 0) score += 5

  return Math.min(score, 100)
}

export function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveKeywords = ['great', 'love', 'awesome', 'excellent', 'perfect', 'fantastic', 'amazing', 'wonderful']
  const negativeKeywords = ['hate', 'terrible', 'awful', 'poor', 'bad', 'worse', 'broken', 'frustrated', 'annoyed']

  const lowerText = text.toLowerCase()
  
  const hasPositive = positiveKeywords.some(word => lowerText.includes(word))
  const hasNegative = negativeKeywords.some(word => lowerText.includes(word))

  if (hasNegative && !hasPositive) return 'negative'
  if (hasPositive && !hasNegative) return 'positive'
  return 'neutral'
}
