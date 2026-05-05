import { supabase } from './supabase.js'

// Auth Check (Simple for now, matching your current admin/admin123)
window.loginAdmin = () => {
  const user = document.getElementById('admin-user').value;
  const pass = document.getElementById('admin-pass').value;
  
  if (user === 'admin' && pass === 'admin123') {
    document.getElementById('login-page').classList.add('hidden');
    loadAllData();
  } else {
    alert('Invalid Credentials');
  }
}

// Tab Switching
window.showTab = (tab) => {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  if (event) event.currentTarget.classList.add('active');
}

// Notification
function notify(msg = "Changes Saved Successfully!") {
  const n = document.getElementById('notification');
  n.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  n.style.display = 'block';
  setTimeout(() => { n.style.display = 'none'; }, 3000);
}

// Image Upload to Supabase Storage
async function uploadImage(file, bucket = 'media') {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
    
  if (error) {
    console.error('Upload Error:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
    
  return publicUrl;
}

// --- SAVE FUNCTIONS ---

window.saveChannels = async () => {
  const channels = [
    { id: 1, name: 'ch1' },
    { id: 2, name: 'ch2' },
    { id: 3, name: 'ch3' }
  ];

  for (const ch of channels) {
    const name = document.getElementById(`${ch.name}-name`).value;
    const subs = document.getElementById(`${ch.name}-subs`).value;
    const link = document.getElementById(`${ch.name}-link`).value;
    const fileInput = document.getElementById(`${ch.name}-file`);
    let logoUrl = document.getElementById(`${ch.name}-logo`).value;

    if (fileInput.files[0]) {
      const uploadedUrl = await uploadImage(fileInput.files[0]);
      if (uploadedUrl) logoUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from('social_links')
      .upsert({
        id: ch.id, // Using fixed IDs for the 3 main channels
        platform_name: 'YouTube',
        display_name: name,
        subscribers_count: subs,
        profile_link: link,
        logo_url: logoUrl
      });

    if (error) console.error(`Error saving ${ch.name}:`, error);
  }
  notify("YouTube Channels Updated!");
}

window.saveSocials = async () => {
  const socials = ['fb', 'ig', 'tt'];
  const platforms = { fb: 'Facebook', ig: 'Instagram', tt: 'TikTok' };

  for (const s of socials) {
    const name = document.getElementById(`${s}-name`).value;
    const subs = document.getElementById(`${s}-subs`).value;
    const link = document.getElementById(`${s}-link`).value;

    const { error } = await supabase
      .from('social_links')
      .upsert({
        id: socials.indexOf(s) + 4, // Starting IDs from 4 for other socials
        platform_name: platforms[s],
        display_name: name,
        subscribers_count: subs,
        profile_link: link
      });

    if (error) console.error(`Error saving ${s}:`, error);
  }
  notify("Social Networks Updated!");
}

window.savePortfolio = async () => {
  const items = [];
  const cardElements = document.querySelectorAll('.portfolio-cms-item');
  
  for (const card of cardElements) {
    const id = parseInt(card.dataset.id);
    const title = card.querySelector('.port-title').value;
    const category = card.querySelector('.port-category').value;
    const link = card.querySelector('.port-link').value;
    const fileInput = card.querySelector('.port-file');
    let imgUrl = card.querySelector('.port-img-data').value;

    if (fileInput.files[0]) {
      const uploadedUrl = await uploadImage(fileInput.files[0]);
      if (uploadedUrl) imgUrl = uploadedUrl;
    }

    items.push({
      id: id,
      title: title,
      category: category,
      image_url: imgUrl,
      project_link: link
    });
  }

  const { error } = await supabase.from('portfolio').upsert(items);
  if (error) console.error('Error saving portfolio:', error);
  else notify("Portfolio Updated!");
}

window.saveServices = async () => {
  const items = [];
  document.querySelectorAll('.service-cms-item').forEach(card => {
    items.push({
      id: parseInt(card.dataset.id),
      title: card.querySelector('.service-title').value,
      icon_class: card.querySelector('.service-icon').value,
      description: card.querySelector('.service-desc').value
    });
  });

  const { error } = await supabase.from('services').upsert(items);
  if (error) console.error('Error saving services:', error);
  else notify("Services Updated!");
}

window.saveAbout = async () => {
  const data = {
    id: 1,
    about_heading: document.getElementById('about-heading').value,
    about_p1: document.getElementById('about-p1').value,
    about_p2: document.getElementById('about-p2').value,
    stat_projects: document.getElementById('stat-projects').value,
    stat_fans: document.getElementById('stat-fans').value,
  };

  const { error } = await supabase.from('site_settings').upsert(data);
  if (error) console.error('Error saving about:', error);
  else notify("About & Stats Updated!");
}

window.saveContact = async () => {
  const data = {
    id: 1,
    contact_email: document.getElementById('contact-email').value,
    contact_whatsapp: document.getElementById('contact-whatsapp').value,
    contact_phone: document.getElementById('contact-phone-display').value,
  };

  const { error } = await supabase.from('site_settings').upsert(data);
  if (error) console.error('Error saving contact:', error);
  else notify("Contact Info Updated!");
}

// --- LOAD DATA ---
async function loadAllData() {
  // Load Social Links
  const { data: socialData } = await supabase.from('social_links').select('*').order('id');
  if (socialData) {
    socialData.forEach(item => {
      if (item.id <= 3) {
        const i = item.id;
        document.getElementById(`ch${i}-name`).value = item.display_name;
        document.getElementById(`ch${i}-subs`).value = item.subscribers_count;
        document.getElementById(`ch${i}-link`).value = item.profile_link;
        document.getElementById(`ch${i}-logo`).value = item.logo_url;
        document.getElementById(`ch${i}-preview`).src = item.logo_url;
      } else {
        const map = { 4: 'fb', 5: 'ig', 6: 'tt' };
        const prefix = map[item.id];
        if (prefix) {
          document.getElementById(`${prefix}-name`).value = item.display_name;
          document.getElementById(`${prefix}-subs`).value = item.subscribers_count;
          document.getElementById(`${prefix}-link`).value = item.profile_link;
        }
      }
    });
  }

  // Load Services
  const { data: servicesData } = await supabase.from('services').select('*').order('id');
  if (servicesData) {
    const items = document.querySelectorAll('.service-cms-item');
    servicesData.forEach((data, index) => {
      if (items[index]) {
        items[index].querySelector('.service-title').value = data.title;
        items[index].querySelector('.service-icon').value = data.icon_class;
        items[index].querySelector('.service-desc').value = data.description;
      }
    });
  }

  // Load About, Stats & Contact
  const { data: aboutData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  if (aboutData) {
    document.getElementById('about-heading').value = aboutData.about_heading || '';
    document.getElementById('about-p1').value = aboutData.about_p1 || '';
    document.getElementById('about-p2').value = aboutData.about_p2 || '';
    document.getElementById('stat-projects').value = aboutData.stat_projects || '';
    document.getElementById('stat-fans').value = aboutData.stat_fans || '';
    document.getElementById('contact-email').value = aboutData.contact_email || '';
    document.getElementById('contact-whatsapp').value = aboutData.contact_whatsapp || '';
    document.getElementById('contact-phone-display').value = aboutData.contact_phone || '';
  }

  // Load Portfolio
  const { data: portfolioData } = await supabase.from('portfolio').select('*').order('id');
  if (portfolioData) {
    const items = document.querySelectorAll('.portfolio-cms-item');
    portfolioData.forEach((data, index) => {
      if (items[index]) {
        items[index].querySelector('.port-title').value = data.title;
        items[index].querySelector('.port-category').value = data.category;
        items[index].querySelector('.port-link').value = data.project_link;
        items[index].querySelector('.port-img-data').value = data.image_url;
        items[index].querySelector('.port-preview').src = data.image_url;
      }
    });
  }
}

// Image Previews
window.previewPortfolioImage = (input) => {
  const card = input.closest('.portfolio-cms-item');
  const preview = card.querySelector('.port-preview');
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => preview.src = e.target.result;
    reader.readAsDataURL(file);
  }
}

// Image Previews
window.previewImage = (chNum) => {
  const fileInput = document.getElementById(`ch${chNum}-file`);
  const preview = document.getElementById(`ch${chNum}-preview`);
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => preview.src = e.target.result;
    reader.readAsDataURL(file);
  }
}
