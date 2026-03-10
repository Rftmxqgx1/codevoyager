//
//  API Integration Service
//  CodeVoyager Project
//
//  Integrates scraper, processor, and monitoring with React frontend
//

const WebScraper = require('./scraper');
const DataProcessor = require('./processor');
const MonitoringService = require('./monitoring');

class ApiService {
  constructor() {
    this.scraper = new WebScraper();
    this.processor = new DataProcessor();
    this.monitoring = new MonitoringService();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Initialize monitoring
    this.monitoring.recordPerformanceMetric('renderSpeed', 1200);
    this.monitoring.recordPerformanceMetric('memoryUsage', 120);
    this.monitoring.recordPerformanceMetric('cpuUsage', 65);
    this.monitoring.recordPerformanceMetric('errorRate', 1.2);
    
    this.isInitialized = true;
  }

  async getDashboardData() {
    await this.initialize();
    
    try {
      // Run a sample scrape
      const sampleResults = await this.performSampleScraping();
      
      // Process the data
      const processedData = this.processor.processScrapingData(sampleResults);
      
      // Get monitoring metrics
      const monitoringReport = this.monitoring.generateMonitoringReport();
      
      // Get financial impact
      const financialMetrics = this.processor.calculateFinancialImpact();
      
      return {
        timestamp: new Date().toISOString(),
        scraping: {
          totalScraped: sampleResults.length,
          successRate: this.scraper.successRate,
          errorRate: this.scraper.errorRate,
          autoScalingTriggered: this.scraper.autoScalingTrigger
        },
        processing: {
          totalProcessed: processedData.length,
          qualityDistribution: this.processor.getQualityDistribution(),
          totalBusinessValue: processedData.reduce((sum, item) => sum + item.businessValue, 0)
        },
        monitoring: monitoringReport,
        financial: financialMetrics,
        recentActivity: this.getRecentActivity(sampleResults)
      };
      
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return this.getFallbackData();
    }
  }

  async performSampleScraping() {
    // Sample URLs for demonstration
    const sampleUrls = [
      'https://example.com',
      'https://httpbin.org/html',
      'https://jsonplaceholder.typicode.com'
    ];

    const results = [];
    for (const url of sampleUrls) {
      try {
        const result = await this.scraper.scrapeWebsite(url);
        results.push(result);
      } catch (error) {
        // Create a mock result for failed scrapes
        results.push({
          url,
          timestamp: new Date().toISOString(),
          status: 'error',
          data: null,
          error: error.message,
          responseTime: 500
        });
      }
    }

    return results;
  }

  getRecentActivity(scrapingResults) {
    return scrapingResults.slice(-5).map(result => ({
      timestamp: result.timestamp,
      type: result.status === 'success' ? 'scrape_success' : 'scrape_error',
      details: `${result.url} - ${result.status}`,
      value: result.status === 'success' ? 10 : 0
    }));
  }

  getFallbackData() {
    return {
      timestamp: new Date().toISOString(),
      scraping: {
        totalScraped: 0,
        successRate: 0,
        errorRate: 100,
        autoScalingTriggered: false
      },
      processing: {
        totalProcessed: 0,
        qualityDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
        totalBusinessValue: 0
      },
      monitoring: this.monitoring.generateMonitoringReport(),
      financial: this.processor.calculateFinancialImpact(),
      recentActivity: []
    };
  }

  async triggerScrape(url) {
    await this.initialize();
    
    try {
      const result = await this.scraper.scrapeWebsite(url);
      
      // Log forensic event
      this.monitoring.logForensicEvent(
        'system',
        'manual_scrape_triggered',
        { url, result: result.status, cursorPosition: null }
      );
      
      return result;
    } catch (error) {
      this.monitoring.logForensicEvent(
        'system',
        'scrape_error',
        { url, error: error.message, cursorPosition: null }
      );
      throw error;
    }
  }

  async getSystemMetrics() {
    await this.initialize();
    
    return {
      performance: this.monitoring.performanceMetrics,
      iso25010: this.monitoring.validateISO25010(),
      forensic: {
        totalEvents: this.monitoring.forensicData.length,
        recentEvents: this.monitoring.forensicData.slice(-10)
      }
    };
  }
}

// Export for use in React components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
} else if (typeof window !== 'undefined') {
  window.ApiService = ApiService;
}
