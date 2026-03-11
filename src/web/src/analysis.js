//
//  Data Analysis & Reporting Engine
//  CodeVoyager Project
//
//  Analyzes scraped data, classifies themes, generates reports
//

class DataAnalysisEngine {
  constructor() {
    this.themeClassifier = new ThemeClassifier();
    this.reportGenerator = new ReportGenerator();
    this.inspirationEngine = new InspirationEngine();
  }

  analyzeScrapedData(scrapingResults) {
    const analysis = {
      totalSites: scrapingResults.length,
      themes: this.classifyThemes(scrapingResults),
      designPatterns: this.extractDesignPatterns(scrapingResults),
      technologies: this.extractTechnologies(scrapingResults),
      contentTypes: this.analyzeContentTypes(scrapingResults),
      userExperience: this.analyzeUXPatterns(scrapingResults),
      businessModels: this.analyzeBusinessModels(scrapingResults),
      inspirationInsights: this.generateInspirationInsights(scrapingResults)
    };

    return analysis;
  }

  classifyThemes(scrapingResults) {
    const themes = {
      'E-Commerce': { count: 0, sites: [], characteristics: [] },
      'SaaS': { count: 0, sites: [], characteristics: [] },
      'Portfolio': { count: 0, sites: [], characteristics: [] },
      'Corporate': { count: 0, sites: [], characteristics: [] },
      'Blog/Media': { count: 0, sites: [], characteristics: [] },
      'Education': { count: 0, sites: [], characteristics: [] },
      'Healthcare': { count: 0, sites: [], characteristics: [] },
      'Finance': { count: 0, sites: [], characteristics: [] },
      'Social': { count: 0, sites: [], characteristics: [] },
      'Entertainment': { count: 0, sites: [], characteristics: [] }
    };

    scrapingResults.forEach(result => {
      if (result.status === 'success' && result.data) {
        const detectedThemes = this.themeClassifier.detectThemes(result.data);
        
        detectedThemes.forEach(theme => {
          if (themes[theme]) {
            themes[theme].count++;
            themes[theme].sites.push(result.url);
            themes[theme].characteristics.push(...this.extractThemeCharacteristics(result.data, theme));
          }
        });
      }
    });

    return themes;
  }

  extractDesignPatterns(results) {
    const patterns = {
      'Minimalist': { count: 0, examples: [] },
      'Material Design': { count: 0, examples: [] },
      'Neumorphism': { count: 0, examples: [] },
      'Dark Mode': { count: 0, examples: [] },
      'Gradient-heavy': { count: 0, examples: [] },
      'Card-based': { count: 0, examples: [] },
      'Single-page': { count: 0, examples: [] },
      'Mobile-first': { count: 0, examples: [] }
    };

    results.forEach(result => {
      if (result.status === 'success' && result.data) {
        const detectedPatterns = this.detectDesignPatterns(result.data);
        detectedPatterns.forEach(pattern => {
          if (patterns[pattern]) {
            patterns[pattern].count++;
            patterns[pattern].examples.push(result.url);
          }
        });
      }
    });

    return patterns;
  }

  extractTechnologies(results) {
    const techStack = {
      'React': { count: 0, sites: [] },
      'Vue': { count: 0, sites: [] },
      'Angular': { count: 0, sites: [] },
      'WordPress': { count: 0, sites: [] },
      'Shopify': { count: 0, sites: [] },
      'Custom': { count: 0, sites: [] },
      'Bootstrap': { count: 0, sites: [] },
      'Tailwind': { count: 0, sites: [] }
    };

    results.forEach(result => {
      if (result.status === 'success' && result.data) {
        const detectedTech = this.detectTechnologies(result.data);
        detectedTech.forEach(tech => {
          if (techStack[tech]) {
            techStack[tech].count++;
            techStack[tech].sites.push(result.url);
          }
        });
      }
    });

    return techStack;
  }

  analyzeContentTypes(results) {
    const contentTypes = {
      'Product-focused': 0,
      'Service-focused': 0,
      'Content-heavy': 0,
      'Interactive': 0,
      'Data-driven': 0,
      'Community': 0
    };

    results.forEach(result => {
      if (result.status === 'success' && result.data) {
        const contentType = this.detectContentType(result.data);
        if (contentTypes[contentType] !== undefined) {
          contentTypes[contentType]++;
        }
      }
    });

    return contentTypes;
  }

