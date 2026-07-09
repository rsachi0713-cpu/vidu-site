import { supabase } from './supabase.js'

console.log("Admin.js loaded");

window.loginAdmin = () => {
  const user = document.getElementById('admin-user').value;
  const pass = document.getElementById('admin-pass').value;
  
  if (user === 'vidu2026' && pass === 'vidu2026') {
    document.getElementById('login-page').classList.add('hidden');
    document.querySelector('.dashboard-container').classList.remove('hidden');
    localStorage.setItem('adminLoggedIn', 'true');
    loadAllData();
  } else {
    alert('Invalid Credentials!');
  }
}

function checkLogin() {
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('login-page').classList.add('hidden');
    document.querySelector('.dashboard-container').classList.remove('hidden');
  } else {
    document.getElementById('login-page').classList.remove('hidden');
    document.querySelector('.dashboard-container').classList.add('hidden');
  }
}

window.logoutAdmin = () => {
  localStorage.removeItem('adminLoggedIn');
  checkLogin();
}

window.showTab = (tabId) => {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  // Remove active class from menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  // Show target tab
  document.getElementById(`tab-${tabId}`).classList.remove('hidden');
  // Add active class to clicked menu item
  const activeItem = Array.from(document.querySelectorAll('.menu-item')).find(item => item.textContent.toLowerCase().includes(tabId.toLowerCase()));
  if (activeItem) activeItem.classList.add('active');
}


