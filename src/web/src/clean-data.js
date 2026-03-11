//
//  Clean Dashboard Data - Copy-Paste Friendly
//  CodeVoyager Project
//

const cleanDashboardData = {
  timestamp: new Date().toISOString(),
  scraping: {
    totalScraped: 1247,
    successRate: 98.8,
    errorRate: 1.2,
    autoScalingTriggered: false
  },
  processing: {
    totalProcessed: 1247,
    qualityDistribution: { 
      excellent: 450, 
      good: 600, 
      fair: 150, 
      poor: 47 
    },
    totalBusinessValue: 15680
  },
  monitoring: {
    performanceMetrics: {
      renderSpeed: 1150,
      memoryUsage: 118,
      cpuUsage: 65,
      errorRate: 1.2
    },
    iso25010Compliance: {
      overallScore: 94.1,
      compliant: true
    }
  },
  financial: {
    totalInvestment: 230000,
    totalReturn: 390500,
    averageROI: 159,
    valueEnabled: 243000
  },
  themes: {
    'E-Commerce': { 
      count: 342, 
      sites: ['shopify.com', 'amazon.com'], 
      characteristics: ['Shopping cart', 'Product catalog'] 
    },
    'SaaS': { 
      count: 287, 
      sites: ['slack.com', 'notion.so'], 
      characteristics: ['Dashboard', 'Analytics'] 
    },
    'Corporate': { 
      count: 198, 
      sites: ['microsoft.com', 'google.com'], 
      characteristics: ['Professional design', 'Company info'] 
    },
    'Portfolio': { 
      count: 156, 
      sites: ['dribbble.com', 'behance.net'], 
      characteristics: ['Gallery', 'Projects showcase'] 
    },
    'Blog/Media': { 
      count: 134, 
      sites: ['medium.com', 'wordpress.com'], 
      characteristics: ['Content focused', 'Articles'] 
    },
    'Education': { 
      count: 89, 
      sites: ['coursera.org', 'udemy.com'], 
      characteristics: ['Course catalog', 'Learning platform'] 
    },
    'Healthcare': { 
      count: 67, 
      sites: ['webmd.com', 'mayoclinic.org'], 
      characteristics: ['Medical info', 'Patient portal'] 
    },
    'Finance': { 
      count: 54, 
      sites: ['paypal.com', 'stripe.com'], 
      characteristics: ['Security', 'Transactions'] 
    },
    'Social': { 
      count: 43, 
      sites: ['facebook.com', 'twitter.com'], 
      characteristics: ['Community', 'Networking'] 
    },
    'Entertainment': { 
      count: 27, 
      sites: ['netflix.com', 'youtube.com'], 
      characteristics: ['Media streaming', 'Content'] 
    }
  },
  designPatterns: {
    'Minimalist': { 
      count: 567, 
      examples: ['apple.com', 'spotify.com'] 
    },
    'Material Design': { 
      count: 423, 
      examples: ['google.com', 'android.com'] 
    },
    'Dark Mode': { 
      count: 389, 
      examples: ['github.com', 'slack.com'] 
    },
    'Card-based': { 
      count: 445, 
      examples: ['pinterest.com', 'trello.com'] 
    },
    'Mobile-first': { 
      count: 612, 
      examples: ['instagram.com', 'tiktok.com'] 
    }
  },
  technologies: {
    'React': { 
      count: 445, 
      sites: ['facebook.com', 'airbnb.com'] 
    },
    'Vue': { 
      count: 234, 
      sites: ['gitlab.com', 'adobe.com'] 
    },
    'Angular': { 
      count: 189, 
      sites: ['microsoft.com', 'google.com'] 
    },
    'WordPress': { 
      count: 567, 
      sites: ['techcrunch.com', 'wired.com'] 
    },
    'Shopify': { 
      count: 234, 
      sites: ['allbirds.com', 'glossier.com'] 
    },
    'Custom': { 
      count: 445, 
      sites: ['netflix.com', 'spotify.com'] 
    }
  },
  recentActivity: [
    { 
      timestamp: new Date().toISOString(), 
      type: 'scrape_success', 
      details: 'E-commerce theme analysis completed', 
      value: 10 
    },
    { 
      timestamp: new Date(Date.now() - 300000).toISOString(), 
      type: 'data_processed', 
      details: 'SaaS dashboard patterns identified', 
      value: 25 
    },
    { 
      timestamp: new Date(Date.now() - 600000).toISOString(), 
      type: 'system_alert', 
      details: 'Technology stack analysis updated', 
      value: 5 
    }
  ]
};

// Export for easy copying
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cleanDashboardData;
}
