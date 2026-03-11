//
//  Web Scraper Module
//  CodeVoyager Project
//
//  Features: Data collection, monitoring, and intelligence gathering
//  Metrics: Auto-scaling triggers (RES-001), Error rate monitoring (MET-006)
//

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class WebScraper {
  constructor() {
    this.scrapingResults = [];
    this.errorRate = 0;
    this.successRate = 0;
    this.autoScalingTrigger = false;
  }

  // RES-001: Auto-scaling trigger based on load
  checkAutoScaling() {
    const currentLoad = this.scrapingResults.length;
    const threshold = 1000; // Auto-scale when we have 1000+ results
    
    if (currentLoad > threshold && !this.autoScalingTrigger) {
      this.autoScalingTrigger = true;
      this.logEvent('RES-001', 'Auto-Scaling Triggered', `Current load: ${currentLoad} > Threshold: ${threshold}`);
      return true;
    }
    
    return false;
  }

  // MET-006: Error rate monitoring (target: 1.2%)
  calculateErrorRate() {
    const totalAttempts = this.scrapingResults.length;
    const errors = this.scrapingResults.filter(r => r.status === 'error').length;
    
    if (totalAttempts > 0) {
      this.errorRate = (errors / totalAttempts) * 100;
      this.successRate = 100 - this.errorRate;
      
      if (this.errorRate > 1.2) {
        this.logEvent('MET-006', 'Error Rate Exceeded', `Current: ${this.errorRate.toFixed(2)}% > Target: 1.2%`);
      }
      
      return this.errorRate;
    }
    
    return 0;
  }

  async scrapeWebsite(url, options = {}) {
    const startTime = Date.now();
    const result = {
      url,
      timestamp: new Date().toISOString(),
      status: 'pending',
      data: null,
      error: null,
      responseTime: 0
    };

    try {
      const response = await axios.get(url, {
        timeout: options.timeout || 10000,
        headers: {
          'User-Agent': 'CodeVoyager-Scraper/1.0'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract basic metadata
      result.data = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        headings: this.extractHeadings($),
        links: this.extractLinks($, url),
        images: this.extractImages($, url)
      };
      
      result.status = 'success';
      result.responseTime = Date.now() - startTime;
      
    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      result.responseTime = Date.now() - startTime;
    }

    this.scrapingResults.push(result);
    this.calculateErrorRate();
    this.checkAutoScaling();
    
    return result;
  }

  extractHeadings($) {
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, element) => {
      headings.push({
        level: element.tagName.toLowerCase(),
        text: $(element).text().trim()
      });
    });
    return headings;
  }

  extractLinks($, baseUrl) {
    const links = [];
    $('a[href]').each((i, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      if (href && text) {
        links.push({ href, text });
      }
    });
    return links;
  }

  extractImages($, baseUrl) {
    const images = [];
    $('img[src]').each((i, element) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });
    return images;
  }

  logEvent(specId, event, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      specId,
      event,
      details
    };

    // Log to monitoring file
    const logPath = path.join(__dirname, '..', '..', 'logs', 'post_deployment_monitoring_log.csv');
    const csvLine = `${logEntry.timestamp},${specId},${event},"${details}"\n`;
    
    try {
      fs.appendFileSync(logPath, csvLine);
    } catch (error) {
      console.error('Failed to write to log:', error);
    }

    console.log(`[${specId}] ${event}: ${details}`);
  }

  getMetrics() {
    return {
      totalScrapes: this.scrapingResults.length,
      successRate: this.successRate.toFixed(2),
      errorRate: this.errorRate.toFixed(2),
      autoScalingTriggered: this.autoScalingTrigger,
      averageResponseTime: this.calculateAverageResponseTime()
    };
  }

  calculateAverageResponseTime() {
    if (this.scrapingResults.length === 0) return 0;
    
    const totalTime = this.scrapingResults.reduce((sum, result) => sum + result.responseTime, 0);
    return (totalTime / this.scrapingResults.length).toFixed(2);
  }

  exportResults(filePath) {
    const data = {
      metadata: this.getMetrics(),
      results: this.scrapingResults,
      exportedAt: new Date().toISOString()
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Failed to export results:', error);
      return false;
    }
  }
}

module.exports = WebScraper;
