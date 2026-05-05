import { supabase } from './supabase.js'

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
    document.getElementById('service-icon').innerHTML = `<i class="${data.icon_class}"></i>`;
    document.getElementById('service-short-desc').textContent = data.description;
    document.getElementById('service-full-desc').textContent = data.full_description || 'No detailed description available yet.';

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
