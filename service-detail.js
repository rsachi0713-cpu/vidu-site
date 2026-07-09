import { supabase } from './supabase.js'

function formatServiceDetails(text) {
  if (!text) return 'No detailed description available yet.';

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentSection = 'default'; // 'default', 'rate_card', 'terms'
  let introLines = [];
  let rateCardItems = [];
  let termsItems = [];

  for (let line of lines) {
    const upperLine = line.toUpperCase();
    
    // Check for section headers
    if (upperLine.startsWith('RATE CARD')) {
      currentSection = 'rate_card';
      continue;
    } else if (upperLine.startsWith('TERMS & CONDITIONS') || upperLine.startsWith('TERMS AND CONDITIONS')) {
      currentSection = 'terms';
      continue;
    }

    // Parse based on content type
    // 1. Numbered item (Terms)
    const numberRegex = /^(\d+)\.\s*(.*)/;
    const numberMatch = line.match(numberRegex);
    
    if (numberMatch) {
      termsItems.push({
        num: numberMatch[1],
        text: numberMatch[2].trim()
      });
      continue;
    }

    // 2. Pricing item (contains Rs. or Rs)
    const priceIndex = line.search(/Rs\.?/i);
    if (priceIndex !== -1) {
      const price = line.substring(priceIndex).trim();
      let service = line.substring(0, priceIndex).trim();
      
      // Clean up trailing hyphens, colons, or dashes from the service name
      service = service.replace(/[-\s:]+$/, '').trim();
      
      rateCardItems.push({ service, price });
      continue;
    }

    // 3. General text
    if (currentSection === 'terms') {
      termsItems.push({ num: '', text: line });
    } else if (currentSection === 'rate_card') {
      if (upperLine.includes('SERVICE') && upperLine.includes('PRICE')) {
        continue; // Skip header labels
      }
      rateCardItems.push({ service: line, price: '' });
    } else {
      introLines.push(line);
    }
  }

  let html = '';

  // Generate Intro
  if (introLines.length > 0) {
    html += `<div class="detail-intro-desc" style="margin-bottom: 30px; font-size: 16px; color: var(--text-secondary);">${introLines.join('<br>')}</div>`;
  }

  // Generate Rate Card Table
  if (rateCardItems.length > 0) {
    html += `
      <div class="rate-card-section">
        <div class="section-title-wrapper">
          <i class="fas fa-file-invoice-dollar section-icon"></i>
          <h2 class="section-title">Rate Card</h2>
        </div>
        <div class="rate-card-table">
          <div class="rate-card-header">
            <div>Service</div>
            <div style="text-align: right;">Price</div>
          </div>
          <div class="rate-card-rows">
    `;

    rateCardItems.forEach(item => {
      let iconHtml = '';
      const nameUpper = item.service.toUpperCase();
      if (nameUpper.includes('YOUTUBE')) {
        iconHtml = '<i class="fab fa-youtube row-brand-icon" style="color: #ff0000; margin-right: 12px;"></i>';
      } else if (nameUpper.includes('FACEBOOK')) {
        iconHtml = '<i class="fab fa-facebook row-brand-icon" style="color: #1877F2; margin-right: 12px;"></i>';
      } else if (nameUpper.includes('TIKTOK')) {
        iconHtml = '<i class="fab fa-tiktok row-brand-icon" style="color: #ffffff; margin-right: 12px;"></i>';
      } else if (nameUpper.includes('CONCERT')) {
        iconHtml = '<i class="fas fa-guitar row-brand-icon" style="color: #ff0055; margin-right: 12px;"></i>';
      } else if (nameUpper.includes('HOST')) {
        iconHtml = '<i class="fas fa-microphone row-brand-icon" style="color: #ffbb00; margin-right: 12px;"></i>';
      } else {
        iconHtml = '<i class="fas fa-briefcase row-brand-icon" style="color: var(--primary-color); margin-right: 12px; font-size: 14px;"></i>';
      }

      if (!item.price) {
        html += `
          <div class="rate-card-row rate-card-divider" style="grid-template-columns: 1fr;">
            <div style="font-weight: 600; color: var(--primary-color); padding: 10px 0 5px;">${item.service}</div>
          </div>
        `;
      } else {
        html += `
          <div class="rate-card-row">
            <div class="service-name">${iconHtml}<span>${item.service}</span></div>
            <div class="price-val">${item.price}</div>
          </div>
        `;
      }
    });

    html += `
          </div>
        </div>
      </div>
    `;
  }

  // Generate Terms & Conditions
  if (termsItems.length > 0) {
    html += `
      <div class="terms-section" style="margin-top: 50px; width: 100%;">
        <div class="section-title-wrapper">
          <i class="fas fa-file-contract section-icon"></i>
          <h2 class="section-title">Terms & Conditions</h2>
        </div>
        <div class="terms-list">
    `;

    termsItems.forEach(item => {
      if (item.num) {
        html += `
          <div class="term-item">
            <div class="term-num">${item.num}</div>
            <div class="term-text">${item.text}</div>
          </div>
        `;
      } else {
        html += `
          <div class="term-item term-raw">
            <div class="term-text">${item.text}</div>
          </div>
        `;
      }
    });

    html += `
        </div>
      </div>
    `;
  }

  return html;
}


async function loadServiceDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id');

  if (!serviceId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error || !data) throw error || new Error('Service not found');

    document.title = `${data.title} | MR VIDU`;
    document.getElementById('service-title').textContent = data.title;
    document.getElementById('service-short-desc').textContent = data.description;
    
    // Format full details beautifully using our rate card and terms parser
    document.getElementById('service-full-desc').innerHTML = formatServiceDetails(data.full_description);

    // Hide loader
    document.getElementById('service-loader').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('service-loader').style.display = 'none';
    }, 500);

  } catch (err) {
    console.error('Error loading service:', err);
    alert('Error loading service details.');
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', loadServiceDetail);
