/**
 * Demo Scenarios
 *
 * Contains pre-built verification scenarios for the demo experience.
 * These are used by TripBoard and GroupSetup components.
 *
 * Note: This file is scenarios.ts, NOT index.ts.
 * Import path: @/lib/demo/scenarios
 */

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  category: "research" | "news" | "ai" | "science";
  claims: Array<{
    claim_id: string;
    claim_text: string;
    context: string;
  }>;
  sources: Array<{
    source_id: string;
    title: string;
    content: string;
    source_type: "academic" | "news" | "government" | "industry" | "blog" | "other";
  }>;
  expectedVerdicts: Record<string, "supported" | "contradicted" | "unsupported">;
  pricingTier: "quick" | "deep" | "bundle";
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "crypto-origins",
    name: "Cryptocurrency Origins",
    description: "Verify historical claims about Bitcoin and Ethereum",
    category: "research",
    claims: [
      {
        claim_id: "c1",
        claim_text: "Bitcoin was created by Satoshi Nakamoto and launched in January 2009",
        context: "Historical claim about cryptocurrency origins",
      },
      {
        claim_id: "c2",
        claim_text: "Ethereum was proposed by Vitalik Buterin in 2013",
        context: "Claim about Ethereum's founding",
      },
      {
        claim_id: "c3",
        claim_text: "The first Bitcoin transaction was for pizza",
        context: "Popular claim about early Bitcoin usage",
      },
    ],
    sources: [
      {
        source_id: "s1",
        title: "Bitcoin Whitepaper",
        content: "Bitcoin: A Peer-to-Peer Electronic Cash System was published by Satoshi Nakamoto in October 2008. The network went live in January 2009.",
        source_type: "academic",
      },
      {
        source_id: "s2",
        title: "Ethereum Whitepaper",
        content: "Ethereum was proposed in late 2013 by Vitalik Buterin, a cryptocurrency researcher and programmer.",
        source_type: "academic",
      },
      {
        source_id: "s3",
        title: "Bitcoin Pizza Day",
        content: "On May 22, 2010, Laszlo Hanyecz paid 10,000 BTC for two Papa John's pizzas, marking the first known commercial Bitcoin transaction.",
        source_type: "news",
      },
    ],
    expectedVerdicts: {
      c1: "supported",
      c2: "supported",
      c3: "supported",
    },
    pricingTier: "deep",
  },
  {
    id: "climate-facts",
    name: "Climate Science Facts",
    description: "Verify claims about climate change and environmental science",
    category: "science",
    claims: [
      {
        claim_id: "c1",
        claim_text: "Global temperatures have risen approximately 1.1 degrees Celsius since pre-industrial times",
        context: "Climate change temperature claim",
      },
      {
        claim_id: "c2",
        claim_text: "Climate change is a hoax invented by scientists",
        context: "Contrarian climate claim",
      },
      {
        claim_id: "c3",
        claim_text: "The Arctic could be ice-free in summer by 2050",
        context: "Future climate projection",
      },
    ],
    sources: [
      {
        source_id: "s1",
        title: "IPCC AR6 Report",
        content: "Global surface temperature was 1.09C higher in 2011-2020 than 1850-1900. The rate of warming has accelerated since the 1970s.",
        source_type: "government",
      },
      {
        source_id: "s2",
        title: "NASA Climate Science",
        content: "The scientific consensus on climate change is overwhelming. Multiple independent lines of evidence confirm human-caused warming.",
        source_type: "government",
      },
      {
        source_id: "s3",
        title: "Arctic Sea Ice Outlook",
        content: "Models project the Arctic could experience ice-free summers by 2040-2060, with some estimates as early as 2030.",
        source_type: "academic",
      },
    ],
    expectedVerdicts: {
      c1: "supported",
      c2: "contradicted",
      c3: "partially_supported",
    },
    pricingTier: "deep",
  },
  {
    id: "ai-capabilities",
    name: "AI Capabilities",
    description: "Verify claims about artificial intelligence and machine learning",
    category: "ai",
    claims: [
      {
        claim_id: "c1",
        claim_text: "GPT-4 was released by OpenAI in March 2023",
        context: "AI industry timeline claim",
      },
      {
        claim_id: "c2",
        claim_text: "AI has achieved general intelligence surpassing humans",
        context: "Bold AI capability claim",
      },
      {
        claim_id: "c3",
        claim_text: "Machine learning models require large datasets for training",
        context: "Basic ML concept claim",
      },
    ],
    sources: [
      {
        source_id: "s1",
        title: "OpenAI GPT-4 Announcement",
        content: "OpenAI announced GPT-4 on March 14, 2023. It is a multimodal large language model.",
        source_type: "industry",
      },
      {
        source_id: "s2",
        title: "AI Research Papers",
        content: "Current AI systems, including large language models, are narrow AI systems designed for specific tasks. Artificial General Intelligence (AGI) has not been achieved.",
        source_type: "academic",
      },
      {
        source_id: "s3",
        title: "Machine Learning Fundamentals",
        content: "Machine learning models typically require large datasets for effective training, though transfer learning and few-shot techniques are advancing.",
        source_type: "academic",
      },
    ],
    expectedVerdicts: {
      c1: "supported",
      c2: "contradicted",
      c3: "supported",
    },
    pricingTier: "quick",
  },
  {
    id: "space-exploration",
    name: "Space Exploration",
    description: "Verify claims about space missions and astronomy",
    category: "research",
    claims: [
      {
        claim_id: "c1",
        claim_text: "The James Webb Space Telescope was launched in December 2021",
        context: "Space mission timeline claim",
      },
      {
        claim_id: "c2",
        claim_text: "Humans have landed on Mars",
        context: "Bold space exploration claim",
      },
    ],
    sources: [
      {
        source_id: "s1",
        title: "NASA JWST Launch",
        content: "The James Webb Space Telescope launched on December 25, 2021, from Kourou, French Guiana.",
        source_type: "government",
      },
      {
        source_id: "s2",
        title: "Mars Exploration Status",
        content: "As of 2024, no human has set foot on Mars. Multiple robotic missions have explored the Martian surface.",
        source_type: "government",
      },
    ],
    expectedVerdicts: {
      c1: "supported",
      c2: "contradicted",
    },
    pricingTier: "quick",
  },
  {
    id: "tech-rumors",
    name: "Tech Industry Rumors",
    description: "Verify unverified claims and rumors in the tech industry",
    category: "news",
    claims: [
      {
        claim_id: "c1",
        claim_text: "Apple is developing a foldable iPhone for 2025",
        context: "Unverified product rumor",
      },
      {
        claim_id: "c2",
        claim_text: "Tesla will release a $25,000 electric car",
        context: "Product announcement claim",
      },
    ],
    sources: [
      {
        source_id: "s1",
        title: "Supply Chain Reports",
        content: "Various supply chain analysts have reported Apple is testing foldable display prototypes, but no official announcement has been made.",
        source_type: "news",
      },
      {
        source_id: "s2",
        title: "Tesla Investor Relations",
        content: "Tesla has discussed plans for more affordable vehicles but has not confirmed a specific $25,000 model or timeline.",
        source_type: "industry",
      },
    ],
    expectedVerdicts: {
      c1: "unsupported",
      c2: "unsupported",
    },
    pricingTier: "quick",
  },
];

/**
 * Get a demo scenario by ID.
 */
export function getScenarioById(id: string): DemoScenario | undefined {
  return demoScenarios.find((s) => s.id === id);
}

/**
 * Get demo scenarios by category.
 */
export function getScenariosByCategory(category: DemoScenario["category"]): DemoScenario[] {
  return demoScenarios.filter((s) => s.category === category);
}

/**
 * Get all available categories.
 */
export function getCategories(): Array<{ id: string; name: string; count: number }> {
  const categories = new Map<string, number>();
  for (const scenario of demoScenarios) {
    categories.set(scenario.category, (categories.get(scenario.category) || 0) + 1);
  }
  return Array.from(categories.entries()).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    count,
  }));
}

export default demoScenarios;