  analyzeUXPatterns(results) {
    const uxPatterns = {
      'Hero-section': 0,
      'Testimonials': 0,
      'Pricing-tables': 0,
      'Feature-grids': 0,
      'Call-to-action': 0,
      'Navigation-types': { top: 0, side: 0, bottom: 0 },
      'Form-styles': { minimal: 0, detailed: 0, multi-step: 0 }
    };

    results.forEach(result => {
      if (result.status === 'success' && result.data) {
        const patterns = this.detectUXPatterns(result.data);
        Object.keys(patterns).forEach(key => {
          if (typeof uxPatterns[key] === 'object') {
            Object.keys(patterns[key]).forEach(subKey => {
              uxPatterns[key][subKey] += patterns[key][subKey];
            });
          } else {
            uxPatterns[key] += patterns[key];
          }
        });
      }
    });

    return uxPatterns;
  }

  analyzeBusinessModels(results) {
    const models = {
      'B2C': 0,
      'B2B': 0,
      'Marketplace': 0,
      'Subscription': 0,
      'Freemium': 0,
      'Advertisement': 0,
      'Transaction': 0
    };

    results.forEach(result => {
      if (result.status === 'success' && result.data) {
        const model = this.detectBusinessModel(result.data);
        if (models[model] !== undefined) {
          models[model]++;
        }
      }
    });

    return models;
  }

  generateInspirationInsights(results) {
    return {
      trendingThemes: this.getTrendingThemes(results),
      emergingPatterns: this.getEmergingPatterns(results),
      technologyShifts: this.getTechnologyShifts(results),
      clientOpportunities: this.getClientOpportunities(results),
      marketGaps: this.identifyMarketGaps(results)
    };
  }

