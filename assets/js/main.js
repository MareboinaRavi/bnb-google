// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Dynamic copyright year
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Home page impact counters (triggered when section enters viewport)
const impactNumbers = document.querySelectorAll('.impact-number');
const impactSection = document.querySelector('#impact');

function runCounters() {
  impactNumbers.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 100));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString('en-IN');
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString('en-IN');
      }
    }, 20);
  });
}

if (impactSection && impactNumbers.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.45 }
  );

  observer.observe(impactSection);
}

// Volunteer form submission message
const volunteerForm = document.querySelector('#volunteer-form');
const volunteerMessage = document.querySelector('#volunteer-message');

if (volunteerForm && volunteerMessage) {
  volunteerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!volunteerForm.checkValidity()) {
      volunteerMessage.textContent = 'Please fill out all fields correctly.';
      return;
    }

    volunteerMessage.textContent = 'Thank you for joining IGreenArmy! We will contact you soon.';
    volunteerForm.reset();
  });
}

// Testimonial slider controls
const testimonials = document.querySelectorAll('.testimonial');
const prevTestimonial = document.querySelector('#prev-testimonial');
const nextTestimonial = document.querySelector('#next-testimonial');
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

if (testimonials.length > 0) {
  const slideForward = () => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
  };

  const slideBackward = () => {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(testimonialIndex);
  };

  if (nextTestimonial) nextTestimonial.addEventListener('click', slideForward);
  if (prevTestimonial) prevTestimonial.addEventListener('click', slideBackward);

  // Auto-rotate testimonials every 6 seconds
  setInterval(slideForward, 6000);
}

// Gallery lightbox preview
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('#lightbox-close');

if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxCaption) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const source = item.dataset.image || '';
      const caption = item.dataset.caption || '';
      lightboxImage.src = source;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}

// Donation page interactions
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.querySelector('#custom-amount');
const donationForm = document.querySelector('#donation-form');
const donationMessage = document.querySelector('#donation-message');

if (amountButtons.length > 0 && customAmountInput) {
  amountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      amountButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const amount = button.dataset.amount;
      if (amount && amount !== 'custom') {
        customAmountInput.value = amount;
      } else {
        customAmountInput.value = '';
        customAmountInput.focus();
      }
    });
  });
}

if (donationForm && donationMessage && customAmountInput) {
  donationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!donationForm.checkValidity() || Number(customAmountInput.value) < 1) {
      donationMessage.textContent = 'Please enter valid details and donation amount.';
      return;
    }

    donationMessage.textContent = `Thank you! Your donation of ₹${Number(
      customAmountInput.value
    ).toLocaleString('en-IN')} has been recorded successfully.`;
    donationForm.reset();
    amountButtons.forEach((btn) => btn.classList.remove('active'));
  });
}
