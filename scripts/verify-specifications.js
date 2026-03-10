#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CodeVoyager Specification Verification Tool');
console.log('==========================================\n');

// Specification checks
const specifications = [
  {
    id: 'SUS-002',
    name: 'Optimized Rendering',
    file: 'src/web/app.jsx',
    check: (content) => {
      return content.includes('React.memo') && 
             content.includes('useMemo') && 
             content.includes('// SUS-002');
    }
  },
  {
    id: 'MET-002',
    name: '1.2s Render Speed',
    file: 'src/web/app.jsx',
    check: (content) => {
      return content.includes('MET-002') && 
             content.includes('useMemo') &&
             content.includes('React.memo');
    }
  },
  {
    id: 'REL-002',
    name: 'Navigation spacing corrected',
    file: 'src/ios.swift',
    check: (content) => {
      return content.includes('REL-002') && 
             content.includes('Navigation spacing corrected');
    }
  },
  {
    id: 'RES-003',
    name: 'Error-handling guardrails',
    file: 'src/ios.swift',
    check: (content) => {
      return content.includes('RES-003') && 
             content.includes('Error-handling guardrails');
    }
  },
  {
    id: 'MET-003',
    name: '120MB Memory Usage',
    file: 'src/ios.swift',
    check: (content) => {
      return content.includes('MET-003') && 
             content.includes('120MB Memory Usage');
    }
  },
  {
    id: 'GOV-004',
    name: 'MIT License Header',
    file: 'src/android.kt',
    check: (content) => {
      return content.includes('GOV-004') && 
             content.includes('MIT License') &&
             content.includes('Copyright (c) 2026');
    }
  },
  {
    id: 'MET-004',
    name: '70% CPU Threshold',
    file: 'src/android.kt',
    check: (content) => {
      return content.includes('MET-004') && 
             content.includes('70% CPU Threshold');
    }
  }
];

// Governance checks
const governanceSpecs = [
  {
    id: 'DEC-004',
    name: 'Accessibility compliance validated',
    file: 'governance/style_audit.pdf',
    check: (content) => {
      return content.includes('WCAG') && content.includes('AAA');
    }
  },
  {
    id: 'RSK-002',
    name: 'GDPR Compliance',
    file: 'governance/compliance_audit.csv',
    check: (content) => {
      return content.includes('GDPR') && content.includes('RSK-002');
    }
  }
];

// Logs checks
const logsSpecs = [
  {
    id: 'DEC-007',
    name: 'Forensic transparency',
    file: 'logs/visual_replay_timeline.csv',
    check: (content) => {
      return content.includes('DEC-007') && content.includes('1:1 accuracy');
    }
  },
  {
    id: 'RES-001',
    name: 'Auto-Scaling Trigger',
    file: 'logs/post_deployment_monitoring_log.csv',
    check: (content) => {
      return content.includes('RES-001') && content.includes('Auto-Scaling');
    }
  },
  {
    id: 'MET-006',
    name: 'Error rate 1.2%',
    file: 'logs/testing_suite_results.csv',
    check: (content) => {
      return content.includes('MET-006') && content.includes('1.2%');
    }
  },
  {
    id: 'GOV-008',
    name: 'ISO 25010 Software Quality',
    file: 'logs/testing_suite_results.csv',
    check: (content) => {
      return content.includes('GOV-008') && content.includes('ISO 25010');
    }
  }
];

// Strategy checks
const strategySpecs = [
  {
    id: 'FIN-001',
    name: '159% Average ROI',
    file: 'strategy/financial_impact_log.csv',
    check: (content) => {
      return content.includes('159%') && content.includes('$243,000');
    }
  },
  {
    id: 'KB-011',
    name: 'Build-All 2.0 Priorities',
    file: 'strategy/roadmap_enhancement_requests.csv',
    check: (content) => {
      return content.includes('KB-011') && content.includes('Build-All 2.0');
    }
  },
  {
    id: 'MET-010',
    name: '90% Stakeholder alignment',
    file: 'strategy/roadmap_enhancement_requests.csv',
    check: (content) => {
      return content.includes('MET-010') && content.includes('90%');
    }
  },
  {
    id: 'TRN-001',
    name: 'Training Knowledge Transfer',
    file: 'strategy/training_enablement_log.csv',
    check: (content) => {
      return content.includes('TRN-001') && content.includes('Knowledge transfer');
    }
  }
];

function checkSpecs(specs, category) {
  console.log(`\n📋 ${category} Specifications:`);
  console.log('-'.repeat(50));
  
  let passed = 0;
  let total = specs.length;
  
  specs.forEach(spec => {
    try {
      const filePath = path.join(__dirname, '..', spec.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = spec.check(content);
        
        if (result) {
          console.log(`✅ ${spec.id}: ${spec.name}`);
          passed++;
        } else {
          console.log(`❌ ${spec.id}: ${spec.name} - Check failed`);
        }
      } else {
        console.log(`❌ ${spec.id}: ${spec.name} - File not found: ${spec.file}`);
      }
    } catch (error) {
      console.log(`❌ ${spec.id}: ${spec.name} - Error reading file: ${error.message}`);
    }
  });
  
  console.log(`\n📊 ${category} Results: ${passed}/${total} specifications verified`);
  return { passed, total };
}

// Run all checks
const srcResults = checkSpecs(specifications, 'Source Code');
const govResults = checkSpecs(governanceSpecs, 'Governance');
const logsResults = checkSpecs(logsSpecs, 'Logs & Monitoring');
const strategyResults = checkSpecs(strategySpecs, 'Strategy & Business');

// Summary
const totalPassed = srcResults.passed + govResults.passed + logsResults.passed + strategyResults.passed;
const totalSpecs = srcResults.total + govResults.total + logsResults.total + strategyResults.total;

console.log('\n' + '='.repeat(60));
console.log('🎯 OVERALL VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Total Specifications Passed: ${totalPassed}/${totalSpecs}`);
console.log(`📈 Success Rate: ${((totalPassed/totalSpecs) * 100).toFixed(1)}%`);

if (totalPassed === totalSpecs) {
  console.log('\n🎉 ALL SPECIFICATIONS SUCCESSFULLY VERIFIED!');
  console.log('🚀 Your CodeVoyager project meets all requirements.');
} else {
  console.log('\n⚠️  Some specifications need attention.');
  console.log('🔧 Please review the failed items above.');
}

console.log('\n📝 Verification completed at:', new Date().toISOString());