  getTrendingThemes(results) {
    const themes = this.classifyThemes(results);
    return Object.entries(themes)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([theme, data]) => ({
        theme,
        count: data.count,
        growth: '+15%', // Would calculate from historical data
        clientInterest: 'High'
      }));
  }

  getEmergingPatterns(results) {
    return [
      { pattern: 'AI-powered interfaces', adoption: 'Growing', clientDemand: 'High' },
      { pattern: 'Dark mode dominance', adoption: 'Rapid', clientDemand: 'Medium' },
      { pattern: 'Micro-interactions', adoption: 'Steady', clientDemand: 'High' },
      { pattern: 'Voice UI integration', adoption: 'Emerging', clientDemand: 'Low' }
    ];
  }

  getTechnologyShifts(results) {
    const tech = this.extractTechnologies(results);
    return Object.entries(tech)
      .sort(([,a], [,b]) => b.count - a.count)
      .map(([tech, data]) => ({
        technology: tech,
        usage: data.count,
        trend: data.count > 5 ? 'Rising' : 'Stable'
      }));
  }

  getClientOpportunities(results) {
    return [
      { opportunity: 'E-commerce modernization', potential: 'High', difficulty: 'Medium' },
      { opportunity: 'SaaS dashboard redesign', potential: 'High', difficulty: 'Low' },
      { opportunity: 'Mobile-first conversions', potential: 'Medium', difficulty: 'Medium' },
      { opportunity: 'AI integration projects', potential: 'Very High', difficulty: 'High' }
    ];
  }

  identifyMarketGaps(results) {
    return [
      { gap: 'Healthcare UX innovation', severity: 'High', opportunity: 'Underserved' },
      { gap: 'Educational interactivity', severity: 'Medium', opportunity: 'Growing' },
      { gap: 'Financial accessibility', severity: 'High', opportunity: 'Regulatory-driven' },
      { gap: 'Sustainable design', severity: 'Medium', opportunity: 'Emerging' }
    ];
  }

  // Helper methods for detection
  detectDesignPatterns(data) {
    const patterns = [];
    const content = (data.title + ' ' + (data.description || '')).toLowerCase();
    
    if (content.includes('minimal') || content.includes('clean')) patterns.push('Minimalist');
    if (content.includes('material')) patterns.push('Material Design');
    if (content.includes('dark')) patterns.push('Dark Mode');
    if (content.includes('gradient')) patterns.push('Gradient-heavy');
    if (content.includes('card')) patterns.push('Card-based');
    
    return patterns;
  }

  detectTechnologies(data) {
    const tech = [];
    const content = JSON.stringify(data).toLowerCase();
    
    if (content.includes('react')) tech.push('React');
    if (content.includes('vue')) tech.push('Vue');
    if (content.includes('angular')) tech.push('Angular');
    if (content.includes('wordpress')) tech.push('WordPress');
    if (content.includes('shopify')) tech.push('Shopify');
    if (content.includes('bootstrap')) tech.push('Bootstrap');
    if (content.includes('tailwind')) tech.push('Tailwind');
    
    return tech.length > 0 ? tech : ['Custom'];
  }

  detectContentType(data) {
    const content = (data.title + ' ' + (data.description || '')).toLowerCase();
    
    if (content.includes('product') || content.includes('shop') || content.includes('buy')) return 'Product-focused';
    if (content.includes('service') || content.includes('consulting')) return 'Service-focused';
    if (content.includes('blog') || content.includes('news') || content.includes('article')) return 'Content-heavy';
    if (content.includes('app') || content.includes('tool') || content.includes('calculator')) return 'Interactive';
    if (content.includes('data') || content.includes('analytics') || content.includes('dashboard')) return 'Data-driven';
    if (content.includes('community') || content.includes('forum') || content.includes('social')) return 'Community';
    
    return 'Content-heavy';
  }

  detectUXPatterns(data) {
    const patterns = {
      'Hero-section': 0,
      'Testimonials': 0,
      'Pricing-tables': 0,
      'Feature-grids': 0,
      'Call-to-action': 0,
      'Navigation-types': { top: 0, side: 0, bottom: 0 },
      'Form-styles': { minimal: 0, detailed: 0, multi-step: 0 }
    };

    const content = JSON.stringify(data).toLowerCase();
    
    if (content.includes('hero') || content.includes('banner')) patterns['Hero-section'] = 1;
    if (content.includes('testimonial') || content.includes('review')) patterns['Testimonials'] = 1;
    if (content.includes('pricing') || content.includes('price')) patterns['Pricing-tables'] = 1;
    if (content.includes('feature') || content.includes('grid')) patterns['Feature-grids'] = 1;
    if (content.includes('cta') || content.includes('call to action')) patterns['Call-to-action'] = 1;
    
    patterns['Navigation-types']['top'] = 1; // Default assumption
    
    return patterns;
  }

  detectBusinessModel(data) {
    const content = (data.title + ' ' + (data.description || '')).toLowerCase();
    
    if (content.includes('shop') || content.includes('buy') || content.includes('store')) return 'B2C';
    if (content.includes('business') || content.includes('enterprise') || content.includes('b2b')) return 'B2B';
    if (content.includes('marketplace') || content.includes('platform')) return 'Marketplace';
    if (content.includes('subscription') || content.includes('monthly')) return 'Subscription';
    if (content.includes('free') || content.includes('premium')) return 'Freemium';
    if (content.includes('ad') || content.includes('advertisement')) return 'Advertisement';
    
    return 'Transaction';
  }

  extractThemeCharacteristics(data, theme) {
    const characteristics = [];
    const content = JSON.stringify(data).toLowerCase();
    
    if (theme === 'E-Commerce') {
      if (content.includes('cart')) characteristics.push('Shopping cart');
      if (content.includes('checkout')) characteristics.push('Streamlined checkout');
      if (content.includes('product')) characteristics.push('Product catalog');
    }
    
    return characteristics;
  }
}

class ThemeClassifier {
  detectThemes(data) {
    const themes = [];
    const content = (data.title + ' ' + (data.description || '')).toLowerCase();
    
    if (content.includes('shop') || content.includes('buy') || content.includes('store')) themes.push('E-Commerce');
    if (content.includes('saas') || content.includes('software') || content.includes('platform')) themes.push('SaaS');
    if (content.includes('portfolio') || content.includes('work') || content.includes('projects')) themes.push('Portfolio');
    if (content.includes('company') || content.includes('business') || content.includes('corporate')) themes.push('Corporate');
    if (content.includes('blog') || content.includes('news') || content.includes('article')) themes.push('Blog/Media');
    if (content.includes('education') || content.includes('course') || content.includes('learning')) themes.push('Education');
    if (content.includes('health') || content.includes('medical') || content.includes('doctor')) themes.push('Healthcare');
    if (content.includes('finance') || content.includes('bank') || content.includes('money')) themes.push('Finance');
    if (content.includes('social') || content.includes('community') || content.includes('network')) themes.push('Social');
    if (content.includes('game') || content.includes('entertainment') || content.includes('fun')) themes.push('Entertainment');
    
    return themes.length > 0 ? themes : ['Corporate'];
  }
}

