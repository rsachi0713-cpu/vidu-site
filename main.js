import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from './supabase.js'

// Initialize AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
  if (cursor && cursorBlur) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorBlur.style.left = e.clientX + 'px';
    cursorBlur.style.top = e.clientY + 'px';
  }
});

// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1000);
  }
});

// CMS Loader
async function loadCMSContent() {
  // Load Social Links (Channels + Others)
  const { data: socialData } = await supabase.from('social_links').select('*').order('id');
  if (socialData) {
    socialData.forEach(item => {
      if (item.id <= 3) {
        const i = item.id;
        if (document.getElementById(`cms-ch${i}-name`)) document.getElementById(`cms-ch${i}-name`).textContent = item.display_name;
        if (document.getElementById(`cms-ch${i}-subs`)) document.getElementById(`cms-ch${i}-subs`).textContent = item.subscribers_count;
        if (document.getElementById(`cms-ch${i}-link`)) document.getElementById(`cms-ch${i}-link`).href = item.profile_link;
        if (document.getElementById(`cms-ch${i}-logo`)) document.getElementById(`cms-ch${i}-logo`).src = item.logo_url;
        
        if (i === 1) {
          if (document.getElementById('cms-social-yt-hero')) document.getElementById('cms-social-yt-hero').href = item.profile_link;
          if (document.getElementById('cms-social-yt-footer')) document.getElementById('cms-social-yt-footer').href = item.profile_link;
        }
      } else {
        const map = { 4: 'fb', 5: 'ig', 6: 'tt' };
        const prefix = map[item.id];
        if (prefix) {
          if (document.getElementById(`cms-${prefix}-name`)) document.getElementById(`cms-${prefix}-name`).textContent = item.display_name;
          if (document.getElementById(`cms-${prefix}-subs`)) document.getElementById(`cms-${prefix}-subs`).textContent = item.subscribers_count;
          if (document.getElementById(`cms-${prefix}-link`)) {
            document.getElementById(`cms-${prefix}-link`).href = item.profile_link;
            if (document.getElementById(`cms-social-${prefix}-hero`)) document.getElementById(`cms-social-${prefix}-hero`).href = item.profile_link;
            if (document.getElementById(`cms-social-${prefix}-footer`)) document.getElementById(`cms-social-${prefix}-footer`).href = item.profile_link;
          }
        }
      }
    });
  }

  // Load About
  const { data: aboutData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  if (aboutData) {
    if (document.getElementById('cms-about-heading')) document.getElementById('cms-about-heading').textContent = aboutData.about_heading;
    if (document.getElementById('cms-about-p1')) document.getElementById('cms-about-p1').textContent = aboutData.about_p1;
    if (document.getElementById('cms-about-p2')) document.getElementById('cms-about-p2').textContent = aboutData.about_p2;
    if (document.getElementById('cms-stat-projects')) document.getElementById('cms-stat-projects').textContent = aboutData.stat_projects || '100+';
    if (document.getElementById('cms-stat-fans')) document.getElementById('cms-stat-fans').textContent = aboutData.stat_fans || '500K+';
    
    if (document.getElementById('cms-contact-email')) document.getElementById('cms-contact-email').textContent = aboutData.contact_email;
    if (document.getElementById('cms-contact-phone')) document.getElementById('cms-contact-phone').textContent = aboutData.contact_phone;
    if (document.getElementById('cms-whatsapp-link')) document.getElementById('cms-whatsapp-link').href = aboutData.whatsapp_link;
  }

  // Load Services
  const { data: servicesData } = await supabase.from('services').select('*').order('id');
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach((card, index) => {
    const item = servicesData ? servicesData[index] : null;
    const idx = index + 1;
    
    if (item) {
      if (document.getElementById(`cms-service-title-${idx}`)) document.getElementById(`cms-service-title-${idx}`).textContent = item.title;
      if (document.getElementById(`cms-service-desc-${idx}`)) document.getElementById(`cms-service-desc-${idx}`).textContent = item.description;
      if (document.getElementById(`cms-service-icon-${idx}`)) document.getElementById(`cms-service-icon-${idx}`).className = item.icon_class;
    }

    card.style.cursor = 'pointer';
    card.onclick = () => {
      openServiceModal({
        title: item ? item.title : document.getElementById(`cms-service-title-${idx}`).textContent,
        icon: item ? item.icon_class : document.getElementById(`cms-service-icon-${idx}`).className,
        desc: item ? item.description : document.getElementById(`cms-service-desc-${idx}`).textContent,
        fullDesc: item ? item.full_description : ""
      });
    };
  });

  // Load Portfolio
  const { data: portfolioData } = await supabase.from('portfolio').select('*').order('id');
  if (portfolioData) {
    portfolioData.forEach((item, index) => {
      const idx = index + 1;
      const portEl = document.getElementById(`cms-port-${idx}`);
      if (portEl) {
        portEl.className = `portfolio-item ${item.category}`;
        if (document.getElementById(`cms-port-title-${idx}`)) document.getElementById(`cms-port-title-${idx}`).textContent = item.title;
        if (document.getElementById(`cms-port-img-${idx}`)) document.getElementById(`cms-port-img-${idx}`).src = item.image_url;
        if (document.getElementById(`cms-port-link-${idx}`)) document.getElementById(`cms-port-link-${idx}`).href = item.project_link;
      }
    });
  }
}

// Modal Logic
function openServiceModal(service) {
  const modal = document.getElementById('service-modal');
  if (!modal) return;
  
  document.getElementById('modal-title').textContent = service.title;
  document.getElementById('modal-icon').className = service.icon;
  
  const shortContent = `<p style="color: var(--primary-color); font-weight: 600; margin-bottom: 15px;">${service.desc}</p>`;
  let fullContent = "";
  if (service.fullDesc && service.fullDesc.trim() !== "" && service.fullDesc !== service.desc) {
    fullContent = `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1a1a1a;">${service.fullDesc.replace(/\n/g, '<br>')}</div>`;
  }
  
  document.getElementById('modal-desc').innerHTML = shortContent + fullContent;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('service-modal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Typing Animation
const typingText = document.getElementById('typing-text');
const phrases = ["Music Artist", "Band Promoter", "Content Creator"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  if (!typingText) return;
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }
  setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCMSContent();
  type();

  const modal = document.getElementById('service-modal');
  const closeBtn = document.querySelector('.close-modal');
  const closeBtnFooter = document.querySelector('.close-btn');

  if (closeBtn) closeBtn.onclick = closeModal;
  if (closeBtnFooter) closeBtnFooter.onclick = closeModal;

  window.addEventListener('click', (event) => {
    if (event.target == modal) closeModal();
  });
});

// Sticky Navbar & Scroll Top
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) navbar.classList.add('sticky');
    else navbar.classList.remove('sticky');
  }

  if (scrollTop) {
    if (window.scrollY > 500) scrollTop.classList.add('show');
    else scrollTop.classList.remove('show');
  }
});

if (scrollTop) {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Link Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) link.classList.add('active');
  });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! MR VIDU will get back to you soon.');
    contactForm.reset();
  });
}

// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) {
        item.classList.remove('hide');
        item.style.display = 'block';
      } else {
        item.classList.add('hide');
        item.style.display = 'none';
      }
    });
    AOS.refresh();
  });
});

// Magnetic Effect
const magneticBtns = document.querySelectorAll('.btn, .social-icons a, .filter-btn');
magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const position = btn.getBoundingClientRect();
    const x = e.pageX - position.left - position.width / 2;
    const y = e.pageY - position.top - position.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
  });
  btn.addEventListener('mouseout', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});
