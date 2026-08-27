/* ==========================================================================
   Stackly Home Decor Store - Authentication & Dashboard JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    
    // Initialize AOS (Animate On Scroll) for Auth & Dashboards
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 750,
                easing: 'ease-out-cubic',
                once: true,
                offset: 30,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }
    };
    initAOS();

    // Ensure all active dashboard tab contents (overview cards, charts, lists) are 100% visible at start
    const revealActiveTabContent = () => {
        const activeTabs = document.querySelectorAll('.dashboard-tab-content.active');
        activeTabs.forEach(tab => {
            tab.querySelectorAll('[data-aos]').forEach(el => {
                el.classList.add('aos-animate');
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.visibility = 'visible';
            });
        });
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    };

    revealActiveTabContent();
    setTimeout(revealActiveTabContent, 80);
    setTimeout(revealActiveTabContent, 250);
    window.addEventListener('load', () => {
        initAOS();
        revealActiveTabContent();
    });

    // Store active Chart instances for resizing during tab switches
    const chartInstances = {};

    // --------------------------------------------------------------------------
    // 1. Password Visibility Eye Toggle
    // --------------------------------------------------------------------------
    const passwordToggleBtns = document.querySelectorAll('.btn-password-toggle');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const passwordInput = targetId ? document.getElementById(targetId) : btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');

            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 2. Project Form Validations & Redirection Manager
    // --------------------------------------------------------------------------
    initProjectFormValidations();

    // --------------------------------------------------------------------------
    // 3. Single Page Application (SPA) Content Toggling & Topbar Title Update
    // --------------------------------------------------------------------------
    const navItems = document.querySelectorAll('.dashboard-sidebar .nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.dashboard-tab-content');
    const currentTabTitleEl = document.getElementById('currentTabTitle');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTabId = item.getAttribute('data-tab');

            if (!targetTabId) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            tabContents.forEach(tab => {
                if (tab.id === targetTabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            if (currentTabTitleEl) {
                const itemTextEl = item.querySelector('span');
                if (itemTextEl) {
                    currentTabTitleEl.textContent = itemTextEl.textContent.trim();
                }
            }

            // Scroll dashboard content area to top when switching tabs
            const dashboardMain = document.querySelector('.dashboard-main');
            const dashboardContent = document.querySelector('.dashboard-content');
            if (dashboardMain) dashboardMain.scrollTop = 0;
            if (dashboardContent) dashboardContent.scrollTop = 0;
            window.scrollTo(0, 0);

            const dashboardContainer = document.querySelector('.dashboard-container');
            if (dashboardContainer && window.innerWidth <= 1024) {
                dashboardContainer.classList.remove('mobile-sidebar-active');
                document.body.classList.remove('mobile-sidebar-open');
            }

            // Auto-resize charts and refresh AOS animations when tab is revealed
            setTimeout(() => {
                Object.values(chartInstances).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                        chart.update();
                    }
                });
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 80);
        });
    });

    // --------------------------------------------------------------------------
    // 4. Sidebar & Topbar Drawer Controls & Close X Button
    // --------------------------------------------------------------------------
    const dashboardContainer = document.querySelector('.dashboard-container');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');
    
    if (dashboardContainer) {
        // Ensure sidebar is ALWAYS closed at start in mobile view
        if (window.innerWidth <= 1024) {
            dashboardContainer.classList.remove('mobile-sidebar-active');
            document.body.classList.remove('mobile-sidebar-open');
        }

        // Dynamically create backdrop overlay if not present
        let sidebarOverlay = dashboardContainer.querySelector('.dashboard-sidebar-overlay');
        if (!sidebarOverlay) {
            sidebarOverlay = document.createElement('div');
            sidebarOverlay.className = 'dashboard-sidebar-overlay';
            dashboardContainer.appendChild(sidebarOverlay);
        }

        const closeMobileSidebar = () => {
            dashboardContainer.classList.remove('mobile-sidebar-active');
            document.body.classList.remove('mobile-sidebar-open');
        };

        const openMobileSidebar = () => {
            dashboardContainer.classList.add('mobile-sidebar-active');
            document.body.classList.add('mobile-sidebar-open');
        };

        const toggleMobileSidebar = () => {
            if (dashboardContainer.classList.contains('mobile-sidebar-active')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        };

        sidebarOverlay.addEventListener('click', closeMobileSidebar);

        if (sidebarToggleBtn) {
            sidebarToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.innerWidth <= 1024) {
                    toggleMobileSidebar();
                } else {
                    dashboardContainer.classList.toggle('sidebar-collapsed');
                }
            });
        }

        if (sidebarCloseBtn) {
            sidebarCloseBtn.addEventListener('click', () => {
                closeMobileSidebar();
                dashboardContainer.classList.remove('sidebar-collapsed');
            });
        }
    }

    const bellBtn = document.querySelector('.icon-bell-btn');
    const notifDrawer = document.querySelector('.notifications-drawer');
    const closeDrawerBtn = document.querySelector('.btn-close-drawer');

    if (bellBtn && notifDrawer) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDrawer.classList.toggle('active');
        });
    }

    if (closeDrawerBtn && notifDrawer) {
        closeDrawerBtn.addEventListener('click', () => {
            notifDrawer.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (notifDrawer && notifDrawer.classList.contains('active')) {
            if (!notifDrawer.contains(e.target) && !bellBtn.contains(e.target)) {
                notifDrawer.classList.remove('active');
            }
        }
    });

    // --------------------------------------------------------------------------
    // 5. Chart.js Configurations & Initialization
    // --------------------------------------------------------------------------
    if (typeof Chart !== 'undefined') {
        
        Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
        Chart.defaults.color = '#4b5563';
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.tooltip.borderRadius = 8;
        Chart.defaults.plugins.tooltip.backgroundColor = '#203528';
        Chart.defaults.plugins.legend.labels.padding = 12;
        Chart.defaults.plugins.legend.labels.boxWidth = 10;
        Chart.defaults.plugins.legend.labels.font = { size: 11, weight: '600' };

        // ADMIN DASHBOARD CHARTS
        const adminSalesCtx = document.getElementById('adminSalesChart');
        if (adminSalesCtx) {
            chartInstances.adminSales = new Chart(adminSalesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Revenue 2026 ($)',
                            data: [32000, 41000, 38000, 52000, 61000, 58000, 74000, 89000, 82000, 95000, 110000, 128000],
                            borderColor: '#203528',
                            backgroundColor: 'rgba(32, 53, 40, 0.08)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.35
                        },
                        {
                            label: 'Target Goal ($)',
                            data: [30000, 35000, 40000, 45000, 50000, 55000, 65000, 75000, 80000, 85000, 95000, 105000],
                            borderColor: '#f5b742',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + (v / 1000) + 'k' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminOverviewOrdersCtx = document.getElementById('adminOverviewOrdersChart');
        if (adminOverviewOrdersCtx) {
            chartInstances.adminOverviewOrders = new Chart(adminOverviewOrdersCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Orders Processed',
                        data: [280, 340, 310, 420, 490, 450, 530, 612],
                        backgroundColor: '#f5b742',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminCategoryCtx = document.getElementById('adminCategoryChart');
        if (adminCategoryCtx) {
            chartInstances.adminCategory = new Chart(adminCategoryCtx, {
                type: 'bar',
                data: {
                    labels: ['Furniture', 'Lighting', 'Wall Art', 'Rugs & Textiles', 'Decor Accents'],
                    datasets: [{
                        label: 'Units Sold',
                        data: [420, 380, 290, 510, 640],
                        backgroundColor: ['#203528', '#f5b742', '#3b82f6', '#10b981', '#8b5cf6'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminQuarterlySalesCtx = document.getElementById('adminQuarterlySalesChart');
        if (adminQuarterlySalesCtx) {
            chartInstances.adminQuarterlySales = new Chart(adminQuarterlySalesCtx, {
                type: 'bar',
                data: {
                    labels: ['Q1 2026', 'Q2 2026', 'Q3 2026 (Est.)', 'Q4 2026 (Proj.)'],
                    datasets: [{
                        label: 'Quarterly Revenue ($)',
                        data: [111000, 171000, 245000, 333000],
                        backgroundColor: '#203528',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + (v / 1000) + 'k' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminSalesChannelCtx = document.getElementById('adminSalesChannelChart');
        if (adminSalesChannelCtx) {
            chartInstances.adminSalesChannel = new Chart(adminSalesChannelCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Online Store', 'Mobile App', 'Concierge Styling', 'B2B Trade'],
                    datasets: [{
                        data: [52, 28, 12, 8],
                        backgroundColor: ['#203528', '#f5b742', '#3b82f6', '#10b981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
                    cutout: '65%'
                }
            });
        }

        const adminStockCtx = document.getElementById('adminStockChart');
        if (adminStockCtx) {
            chartInstances.adminStock = new Chart(adminStockCtx, {
                type: 'doughnut',
                data: {
                    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                    datasets: [{
                        data: [68, 22, 10],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
                    cutout: '70%'
                }
            });
        }

        const adminStockTurnoverCtx = document.getElementById('adminStockTurnoverChart');
        if (adminStockTurnoverCtx) {
            chartInstances.adminStockTurnover = new Chart(adminStockTurnoverCtx, {
                type: 'bar',
                data: {
                    labels: ['Furniture', 'Lighting', 'Wall Art', 'Rugs', 'Decor'],
                    datasets: [{
                        label: 'Turnover Rate (x/yr)',
                        data: [4.2, 5.8, 6.1, 7.4, 8.9],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminReturnRateCtx = document.getElementById('adminReturnRateChart');
        if (adminReturnRateCtx) {
            chartInstances.adminReturnRate = new Chart(adminReturnRateCtx, {
                type: 'pie',
                data: {
                    labels: ['Rugs & Textiles (1.2%)', 'Lighting (2.1%)', 'Furniture (3.4%)', 'Decor Accents (0.8%)'],
                    datasets: [{
                        data: [30, 25, 35, 10],
                        backgroundColor: ['#3b82f6', '#f5b742', '#ef4444', '#10b981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
                }
            });
        }

        const adminOrdersCtx = document.getElementById('adminOrdersChart');
        if (adminOrdersCtx) {
            chartInstances.adminOrders = new Chart(adminOrdersCtx, {
                type: 'pie',
                data: {
                    labels: ['Delivered', 'Processing', 'Shipped', 'Cancelled'],
                    datasets: [{
                        data: [55, 25, 15, 5],
                        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
                }
            });
        }

        const adminDispatchVelocityCtx = document.getElementById('adminDispatchVelocityChart');
        if (adminDispatchVelocityCtx) {
            chartInstances.adminDispatchVelocity = new Chart(adminDispatchVelocityCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Orders Dispatched',
                        data: [84, 92, 110, 105, 130, 95, 60],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminCourierPerfCtx = document.getElementById('adminCourierPerfChart');
        if (adminCourierPerfCtx) {
            chartInstances.adminCourierPerf = new Chart(adminCourierPerfCtx, {
                type: 'bar',
                data: {
                    labels: ['FedEx Express', 'DHL Freight', 'UPS Ground', 'USPS Priority'],
                    datasets: [{
                        label: 'On-Time Delivery %',
                        data: [98.5, 96.2, 94.8, 91.5],
                        backgroundColor: ['#10b981', '#3b82f6', '#f5b742', '#8b5cf6'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 80, max: 100, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminCustomerGrowthCtx = document.getElementById('adminCustomerGrowthChart');
        if (adminCustomerGrowthCtx) {
            chartInstances.adminCustomerGrowth = new Chart(adminCustomerGrowthCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Active Customers',
                        data: [8200, 8900, 9500, 10200, 10800, 11400, 12000, 12650],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: false, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminCustomerDemographicsCtx = document.getElementById('adminCustomerDemographicsChart');
        if (adminCustomerDemographicsCtx) {
            chartInstances.adminCustomerDemographics = new Chart(adminCustomerDemographicsCtx, {
                type: 'bar',
                data: {
                    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                    datasets: [{
                        label: 'Percentage (%)',
                        data: [12, 42, 28, 12, 6],
                        backgroundColor: '#203528',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const adminCustomerAcquisitionCtx = document.getElementById('adminCustomerAcquisitionChart');
        if (adminCustomerAcquisitionCtx) {
            chartInstances.adminCustomerAcquisition = new Chart(adminCustomerAcquisitionCtx, {
                type: 'pie',
                data: {
                    labels: ['Organic Search', 'Instagram / Pinterest', 'Referrals', 'Email Promo'],
                    datasets: [{
                        data: [40, 35, 15, 10],
                        backgroundColor: ['#203528', '#f5b742', '#3b82f6', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
                }
            });
        }

        // USER DASHBOARD CHARTS
        const userOverviewTrendCtx = document.getElementById('userOverviewTrendChart');
        if (userOverviewTrendCtx) {
            chartInstances.userOverviewTrend = new Chart(userOverviewTrendCtx, {
                type: 'line',
                data: {
                    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Purchases ($)',
                        data: [180, 320, 240, 580, 410, 890],
                        borderColor: '#203528',
                        backgroundColor: 'rgba(32, 53, 40, 0.08)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.35
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + v } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const userOrderFulfillmentCtx = document.getElementById('userOrderFulfillmentChart');
        if (userOrderFulfillmentCtx) {
            chartInstances.userOrderFulfillment = new Chart(userOrderFulfillmentCtx, {
                type: 'bar',
                data: {
                    labels: ['Processing', 'Packing', 'Transit Time', 'Last Mile'],
                    datasets: [{
                        label: 'Avg Hours',
                        data: [4, 12, 36, 8],
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const userWishlistCategoryCtx = document.getElementById('userWishlistCategoryChart');
        if (userWishlistCategoryCtx) {
            chartInstances.userWishlistCategory = new Chart(userWishlistCategoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Furniture (2)', 'Lighting (1)', 'Wall Art (1)', 'Vases (1)', 'Textiles (3)'],
                    datasets: [{
                        data: [2, 1, 1, 1, 3],
                        backgroundColor: ['#203528', '#f5b742', '#3b82f6', '#10b981', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
                    cutout: '65%'
                }
            });
        }

        const userSpendingCtx = document.getElementById('userSpendingChart');
        if (userSpendingCtx) {
            chartInstances.userSpending = new Chart(userSpendingCtx, {
                type: 'line',
                data: {
                    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Purchases ($)',
                        data: [180, 320, 240, 580, 410, 890],
                        borderColor: '#203528',
                        backgroundColor: 'rgba(245, 183, 66, 0.25)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + v } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const userCategoryCtx = document.getElementById('userCategoryChart');
        if (userCategoryCtx) {
            chartInstances.userCategory = new Chart(userCategoryCtx, {
                type: 'pie',
                data: {
                    labels: ['Furniture', 'Wall Decor', 'Lighting', 'Cushions & Rugs'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: ['#203528', '#f5b742', '#3b82f6', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
                }
            });
        }

        const userSavingsCtx = document.getElementById('userSavingsChart');
        if (userSavingsCtx) {
            chartInstances.userSavings = new Chart(userSavingsCtx, {
                type: 'bar',
                data: {
                    labels: ['Furniture', 'Lighting', 'Rugs', 'Decor'],
                    datasets: [{
                        label: 'Total Saved ($)',
                        data: [120, 45, 65, 30],
                        backgroundColor: '#f5b742',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + v } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const userSecurityScoreCtx = document.getElementById('userSecurityScoreChart');
        if (userSecurityScoreCtx) {
            chartInstances.userSecurityScore = new Chart(userSecurityScoreCtx, {
                type: 'bar',
                data: {
                    labels: ['2FA Auth', 'Password Strength', 'Verified Email', 'Saved Address'],
                    datasets: [{
                        label: 'Security Rating %',
                        data: [100, 95, 100, 90],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 50, max: 100, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }
});

// ==============================================================================
// Global Project Form Validation & 404 Redirection Manager (Auth & Dashboards)
// ==============================================================================
if (typeof initProjectFormValidations === 'undefined') {
    function initProjectFormValidations() {
        const isNameInput = (input) => {
            if (!input) return false;
            const type = (input.type || 'text').toLowerCase();
            if (type !== 'text' && type !== 'search') return false;

            const idStr = (input.id || '').toLowerCase();
            const nameStr = (input.name || '').toLowerCase();
            const placeholderStr = (input.placeholder || '').toLowerCase();
            const labelText = input.labels ? Array.from(input.labels).map(l => l.textContent).join(' ').toLowerCase() : '';

            if (idStr.includes('email') || nameStr.includes('email') || placeholderStr.includes('email') || labelText.includes('email')) return false;
            if (idStr.includes('pass') || nameStr.includes('pass') || placeholderStr.includes('pass') || labelText.includes('password')) return false;
            if (idStr.includes('phone') || nameStr.includes('phone') || placeholderStr.includes('phone') || labelText.includes('phone')) return false;

            return idStr.includes('name') || nameStr.includes('fullname') || nameStr.includes('firstname') || nameStr.includes('lastname') || labelText.includes('name');
        };

        const isPhoneInput = (input) => {
            if (!input) return false;
            const type = (input.type || '').toLowerCase();
            if (type === 'tel') return true;
            if (type !== 'text' && type !== 'number' && type !== 'search') return false;

            const idStr = (input.id || '').toLowerCase();
            const nameStr = (input.name || '').toLowerCase();
            const placeholderStr = (input.placeholder || '').toLowerCase();
            const labelText = input.labels ? Array.from(input.labels).map(l => l.textContent).join(' ').toLowerCase() : '';

            return idStr.includes('phone') || idStr.includes('mobile') ||
                   nameStr.includes('phone') || nameStr.includes('mobile') ||
                   placeholderStr.includes('phone') || placeholderStr.includes('mobile') ||
                   labelText.includes('phone') || labelText.includes('mobile');
        };

        const isEmailInput = (input) => {
            if (!input) return false;
            const type = (input.type || '').toLowerCase();
            if (type === 'email') return true;

            const idStr = (input.id || '').toLowerCase();
            const nameStr = (input.name || '').toLowerCase();
            const placeholderStr = (input.placeholder || '').toLowerCase();

            return idStr.includes('email') || nameStr.includes('email') || placeholderStr.includes('email');
        };

        // Block native browser validation popup tooltips globally
        document.addEventListener('invalid', (e) => {
            e.preventDefault();
        }, true);

        const clearInlineError = (input) => {
            if (!input) return;
            input.classList.remove('input-error', 'is-invalid');
            const container = input.closest('.form-group') || input.closest('.input-icon-wrapper') || input.parentElement;
            if (container) {
                const existingError = container.querySelector('.inline-error-msg');
                if (existingError) existingError.remove();
            }
        };

        const showInlineError = (input, message) => {
            if (!input || !message) return;
            clearInlineError(input);
            input.classList.add('input-error', 'is-invalid');
            
            const errorEl = document.createElement('span');
            errorEl.className = 'inline-error-msg';
            errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
            
            const nForm = input.closest('.newsletter-form');
            if (nForm) {
                let nWrapper = input.closest('.newsletter-input-wrapper');
                if (!nWrapper) {
                    nWrapper = document.createElement('div');
                    nWrapper.className = 'newsletter-input-wrapper';
                    input.parentNode.insertBefore(nWrapper, input);
                    nWrapper.appendChild(input);
                }
                nWrapper.appendChild(errorEl);
            } else {
                const container = input.closest('.form-group') || input.closest('.input-icon-wrapper') || input.parentElement;
                if (container) {
                    container.appendChild(errorEl);
                } else {
                    input.insertAdjacentElement('afterend', errorEl);
                }
            }
        };

        // Real-time input clearing for all form inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            ['input', 'change', 'blur'].forEach(evt => {
                input.addEventListener(evt, () => {
                    const val = input.value ? input.value.trim() : '';
                    if (val) {
                        clearInlineError(input);
                    }
                });
            });
        });

        // Sync logged in email & role to profile display places
        syncUserProfileData();

        // Handle Form Submissions with Script-Based Inline Validation
        document.querySelectorAll('form').forEach(form => {
            // Disable native browser required tooltip popups
            form.setAttribute('novalidate', 'true');

            form.addEventListener('submit', (e) => {
                let isValid = true;
                let firstInvalidInput = null;

                // Clear prior inline errors in this form
                form.querySelectorAll('input, select, textarea').forEach(input => clearInlineError(input));

                const inputs = form.querySelectorAll('input, select, textarea');

                inputs.forEach(input => {
                    let errorMsg = '';
                    const val = input.value ? input.value.trim() : '';
                    const isRequired = input.hasAttribute('required') || input.required;
                    let fieldName = 'field';
                    if (input.labels && input.labels.length > 0) {
                        fieldName = input.labels[0].textContent.replace('*', '').trim().toLowerCase();
                    } else if (input.placeholder) {
                        fieldName = input.placeholder.trim().toLowerCase();
                    } else if (input.name) {
                        fieldName = input.name.trim().toLowerCase();
                    } else if (input.id) {
                        fieldName = input.id.trim().toLowerCase();
                    }

                    fieldName = fieldName
                        .replace(/^(enter|type|input|write|select)\s+/i, '')
                        .replace(/^(your|a|an|the)\s+/i, '')
                        .replace(/^(enter|type|input|write|select)\s+/i, '')
                        .replace(/^(your|a|an|the)\s+/i, '')
                        .trim();

                    if (isRequired && !val) {
                        if (input.type === 'checkbox') {
                            if (!input.checked) errorMsg = 'You must accept this to proceed.';
                        } else if (input.type === 'radio') {
                            const checkedRadio = form.querySelector(`input[name="${input.name}"]:checked`);
                            if (!checkedRadio) errorMsg = 'Please make a selection.';
                        } else {
                            errorMsg = `Please enter your ${fieldName || 'information'}.`;
                        }
                    } else if (val) {
                        if (isNameInput(input)) {
                            if (!/^[a-zA-Z\s]+$/.test(val)) {
                                errorMsg = 'Please enter alphabets only.';
                            }
                        } else if (isPhoneInput(input)) {
                            if (!/^[0-9]+$/.test(val)) {
                                errorMsg = 'Please enter numbers only.';
                            }
                        } else if (isEmailInput(input)) {
                            const isEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(val);
                            if (!isEmailPattern) {
                                errorMsg = 'Please enter a valid email address.';
                            }
                        } else if (input.id === 'confirmPassword') {
                            const pwdEl = document.getElementById('signupPassword') || form.querySelector('input[type="password"]');
                            if (pwdEl && val !== pwdEl.value) {
                                errorMsg = 'Passwords do not match.';
                            }
                        }
                    }

                    if (errorMsg) {
                        isValid = false;
                        showInlineError(input, errorMsg);
                        if (!firstInvalidInput) firstInvalidInput = input;
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (firstInvalidInput) firstInvalidInput.focus();
                    return false;
                }

                // Follow original redirection & button navigation logic
                const formId = form.id;
                const pathname = window.location.pathname.toLowerCase();
                const isLoginPage = formId === 'loginForm' || pathname.endsWith('login.html');
                const isSignupPage = formId === 'signupForm' || pathname.endsWith('signup.html');

                if (isLoginPage) {
                    e.preventDefault();
                    const emailInput = document.getElementById('loginEmail') || form.querySelector('input[type="email"]');
                    const selectedRoleInput = document.querySelector('input[name="userRole"]:checked');
                    const userEmail = emailInput ? emailInput.value.trim() : '';
                    const selectedRole = selectedRoleInput ? selectedRoleInput.value : 'user';

                    if (userEmail) {
                        localStorage.setItem('currentUserEmail', userEmail);
                        localStorage.setItem('currentUserRole', selectedRole);
                    }

                    if (selectedRole === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                } else if (isSignupPage) {
                    e.preventDefault();
                    window.location.href = 'login.html';
                } else {
                    // ALL OTHER FORMS on home, about, services, products, blog, contact, user-dashboard, admin-dashboard -> redirect to 404.html
                    e.preventDefault();
                    window.location.href = '404.html';
                }
            });
        });

        // Ensure login email input is empty on login page load
        const loginEmailEl = document.getElementById('loginEmail');
        if (loginEmailEl) {
            loginEmailEl.value = '';
        }
    }
}

if (typeof syncUserProfileData === 'undefined') {
    function syncUserProfileData() {
        const savedEmail = localStorage.getItem('currentUserEmail');
        const savedRole = localStorage.getItem('currentUserRole') || 'user';

        if (!savedEmail) return;

        const roleLabel = savedRole === 'admin' ? 'Administrator' : 'Customer Account';

        const sidebarEmailEl = document.querySelector('.sidebar-user-email');
        const sidebarNameEl = document.querySelector('.sidebar-user-name');
        if (sidebarEmailEl) sidebarEmailEl.textContent = savedEmail;
        if (sidebarNameEl) sidebarNameEl.textContent = roleLabel;

        const topbarEmailEl = document.querySelector('.topbar-user-text .email');
        const topbarNameEl = document.querySelector('.topbar-user-text .name');
        if (topbarEmailEl) topbarEmailEl.textContent = savedEmail;
        if (topbarNameEl) topbarNameEl.textContent = savedRole === 'admin' ? 'Admin Console' : 'Customer';

        const profileEmailInput = document.getElementById('profileEmail');
        if (profileEmailInput && savedEmail) {
            profileEmailInput.value = savedEmail;
        }
    }
}
