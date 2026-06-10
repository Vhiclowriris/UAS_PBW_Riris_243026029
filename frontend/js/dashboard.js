// frontend/js/dashboard.js

// Chart instances
let charts = {
  topProducts: null,
  revenuePerCity: null,
  monthlySales: null
};

// Initialize Dashboard
async function initDashboard() {
  // Check authentication using Auth module
  if (!Auth.requireAuth()) return;
  
  // Update user info in navbar
  updateUserDisplay();
  
  // Set default date range
  setDefaultDates();
  
  // Load and render dashboard data
  await loadDashboardData();
  
  // Setup event listeners
  setupEventListeners();
}

// Update user display in navbar
function updateUserDisplay() {
  const user = Auth.getUser();
  const userRoleEl = document.getElementById('userRole');
  if (userRoleEl && user) {
    userRoleEl.textContent = `${user.username} (${user.role})`;
  }
}

// Set default date range (last 3 months)
function setDefaultDates() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  
  if (startDateInput) {
    startDateInput.value = startDate.toISOString().split('T')[0];
  }
  if (endDateInput) {
    endDateInput.value = endDate.toISOString().split('T')[0];
  }
}

// Load dashboard data from API
async function loadDashboardData(startDate = null, endDate = null) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) errorDiv.style.display = 'none';
  
  try {
    const response = await API.getDashboardStats(startDate, endDate);
    renderDashboard(response.data);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showError('Gagal memuat data: ' + error.message);
  }
}

// Render all dashboard components
function renderDashboard(data) {
  // Update summary cards
  updateSummaryCards(data.summary);
  
  // Render charts
  renderTopProductsChart(data.topProducts);
  renderRevenuePerCityChart(data.revenuePerCity);
  renderMonthlySalesChart(data.salesByMonth);
}

// Update summary cards with data
function updateSummaryCards(summary) {
  const revenueEl = document.getElementById('totalRevenue');
  const transactionsEl = document.getElementById('totalTransactions');
  const outletsEl = document.getElementById('totalOutlets');
  
  if (revenueEl && summary.totalRevenue !== undefined) {
    revenueEl.textContent = `Rp ${Number(summary.totalRevenue).toLocaleString('id-ID')}`;
  }
  if (transactionsEl && summary.totalTransactions !== undefined) {
    transactionsEl.textContent = summary.totalTransactions;
  }
  if (outletsEl) {
    // Count unique cities from revenuePerCity data
    outletsEl.textContent = document.getElementById('revenuePerCityChart') ? 
      (charts.revenuePerCity?.data?.labels?.length || 0) : 0;
  }
}

// Render Top Products Chart (Bar Chart)
function renderTopProductsChart(products) {
  const ctx = document.getElementById('topProductsChart');
  if (!ctx) return;
  
  // Destroy existing chart if any
  if (charts.topProducts) {
    charts.topProducts.destroy();
  }
  
  // Don't render if no data
  if (!products || products.length === 0) {
    ctx.getContext('2d').font = '14px sans-serif';
    ctx.getContext('2d').fillText('Tidak ada data', 150, 150);
    return;
  }
  
  charts.topProducts = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: products.map(p => p.nama_produk),
      datasets: [{
        label: 'Jumlah Terjual',
        data: products.map(p => p.total_sold),
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: value => value + ' unit' }
        }
      }
    }
  });
}

// Render Revenue per City Chart (Pie Chart)
function renderRevenuePerCityChart(cities) {
  const ctx = document.getElementById('revenuePerCityChart');
  if (!ctx) return;
  
  if (charts.revenuePerCity) {
    charts.revenuePerCity.destroy();
  }
  
  if (!cities || cities.length === 0) {
    ctx.getContext('2d').font = '14px sans-serif';
    ctx.getContext('2d').fillText('Tidak ada data', 120, 150);
    return;
  }
  
  charts.revenuePerCity = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: cities.map(c => c.kota),
      datasets: [{
        data: cities.map(c => c.revenue),
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: context => {
              const label = context.label || '';
              const value = 'Rp ' + Number(context.parsed).toLocaleString('id-ID');
              return `${label}: ${value}`;
            }
          }
        }
      }
    }
  });
}

// Render Monthly Sales Chart (Line Chart)
function renderMonthlySalesChart(sales) {
  const ctx = document.getElementById('monthlySalesChart');
  if (!ctx) return;
  
  if (charts.monthlySales) {
    charts.monthlySales.destroy();
  }
  
  if (!sales || sales.length === 0) {
    ctx.getContext('2d').font = '14px sans-serif';
    ctx.getContext('2d').fillText('Tidak ada data', 200, 150);
    return;
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const labels = sales.map(s => {
    const [year, month] = s.month.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  });
  
  charts.monthlySales = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue Bulanan',
        data: sales.map(s => s.revenue),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: {
            label: context => 'Rp ' + Number(context.parsed.y).toLocaleString('id-ID')
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: value => 'Rp ' + (value / 1000) + 'k' }
        }
      }
    }
  });
}

// Setup event listeners for buttons
function setupEventListeners() {
  // Filter button
  const filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', applyFilter);
  }
  
  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => Auth.logout());
  }
}

// Export data to CSV (menggunakan Fetch API)
async function exportToCSV() {
  const startDate = document.getElementById('startDate')?.value;
  const endDate = document.getElementById('endDate')?.value;
  
  try {
    // Build URL
    let url = `${API_CONFIG.BASE_URL}/dashboard/export?`;
    if (startDate && endDate) {
      url += `start_date=${startDate}&end_date=${endDate}`;
    }
    
    // Fetch dengan auth header
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Gagal download');
    }
    
    // Get blob data
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `laporan-transaksi-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error('Export error:', error);
    alert('Gagal export data. Silakan coba lagi.');
  }
}

// Helper untuk show alert (tambahkan fungsi ini jika belum ada)
function showAlert(message, type = 'info') {
  // Buat alert div jika belum ada
  let alertDiv = document.getElementById('exportAlert');
  if (!alertDiv) {
    alertDiv = document.createElement('div');
    alertDiv.id = 'exportAlert';
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      z-index: 10000;
      display: none;
    `;
    document.body.appendChild(alertDiv);
  }
  
  alertDiv.textContent = message;
  alertDiv.style.display = 'block';
  
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 3000);
}

// Apply date filter
function applyFilter() {
  const startDate = document.getElementById('startDate')?.value;
  const endDate = document.getElementById('endDate')?.value;
  
  if (!startDate || !endDate) {
    showError('Silakan pilih tanggal mulai dan akhir!');
    return;
  }
  
  if (new Date(startDate) > new Date(endDate)) {
    showError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir!');
    return;
  }
  
  loadDashboardData(startDate, endDate);
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.textContent = 'error' + message;
    errorDiv.style.display = 'block';
    // Auto hide after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);