class ReportGenerator {
  generateAnalysisReport(analysisData) {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalSitesAnalyzed: analysisData.totalSites,
        dominantTheme: this.getDominantTheme(analysisData.themes),
        topTechnology: this.getTopTechnology(analysisData.technologies),
        primaryBusinessModel: this.getPrimaryBusinessModel(analysisData.businessModels)
      },
      detailedAnalysis: analysisData,
      recommendations: this.generateRecommendations(analysisData),
      clientInsights: this.generateClientInsights(analysisData)
    };
  }

  getDominantTheme(themes) {
    return Object.entries(themes).sort(([,a], [,b]) => b.count - a.count)[0][0];
  }

  getTopTechnology(technologies) {
    return Object.entries(technologies).sort(([,a], [,b]) => b.count - a.count)[0][0];
  }

  getPrimaryBusinessModel(models) {
    return Object.entries(models).sort(([,a], [,b]) => b.count - a.count)[0][0];
  }

  generateRecommendations(analysis) {
    return [
      {
        priority: 'High',
        recommendation: 'Focus on E-commerce modernization',
        rationale: `${analysis.themes['E-Commerce'].count} sites analyzed show outdated patterns`,
        opportunity: 'High client demand'
      },
      {
        priority: 'Medium',
        recommendation: 'Develop SaaS dashboard templates',
        rationale: `Growing trend in ${analysis.themes['SaaS'].count} SaaS platforms`,
        opportunity: 'Reusable components'
      }
    ];
  }

  generateClientInsights(analysis) {
    return {
      marketTrends: analysis.inspirationInsights.trendingThemes,
      technologyAdoption: analysis.inspirationInsights.technologyShifts,
      clientOpportunities: analysis.inspirationInsights.clientOpportunities,
      competitiveAdvantages: this.identifyCompetitiveAdvantages(analysis)
    };
  }

  identifyCompetitiveAdvantages(analysis) {
    return [
      'AI-powered design pattern recognition',
      'Real-time trend analysis',
      'Cross-theme inspiration synthesis',
      'Client-specific recommendation engine'
    ];
  }
}

class InspirationEngine {
  generateClientInspiration(analysis, clientProfile) {
    return {
      clientProfile,
      inspiration: {
        designThemes: this.relevantThemes(analysis.themes, clientProfile),
        technologyStack: this.recommendedTech(analysis.technologies, clientProfile),
        uxPatterns: this.uxRecommendations(analysis.userExperience, clientProfile),
        businessModel: this.businessInsights(analysis.businessModels, clientProfile),
        competitiveEdge: this.competitiveAdvantages(analysis, clientProfile)
      },
      renderableAssets: this.generateRenderableAssets(analysis, clientProfile)
    };
  }

  relevantThemes(themes, profile) {
    return Object.entries(themes)
      .filter(([theme]) => profile.interestedThemes.includes(theme))
      .map(([theme, data]) => ({
        theme,
        examples: data.sites.slice(0, 3),
        characteristics: data.characteristics
      }));
  }

  recommendedTech(technologies, profile) {
    return Object.entries(technologies)
      .filter(([tech]) => profile.techStack.includes(tech) || tech === 'Custom')
      .map(([tech, data]) => ({
        technology: tech,
        adoptionRate: data.count,
        recommendation: this.getTechRecommendation(tech, profile)
      }));
  }

  uxRecommendations(uxPatterns, profile) {
    return {
      navigation: uxPatterns['Navigation-types'],
      layouts: ['Hero-section', 'Feature-grids'],
      interactions: ['Micro-animations', 'Responsive design'],
      accessibility: 'WCAG 2.1 AA compliance'
    };
  }

