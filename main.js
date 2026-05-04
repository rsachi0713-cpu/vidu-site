import AOS from 'aos';
import 'aos/dist/aos.css';

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
function loadCMSContent() {
  // Load Channels
  const savedChannels = JSON.parse(localStorage.getItem('vidu_channels'));
  if (savedChannels) {
    for (let i = 1; i <= 3; i++) {
      const ch = savedChannels[`ch${i}`];
      if (document.getElementById(`cms-ch${i}-name`)) document.getElementById(`cms-ch${i}-name`).textContent = ch.name;
      if (document.getElementById(`cms-ch${i}-subs`)) document.getElementById(`cms-ch${i}-subs`).textContent = ch.subs;
      if (document.getElementById(`cms-ch${i}-link`)) document.getElementById(`cms-ch${i}-link`).href = ch.link;
      if (document.getElementById(`cms-ch${i}-logo`)) document.getElementById(`cms-ch${i}-logo`).src = ch.logo;
      
      // Sync main YouTube icons (Hero & Footer) with Channel 1
      if (i === 1) {
        if (document.getElementById('cms-social-yt-hero')) document.getElementById('cms-social-yt-hero').href = ch.link;
        if (document.getElementById('cms-social-yt-footer')) document.getElementById('cms-social-yt-footer').href = ch.link;
      }
    }
  }

  // Load About
  const savedAbout = JSON.parse(localStorage.getItem('vidu_about'));
  if (savedAbout) {
    if (document.getElementById('cms-about-heading')) document.getElementById('cms-about-heading').textContent = savedAbout.heading;
    if (document.getElementById('cms-about-p1')) document.getElementById('cms-about-p1').textContent = savedAbout.p1;
    if (document.getElementById('cms-about-p2')) document.getElementById('cms-about-p2').textContent = savedAbout.p2;
    if (document.getElementById('cms-stat-projects')) document.getElementById('cms-stat-projects').textContent = savedAbout.projects;
    if (document.getElementById('cms-stat-fans')) document.getElementById('cms-stat-fans').textContent = savedAbout.fans;
  }

  // Load Socials
  const savedSocials = JSON.parse(localStorage.getItem('vidu_socials'));
  if (savedSocials) {
    if (document.getElementById('cms-fb-name')) document.getElementById('cms-fb-name').textContent = savedSocials.fb.name;
    if (document.getElementById('cms-fb-subs')) document.getElementById('cms-fb-subs').textContent = savedSocials.fb.subs;
    if (document.getElementById('cms-fb-link')) {
      document.getElementById('cms-fb-link').href = savedSocials.fb.link;
      if (document.getElementById('cms-social-fb-hero')) document.getElementById('cms-social-fb-hero').href = savedSocials.fb.link;
      if (document.getElementById('cms-social-fb-footer')) document.getElementById('cms-social-fb-footer').href = savedSocials.fb.link;
    }
    
    if (document.getElementById('cms-ig-name')) document.getElementById('cms-ig-name').textContent = savedSocials.ig.name;
    if (document.getElementById('cms-ig-subs')) document.getElementById('cms-ig-subs').textContent = savedSocials.ig.subs;
    if (document.getElementById('cms-ig-link')) {
      document.getElementById('cms-ig-link').href = savedSocials.ig.link;
      if (document.getElementById('cms-social-ig-hero')) document.getElementById('cms-social-ig-hero').href = savedSocials.ig.link;
      if (document.getElementById('cms-social-ig-footer')) document.getElementById('cms-social-ig-footer').href = savedSocials.ig.link;
    }
    
    if (document.getElementById('cms-tt-name')) document.getElementById('cms-tt-name').textContent = savedSocials.tt.name;
    if (document.getElementById('cms-tt-subs')) document.getElementById('cms-tt-subs').textContent = savedSocials.tt.subs;
    if (document.getElementById('cms-tt-link')) {
      document.getElementById('cms-tt-link').href = savedSocials.tt.link;
      if (document.getElementById('cms-social-tt-hero')) document.getElementById('cms-social-tt-hero').href = savedSocials.tt.link;
      if (document.getElementById('cms-social-tt-footer')) document.getElementById('cms-social-tt-footer').href = savedSocials.tt.link;
    }
  }

  // Load Services
  const savedServices = JSON.parse(localStorage.getItem('vidu_services'));
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach((card, index) => {
    const idx = index + 1;
    const item = savedServices ? savedServices[index] : null;
    
    // Update UI if data exists
    if (item) {
      if (document.getElementById(`cms-service-title-${idx}`)) document.getElementById(`cms-service-title-${idx}`).textContent = item.title;
      if (document.getElementById(`cms-service-desc-${idx}`)) document.getElementById(`cms-service-desc-${idx}`).textContent = item.desc;
      if (document.getElementById(`cms-service-icon-${idx}`)) document.getElementById(`cms-service-icon-${idx}`).className = item.icon;
    }

    // Always attach click event
    card.style.cursor = 'pointer';
    card.onclick = () => {
      const currentTitle = document.getElementById(`cms-service-title-${idx}`).textContent;
      const currentIcon = document.getElementById(`cms-service-icon-${idx}`).className;
      const currentDesc = document.getElementById(`cms-service-desc-${idx}`).textContent;
      
      // Prioritize fullDesc from localStorage
      let fullContent = currentDesc; // Default to short desc
      if (item && item.fullDesc && item.fullDesc.trim() !== "") {
        fullContent = item.fullDesc;
      }

      openServiceModal({
        title: currentTitle,
        icon: currentIcon,
        desc: currentDesc,
        fullDesc: fullContent
      });
    };
  });

  // Load Portfolio
  const savedPortfolio = JSON.parse(localStorage.getItem('vidu_portfolio'));
  if (savedPortfolio) {
    savedPortfolio.forEach((item, index) => {
      const idx = index + 1;
      const portEl = document.getElementById(`cms-port-${idx}`);
      if (portEl) {
        portEl.className = `portfolio-item ${item.category}`;
        if (document.getElementById(`cms-port-title-${idx}`)) document.getElementById(`cms-port-title-${idx}`).textContent = item.title;
        if (document.getElementById(`cms-port-img-${idx}`)) document.getElementById(`cms-port-img-${idx}`).src = item.img;
        if (document.getElementById(`cms-port-link-${idx}`)) document.getElementById(`cms-port-link-${idx}`).href = item.link;
      }
    });
  }

  // Load Contact
  const savedContact = JSON.parse(localStorage.getItem('vidu_contact'));
  if (savedContact) {
    if (document.getElementById('cms-contact-email')) document.getElementById('cms-contact-email').textContent = savedContact.email;
    if (document.getElementById('cms-contact-phone')) document.getElementById('cms-contact-phone').textContent = savedContact.phone;
    if (document.getElementById('cms-whatsapp-link')) {
      document.getElementById('cms-whatsapp-link').href = `https://wa.me/${savedContact.whatsapp}`;
    }
  }
}

// Modal Logic
function openServiceModal(service) {
  const modal = document.getElementById('service-modal');
  if (!modal) return;
  
  document.getElementById('modal-title').textContent = service.title;
  document.getElementById('modal-icon').className = service.icon;
  
  // Combine Short Description and Full Details
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

  // Re-initialize Modal elements and listeners inside DOM
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
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }

  if (scrollTop) {
    if (window.scrollY > 500) {
      scrollTop.classList.add('show');
    } else {
      scrollTop.classList.remove('show');
    }
  }
});

if (scrollTop) {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
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

// Magnetic Effect for Buttons
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

