import React from 'react';
import { createRoot } from 'react-dom/client';
import ERPDashboard from '../components/ERPDashboard';
import { TimePeriod } from '../components/TimeFilterControl';

// Initialize dashboard tests
const DashboardTest = () => {
    console.log('[Debug] Starting Dashboard Test Suite');
    
    return (
        <div>
            <h2>Dashboard Test Environment</h2>
            <div id="test-dashboard">
                <ERPDashboard />
            </div>
        </div>
    );
};

// Mount test environment
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<DashboardTest />);
}

// Run validation after component mount
setTimeout(() => {
    const periods = ['day', 'week', 'month', 'year', 'pytd'];
    
    const validateDashboard = async () => {
        console.log('\n=== Testing Period Changes ===');
        
        for (const period of periods) {
            console.log(`\nTesting ${period} period:`);
            
            // Find and click period button
            const periodButton = document.querySelector(`button[data-period='${period}']`) as HTMLButtonElement;
            if (periodButton) {
                periodButton.click();
                
                // Wait for data load
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Validate KPI cards
                const cards = document.querySelectorAll('.bg-white.shadow');
                console.log(`KPI Cards found: ${cards.length}`);
                
                // Validate charts
                const charts = document.querySelectorAll('.recharts-responsive-container');
                console.log(`Charts found: ${charts.length}`);
                
                // Check for errors
                const errors = document.querySelectorAll('.text-red-600');
                if (errors.length > 0) {
                    console.error(`Found ${errors.length} error messages`);
                }
            } else {
                console.error(`Period button for ${period} not found`);
            }
        }
        
        console.log('\n=== Dashboard Validation Complete ===');
    };

    validateDashboard();
}, 2000);