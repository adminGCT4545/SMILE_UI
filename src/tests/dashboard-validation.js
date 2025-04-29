// Dashboard validation script
console.log('Starting Dashboard Validation...');

// Test time periods
const periods = ['day', 'week', 'month', 'year', 'pytd'];

async function validateDashboard() {
    try {
        console.log('\n=== Testing Period Changes ===');
        for (const period of periods) {
            console.log(`\nTesting ${period} period:`);
            // Simulate period change
            document.querySelector(`button[key="${period}"]`)?.click();
            
            // Wait for data load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check KPI cards
            console.log('Checking KPI cards...');
            const cards = document.querySelectorAll('.bg-white.shadow');
            console.log(`Found ${cards.length} KPI cards`);
            
            // Check charts
            console.log('Checking charts...');
            const charts = document.querySelectorAll('.recharts-responsive-container');
            console.log(`Found ${charts.length} charts`);
        }
        
        console.log('\n=== Dashboard Validation Complete ===');
        
    } catch (error) {
        console.error('Validation failed:', error);
    }
}

// Run validation
validateDashboard();