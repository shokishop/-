gsap.registerPlugin(ScrollTrigger);

let cart = JSON.parse(localStorage.getItem('cart')) || [];

updateCartCount();

// Magnetic button effect
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// Subtle floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.background = Math.random() > 0.5 ? '#A761FF' : '#00C8FF';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.2 + 0.05;
    particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
    particlesContainer.appendChild(particle);
  }
}

createParticles();

const style = document.createElement('style');
style.innerHTML = `
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-100px) translateX(50px); }
    100% { transform: translateY(0) translateX(0); }
  }
`;
document.head.appendChild(style);

// Hero timeline animation
const heroTl = gsap.timeline();

heroTl.to('.hero-title .line', {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.2,
  ease: 'power4.out'
})
.to('.hero-subtitle .line', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out'
}, '-=0.5')
.to('.hero-search', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power3.out'
}, '-=0.5')
.to('.hero-buttons', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power3.out'
}, '-=0.5');

gsap.set('.hero-title .line', { opacity: 0, y: 100 });
gsap.set('.hero-subtitle .line', { opacity: 0, y: 50 });
gsap.set('.hero-search', { opacity: 0, y: 30 });
gsap.set('.hero-buttons', { opacity: 0, y: 30 });

// Product cards animation
gsap.utils.toArray('.product-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.set(card, { opacity: 0, y: 50 });
});

// Feature items animation
gsap.utils.toArray('.feature-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i * 0.2,
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.set(item, { opacity: 0, y: 50 });
});

// Gallery parallax effect
gsap.utils.toArray('.gallery-item').forEach((item) => {
  const speed = item.dataset.speed || 1;

  gsap.to(item, {
    y: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: item,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(item.querySelector('img'), {
        filter: 'grayscale(0) blur(0)',
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });

  gsap.set(item.querySelector('img'), { filter: 'grayscale(0.8) blur(5px)', scale: 0.9 });
});

// Product card tilt effect
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// Add to cart functionality
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const productId = btn.dataset.product;
    const card = btn.closest('.product-card');
    const productName = card.querySelector('.product-name').textContent;
    const productPrice = card.querySelector('.product-price').textContent;
    const productImage = card.querySelector('.product-image img').src;

    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    gsap.to(btn, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(167, 97, 255, 0.8)';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10000';
    document.body.appendChild(ripple);

    gsap.to(ripple, {
      width: 300,
      height: 300,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  });
});

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cart.length;

    gsap.fromTo(countEl,
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );
  }
}

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('.newsletter-input');
  const btn = e.target.querySelector('.btn-primary');

  gsap.to(btn, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      input.value = '';
      btn.textContent = 'Subscribed!';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
      }, 2000);
    }
  });
});

// Button navigation
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  if (btn.textContent.includes('Shop Now')) {
    btn.addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  } else if (btn.textContent.includes('Explore')) {
    btn.addEventListener('click', () => {
      document.querySelector('.featured-section').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
});