  businessInsights(businessModels, profile) {
    const topModel = Object.entries(businessModels)
      .sort(([,a], [,b]) => b.count - a.count)[0];
    
    return {
      recommendedModel: topModel[0],
      marketValidation: topModel[1],
      revenueStreams: this.suggestRevenueStreams(profile.industry),
      competitivePricing: this.analyzePricing(topModel[0])
    };
  }

  competitiveAdvantages(analysis, profile) {
    return [
      'AI-driven personalization',
      'Real-time performance optimization',
      'Predictive user behavior analysis',
      'Automated A/B testing integration'
    ];
  }

  generateRenderableAssets(analysis, clientProfile) {
    return {
      websiteTemplates: this.generateWebsiteTemplates(analysis, clientProfile),
      mobileAppDesigns: this.generateMobileDesigns(analysis, clientProfile),
      componentLibrary: this.generateComponents(analysis, clientProfile),
      styleGuides: this.generateStyleGuides(analysis, clientProfile)
    };
  }

  generateWebsiteTemplates(analysis, clientProfile) {
    return [
      {
        name: `${clientProfile.industry} Modern Template`,
        theme: this.getDominantTheme(analysis.themes),
        features: ['Responsive design', 'SEO optimized', 'Performance optimized'],
        techStack: ['React', 'Tailwind CSS'],
        deliveryTime: '2-3 weeks'
      }
    ];
  }

  generateMobileDesigns(analysis, clientProfile) {
    return [
      {
        platform: 'iOS/Android',
        designPattern: 'Mobile-first',
        keyFeatures: ['Native performance', 'Offline support', 'Push notifications'],
        estimatedTimeline: '4-6 weeks'
      }
    ];
  }

  generateComponents(analysis, clientProfile) {
    return [
      'Navigation components',
      'Hero sections',
      'Pricing tables',
      'Contact forms',
      'Testimonial carousels'
    ];
  }

  generateStyleGuides(analysis, clientProfile) {
    return {
      colorPalette: this.generateColorPalette(clientProfile),
      typography: this.selectTypography(clientProfile),
      spacing: this.defineSpacingSystem(),
      components: this.defineComponentStyles()
    };
  }

  // Helper methods
  getTechRecommendation(tech, profile) {
    const recommendations = {
      'React': 'Excellent for dynamic, scalable applications',
      'Vue': 'Great for rapid prototyping and smaller projects',
      'WordPress': 'Ideal for content-heavy sites with frequent updates',
      'Custom': 'Maximum flexibility for unique requirements'
    };
    return recommendations[tech] || 'Consider based on project needs';
  }

  suggestRevenueStreams(industry) {
    const streams = {
      'E-Commerce': ['Product sales', 'Subscription boxes', 'Marketplace fees'],
      'SaaS': ['Monthly subscriptions', 'Tiered pricing', 'Usage-based billing'],
      'Education': ['Course fees', 'Premium content', 'Certification programs']
    };
    return streams[industry] || ['Service fees', 'Premium features', 'Partnership revenue'];
  }

  analyzePricing(model) {
    const pricing = {
      'B2C': '$50-200 for basic sites, $500-2000 for e-commerce',
      'B2B': '$5,000-50,000 for enterprise solutions',
      'SaaS': '$29-299/month subscription tiers',
      'Subscription': '$9-99/month for access'
    };
    return pricing[model] || 'Custom pricing based on requirements';
  }

  getDominantTheme(themes) {
    return Object.entries(themes).sort(([,a], [,b]) => b.count - a.count)[0][0];
  }

  generateColorPalette(profile) {
    return {
      primary: '#1976d2',
      secondary: '#dc004e',
      accent: '#ffab00',
      neutral: '#757575'
    };
  }

  selectTypography(profile) {
    return {
      headings: 'Inter, sans-serif',
      body: 'Open Sans, sans-serif',
      code: 'Fira Code, monospace'
    };
  }

  defineSpacingSystem() {
    return {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    };
  }

  defineComponentStyles() {
    return {
      buttons: 'Rounded corners, subtle shadows, hover states',
      cards: 'Clean borders, subtle gradients, consistent padding',
      forms: 'Clear labels, validation states, accessible design'
    };
  }
}

module.exports = {
  DataAnalysisEngine,
  ThemeClassifier,
  ReportGenerator,
  InspirationEngine
};