// --- UTILS ---
function notify(msg) {
  console.log("Notification:", msg);
  const toast = document.createElement('div');
  toast.className = 'toast-notify';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function uploadImage(file, bucket = 'media') {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  console.log(`Uploading image: ${fileName}`);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
    
  if (error) {
    console.error('Upload Error:', error);
    alert('Image Upload Failed: ' + error.message);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
    
  return publicUrl;
}

// --- SAVE FUNCTIONS ---

window.saveChannels = async () => {
  try {
    for (let i = 1; i <= 3; i++) {
      const name = document.getElementById(`ch${i}-name`).value;
      const subs = document.getElementById(`ch${i}-subs`).value;
      const link = document.getElementById(`ch${i}-link`).value;
      
      // Get current data to keep existing logo if not changed
      const { data: current } = await supabase.from('social_links').select('logo_url').eq('id', i).single();
      let logoUrl = current ? current.logo_url : '';
      
      const fileInput = document.getElementById(`ch${i}-file`);
      if (fileInput.files[0]) {
        const uploaded = await uploadImage(fileInput.files[0]);
        if (uploaded) logoUrl = uploaded;
      }

      console.log(`Saving Channel ${i}:`, { name, subs, link, logoUrl });
      const { error } = await supabase.from('social_links').upsert({
        id: i,
        platform_name: 'YouTube',
        display_name: name,
        subscribers_count: subs,
        profile_link: link,
        logo_url: logoUrl
      });
      if (error) throw error;
    }
    notify("YouTube Channels Updated!");
  } catch (err) {
    console.error("Save Channels Error:", err);
    alert("Failed to save channels: " + err.message);
  }
}

window.saveSocials = async () => {
  try {
    const socials = ['fb', 'ig', 'tt', 'tt2'];
    const platforms = { fb: 'Facebook', ig: 'Instagram', tt: 'TikTok', tt2: 'TikTok' };
    
    for (const s of socials) {
      const name = document.getElementById(`${s}-name`).value;
      const subs = document.getElementById(`${s}-subs`).value;
      const link = document.getElementById(`${s}-link`).value;

      const data = {
        id: socials.indexOf(s) + 4,
        platform_name: platforms[s],
        display_name: name,
        subscribers_count: subs,
        profile_link: link
      };
      
      console.log(`Saving ${s}:`, data);
      const { error } = await supabase.from('social_links').upsert(data);
      if (error) throw error;
    }
    notify("Social Networks Updated!");
  } catch (err) {
    console.error("Save Socials Error:", err);
    alert("Failed to save social networks: " + err.message);
  }
}

window.savePortfolio = async () => {
  try {
    for (let i = 1; i <= 3; i++) {
      const title = document.getElementById(`port-title-${i}`).value;
      const category = document.getElementById(`port-cat-${i}`).value;
      const link = document.getElementById(`port-link-${i}`).value;
      
      const { data: current } = await supabase.from('portfolio').select('image_url').eq('id', i).single();
      let imgUrl = current ? current.image_url : '';
      
      const fileInput = document.getElementById(`port-file-${i}`);
      if (fileInput.files[0]) {
        const uploaded = await uploadImage(fileInput.files[0]);
        if (uploaded) imgUrl = uploaded;
      }

      console.log(`Saving Portfolio ${i}:`, { title, category, imgUrl });
      const { error } = await supabase.from('portfolio').upsert({
        id: i,
        title: title,
        category: category,
        image_url: imgUrl,
        project_link: link
      });
      if (error) throw error;
    }
    notify("Portfolio Updated!");
  } catch (err) {
    console.error("Save Portfolio Error:", err);
    alert("Failed to save portfolio: " + err.message);
  }
}

window.saveServices = async () => {
  try {
    const items = [];
    document.querySelectorAll('.service-cms-item').forEach(card => {
      const id = card.dataset.id ? parseInt(card.dataset.id) : null;
      const title = card.querySelector('.service-title').value;
      const icon_class = card.querySelector('.service-icon').value;
      const description = card.querySelector('.service-desc').value;
      const full_description = card.querySelector('.service-full-desc').value;
      
      const item = {
        title,
        icon_class,
        description,
        full_description
      };
      
      if (id) {
        item.id = id;
      }
      items.push(item);
    });

    console.log("Saving Services:", items);
    const { error } = await supabase.from('services').upsert(items);
    if (error) throw error;
    notify("Services Updated!");
    await loadAllData();
  } catch (err) {
    console.error("Save Services Error:", err);
    alert("Failed to save services: " + err.message);
  }
}

window.saveAbout = async () => {
  try {
    const data = {
      id: 1,
      about_heading: document.getElementById('about-heading').value,
      about_p1: document.getElementById('about-p1').value,
      about_p2: document.getElementById('about-p2').value,
      stat_projects: document.getElementById('stat-projects').value,
      stat_fans: document.getElementById('stat-fans').value,
    };

    console.log("Saving About:", data);
    const { error } = await supabase.from('site_settings').upsert(data);
    if (error) throw error;
    notify("About & Stats Updated!");
  } catch (err) {
    console.error("Save About Error:", err);
    alert("Failed to save about info: " + err.message);
  }
}

window.saveContact = async () => {
  try {
    const data = {
      id: 1,
      contact_email: document.getElementById('contact-email').value,
      contact_whatsapp: document.getElementById('contact-whatsapp').value,
      contact_phone: document.getElementById('contact-phone-display').value,
    };

    console.log("Saving Contact:", data);
    const { error } = await supabase.from('site_settings').upsert(data);
    if (error) throw error;
    notify("Contact Info Updated!");
  } catch (err) {
    console.error("Save Contact Error:", err);
    alert("Failed to save contact info: " + err.message);
  }
}

// --- LOAD DATA ---
async function loadAllData() {
  try {
    console.log("Loading all data from Supabase...");
    
    // Load Social Links
    const { data: socialData, error: socialError } = await supabase.from('social_links').select('*').order('id');
    if (socialError) throw socialError;

    if (socialData) {
      socialData.forEach(item => {
        if (item.id <= 3) {
          const i = item.id;
          if (document.getElementById(`ch${i}-name`)) {
            document.getElementById(`ch${i}-name`).value = item.display_name || '';
            document.getElementById(`ch${i}-subs`).value = item.subscribers_count || '';
            document.getElementById(`ch${i}-link`).value = item.profile_link || '';
            if (item.logo_url && document.getElementById(`ch${i}-preview`)) {
              document.getElementById(`ch${i}-preview`).src = item.logo_url;
            }
          }
        } else {
          const map = { 4: 'fb', 5: 'ig', 6: 'tt', 7: 'tt2' };
          const prefix = map[item.id];
          if (prefix && document.getElementById(`${prefix}-name`)) {
            document.getElementById(`${prefix}-name`).value = item.display_name || '';
            document.getElementById(`${prefix}-subs`).value = item.subscribers_count || '';
            document.getElementById(`${prefix}-link`).value = item.profile_link || '';
          }
        }
      });
    }

    // Load Services
    const { data: servicesData, error: servicesError } = await supabase.from('services').select('*').order('id');
    if (servicesError) throw servicesError;

    const servicesContainer = document.getElementById('services-items');
    if (servicesContainer) {
      servicesContainer.innerHTML = '';
      if (servicesData) {
        servicesData.forEach((data) => {
          renderServiceCMSItem(data);
        });
      }
    }

    // Load Portfolio
    const { data: portfolioData, error: portfolioError } = await supabase.from('portfolio').select('*').order('id');
    if (portfolioError) throw portfolioError;

    if (portfolioData) {
      for (let i = 1; i <= 3; i++) {
        const item = portfolioData.find(p => p.id === i);
        if (item) {
          if (document.getElementById(`port-title-${i}`)) document.getElementById(`port-title-${i}`).value = item.title || '';
          if (document.getElementById(`port-cat-${i}`)) document.getElementById(`port-cat-${i}`).value = item.category || 'Music';
          if (document.getElementById(`port-link-${i}`)) document.getElementById(`port-link-${i}`).value = item.project_link || '';
          if (item.image_url && document.getElementById(`port-preview-${i}`)) {
            document.getElementById(`port-preview-${i}`).src = item.image_url;
          }
        }
      }
    }

    // Load About, Stats & Contact
    const { data: aboutData, error: aboutError } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;

    if (aboutData) {
      if (document.getElementById('about-heading')) document.getElementById('about-heading').value = aboutData.about_heading || '';
      if (document.getElementById('about-p1')) document.getElementById('about-p1').value = aboutData.about_p1 || '';
      if (document.getElementById('about-p2')) document.getElementById('about-p2').value = aboutData.about_p2 || '';
      if (document.getElementById('stat-projects')) document.getElementById('stat-projects').value = aboutData.stat_projects || '';
      if (document.getElementById('stat-fans')) document.getElementById('stat-fans').value = aboutData.stat_fans || '';
      
      if (document.getElementById('contact-email')) document.getElementById('contact-email').value = aboutData.contact_email || '';
      if (document.getElementById('contact-whatsapp')) document.getElementById('contact-whatsapp').value = aboutData.contact_whatsapp || '';
      if (document.getElementById('contact-phone-display')) document.getElementById('contact-phone-display').value = aboutData.contact_phone || '';
    }

  } catch (err) {
    console.error("Load All Data Error:", err);
  }
}

window.previewImage = (i) => {
  const fileInput = document.getElementById(`ch${i}-file`);
  const preview = document.getElementById(`ch${i}-preview`);
  if (fileInput && fileInput.files[0] && preview) {
    preview.src = URL.createObjectURL(fileInput.files[0]);
  }
}

window.previewPortfolioImage = (input) => {
  const preview = input.closest('.form-grid').querySelector('.port-preview');
  if (input.files[0] && preview) {
    preview.src = URL.createObjectURL(input.files[0]);
  }
}

function renderServiceCMSItem(data) {
  const container = document.getElementById('services-items');
  if (!container) return;

  const itemDiv = document.createElement('div');
  itemDiv.className = 'cms-card service-cms-item';
  itemDiv.dataset.id = data.id || '';

  itemDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px;">
      <h3 style="margin-bottom: 0; border: none; padding: 0;">Service Item: <span class="service-title-span">${data.title || 'New Service'}</span></h3>
      <button class="btn-delete-service" onclick="deleteService(${data.id || 0}, this)" style="background: transparent; color: #ff3333; border: 1px solid #ff3333; padding: 5px 15px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">
        <i class="fas fa-trash-alt"></i> Delete
      </button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Title</label>
        <input type="text" class="service-title" value="${data.title || ''}" oninput="this.closest('.service-cms-item').querySelector('.service-title-span').textContent = this.value || 'New Service'">
      </div>
      <div class="form-group">
        <label>Icon Class (FontAwesome)</label>
        <input type="text" class="service-icon" value="${data.icon_class || 'fas fa-cog'}">
      </div>
      <div class="form-group full-width">
        <label>Short Description</label>
        <textarea class="service-desc" rows="2">${data.description || ''}</textarea>
      </div>
      <div class="form-group full-width">
        <label>Full Service Details (Shown on separate page)</label>
        <textarea class="service-full-desc" rows="5">${data.full_description || ''}</textarea>
      </div>
    </div>
  `;
  container.appendChild(itemDiv);
}

window.addServiceField = () => {
  renderServiceCMSItem({
    title: 'New Service',
    icon_class: 'fas fa-cog',
    description: '',
    full_description: ''
  });
};

window.deleteService = async (id, buttonEl) => {
  if (!confirm("Are you sure you want to delete this service?")) return;
  
  const cardEl = buttonEl.closest('.service-cms-item');
  
  if (id) {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      notify("Service deleted from database!");
    } catch (err) {
      console.error("Delete Service Error:", err);
      alert("Failed to delete service: " + err.message);
      return;
    }
  }
  
  cardEl.remove();
};

document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
  loadAllData();
});
