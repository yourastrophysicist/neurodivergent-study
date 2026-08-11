/* ==========================================================================
   Neuro-Spices Planner - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSpoonCalculator();
  initGalleryFilter();
  initModalLightbox();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. Interactive Spoon Budget Calculator Widget
   -------------------------------------------------------------------------- */
function initSpoonCalculator() {
  const slider = document.getElementById('spoonRange');
  const countDisplay = document.getElementById('spoonCount');
  const taskInputs = document.querySelectorAll('.spoon-task-checkbox');
  const batteryBars = document.querySelectorAll('.battery-bar');
  const batteryStatus = document.getElementById('batteryStatus');
  const recommendationBox = document.getElementById('recommendationBox');

  if (!slider) return;

  function updateBudget() {
    const totalSpoons = parseInt(slider.value, 10);
    countDisplay.textContent = `${totalSpoons} Spoons`;

    let spentSpoons = 0;
    taskInputs.forEach(input => {
      if (input.checked) {
        spentSpoons += parseInt(input.dataset.cost, 10);
      }
    });

    const remainingSpoons = Math.max(0, totalSpoons - spentSpoons);
    const capacityRatio = totalSpoons > 0 ? remainingSpoons / totalSpoons : 0;

    // Update battery bars (5 bars total)
    const activeBarsCount = Math.ceil(capacityRatio * 5);
    batteryBars.forEach((bar, index) => {
      if (index < activeBarsCount && remainingSpoons > 0) {
        bar.classList.remove('off');
        if (capacityRatio <= 0.25) {
          bar.style.background = 'var(--color-terracotta)';
        } else if (capacityRatio <= 0.5) {
          bar.style.background = 'var(--color-amber)';
        } else {
          bar.style.background = 'var(--color-sage)';
        }
      } else {
        bar.classList.add('off');
      }
    });

    // Dynamic messaging
    if (remainingSpoons === 0) {
      batteryStatus.textContent = "5% Energy Battery Mode";
      recommendationBox.innerHTML = "<strong>Low Capacity Advice:</strong> Switch to the <em>5% Battery Daily Focus Page</em>. Focus on just ONE small task today. Rest is productive!";
    } else if (capacityRatio <= 0.35) {
      batteryStatus.textContent = "Spoon Budget Low (" + remainingSpoons + " left)";
      recommendationBox.innerHTML = "<strong>Pace Yourself:</strong> You have used most of your energy. Pair your remaining tasks with a Dopamine Menu item or take a rest break.";
    } else {
      batteryStatus.textContent = "Optimal Energy (" + remainingSpoons + " spoons available)";
      recommendationBox.innerHTML = "<strong>Great Capacity:</strong> You have plenty of spoons remaining for your North Star task or a Deep Work hyperfocus session!";
    }
  }

  slider.addEventListener('input', updateBudget);
  taskInputs.forEach(input => input.addEventListener('change', updateBudget));
  updateBudget();
}

/* --------------------------------------------------------------------------
   2. Page Gallery Filtering
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Lightbox Modal Preview
   -------------------------------------------------------------------------- */
function initModalLightbox() {
  const modal = document.getElementById('previewModal');
  const modalImg = document.getElementById('modalImagePreview');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('modalCloseBtn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!modal) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      const title = card.querySelector('.gallery-card-title').textContent;

      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion Toggles
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
