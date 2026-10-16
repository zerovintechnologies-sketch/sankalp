/**
 * Sankalp Metal - Modern Metallurgy Interactive Logic
 * Controls Navigation, Weight Estimator, Product Filters, RFQ Modal, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Scroll Elevation
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle with Backdrop & Scroll Lock
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    
    // Create mobile backdrop if not present
    let mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
    if (!mobileBackdrop) {
        mobileBackdrop = document.createElement('div');
        mobileBackdrop.className = 'mobile-nav-backdrop';
        document.body.appendChild(mobileBackdrop);
    }

    function closeMobileMenu() {
        if (!mainNav) return;
        mainNav.classList.remove('mobile-active');
        mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileToggle) {
            mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
    }

    function openMobileMenu() {
        if (!mainNav) return;
        mainNav.classList.add('mobile-active');
        mobileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileToggle) {
            mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        }
    }

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainNav.classList.contains('mobile-active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close on backdrop click
        mobileBackdrop.addEventListener('click', closeMobileMenu);

        // Close on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Auto close on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && mainNav.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        });
    }

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal-fade');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // 4. Product Category Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 5. Interactive Steel Weight & Spec Calculator
    let currentShape = 'plate';
    const shapeTabs = document.querySelectorAll('.shape-tab');
    const dynamicDimensions = document.getElementById('dynamicDimensions');
    const calcGrade = document.getElementById('calcGrade');
    const calcQty = document.getElementById('calcQty');
    const qtyDisplay = document.getElementById('qtyDisplay');
    const calcResultVal = document.getElementById('calcResultVal');
    const btnForwardRfq = document.getElementById('btnForwardRfq');

    function renderDimensionInputs(shape) {
        if (!dynamicDimensions) return;

        if (shape === 'plate') {
            dynamicDimensions.innerHTML = `
                <div class="calc-dims-grid">
                    <div class="calc-form-group">
                        <label class="calc-label">Thick (mm)</label>
                        <input type="number" class="calc-input" id="dimThick" value="12" min="0.5" step="0.5">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Width (mm)</label>
                        <input type="number" class="calc-input" id="dimWidth" value="1500" min="10">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Length (mm)</label>
                        <input type="number" class="calc-input" id="dimLength" value="6000" min="10">
                    </div>
                </div>
            `;
        } else if (shape === 'pipe') {
            dynamicDimensions.innerHTML = `
                <div class="calc-dims-grid">
                    <div class="calc-form-group">
                        <label class="calc-label">Outer Dia (mm)</label>
                        <input type="number" class="calc-input" id="dimOD" value="219" min="10">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Wall Thick (mm)</label>
                        <input type="number" class="calc-input" id="dimWall" value="8.18" min="0.5" step="0.1">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Length (mm)</label>
                        <input type="number" class="calc-input" id="dimLength" value="6000" min="10">
                    </div>
                </div>
            `;
        } else if (shape === 'round') {
            dynamicDimensions.innerHTML = `
                <div class="calc-dims-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="calc-form-group">
                        <label class="calc-label">Diameter (mm)</label>
                        <input type="number" class="calc-input" id="dimDia" value="60" min="5">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Length (mm)</label>
                        <input type="number" class="calc-input" id="dimLength" value="3000" min="10">
                    </div>
                </div>
            `;
        } else if (shape === 'coil') {
            dynamicDimensions.innerHTML = `
                <div class="calc-dims-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="calc-form-group">
                        <label class="calc-label">Thickness (mm)</label>
                        <input type="number" class="calc-input" id="dimThick" value="2.5" min="0.3" step="0.1">
                    </div>
                    <div class="calc-form-group">
                        <label class="calc-label">Coil Width (mm)</label>
                        <input type="number" class="calc-input" id="dimWidth" value="1250" min="50">
                    </div>
                </div>
            `;
        }

        // Attach listeners to new inputs
        dynamicDimensions.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', calculateWeight);
        });

        calculateWeight();
    }

    function calculateWeight() {
        if (!calcResultVal) return;

        const densityFactor = parseFloat(calcGrade.value) || 1.0;
        const steelDensity = 0.00000785 * densityFactor; // kg / mm³
        const qty = parseInt(calcQty.value, 10) || 1;

        if (qtyDisplay) {
            qtyDisplay.textContent = `${qty} ${qty > 1 ? 'pcs' : 'pc'}`;
        }

        let unitWeightKg = 0;

        if (currentShape === 'plate') {
            const thick = parseFloat(document.getElementById('dimThick')?.value) || 0;
            const width = parseFloat(document.getElementById('dimWidth')?.value) || 0;
            const length = parseFloat(document.getElementById('dimLength')?.value) || 0;
            unitWeightKg = thick * width * length * steelDensity;
        } else if (currentShape === 'pipe') {
            const od = parseFloat(document.getElementById('dimOD')?.value) || 0;
            const wall = parseFloat(document.getElementById('dimWall')?.value) || 0;
            const length = parseFloat(document.getElementById('dimLength')?.value) || 0;
            // Formula: (OD - Wall) * Wall * 0.02466 * length (in meters)
            const id = od - 2 * wall;
            const area = Math.PI * (Math.pow(od / 2, 2) - Math.pow(id / 2, 2));
            unitWeightKg = area * length * steelDensity;
        } else if (currentShape === 'round') {
            const dia = parseFloat(document.getElementById('dimDia')?.value) || 0;
            const length = parseFloat(document.getElementById('dimLength')?.value) || 0;
            const area = Math.PI * Math.pow(dia / 2, 2);
            unitWeightKg = area * length * steelDensity;
        } else if (currentShape === 'coil') {
            const thick = parseFloat(document.getElementById('dimThick')?.value) || 0;
            const width = parseFloat(document.getElementById('dimWidth')?.value) || 0;
            // Estimated typical coil weight per batch (~5 to 10 MT nominal)
            unitWeightKg = thick * width * 1000 * steelDensity * 1200;
        }

        const totalWeightKg = unitWeightKg * qty;

        if (totalWeightKg >= 1000) {
            const tons = (totalWeightKg / 1000).toFixed(2);
            calcResultVal.innerHTML = `${tons} <span style="font-size:1.125rem; font-weight:500;">Metric Tons</span> (${Math.round(totalWeightKg).toLocaleString()} kg)`;
        } else {
            calcResultVal.innerHTML = `${totalWeightKg.toFixed(1)} <span style="font-size:1.125rem; font-weight:500;">kg</span>`;
        }
    }

    if (shapeTabs.length > 0) {
        shapeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                shapeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentShape = tab.getAttribute('data-shape');
                renderDimensionInputs(currentShape);
            });
        });

        if (calcGrade) calcGrade.addEventListener('change', calculateWeight);
        if (calcQty) calcQty.addEventListener('input', calculateWeight);

        // Initial trigger
        renderDimensionInputs('plate');
    }

    // 6. Quick RFQ Modal Controller
    const rfqModal = document.getElementById('rfqModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const openRfqBtns = document.querySelectorAll('.open-rfq-btn');
    const rfqModalForm = document.getElementById('rfqModalForm');
    const rfqSuccess = document.getElementById('rfqSuccess');

    function openModal(defaultProduct = '', defaultNotes = '') {
        if (!rfqModal) return;
        rfqModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (defaultProduct) {
            const categorySelect = document.getElementById('rfqProductCategory');
            if (categorySelect) {
                for (let i = 0; i < categorySelect.options.length; i++) {
                    if (categorySelect.options[i].text.toLowerCase().includes(defaultProduct.toLowerCase()) || 
                        defaultProduct.toLowerCase().includes(categorySelect.options[i].value.toLowerCase())) {
                        categorySelect.selectedIndex = i;
                        break;
                    }
                }
            }
        }

        if (defaultNotes) {
            const notesField = document.getElementById('rfqNotes');
            if (notesField) {
                notesField.value = defaultNotes;
            }
        }
    }

    function closeModal() {
        if (!rfqModal) return;
        rfqModal.classList.remove('active');
        document.body.style.overflow = '';
        if (rfqSuccess) rfqSuccess.style.display = 'none';
    }

    openRfqBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.getAttribute('data-product') || '';
            openModal(product);
        });
    });

    if (btnForwardRfq) {
        btnForwardRfq.addEventListener('click', () => {
            const gradeText = calcGrade ? calcGrade.options[calcGrade.selectedIndex].text : '';
            const weightVal = calcResultVal ? calcResultVal.innerText : '';
            const qty = calcQty ? calcQty.value : '1';
            
            const autoNote = `Calculated Requirement via Estimator:\nProduct Shape: ${currentShape.toUpperCase()}\nGrade: ${gradeText}\nQuantity: ${qty} units\nTheoretical Total: ${weightVal}`;
            
            let matchedCat = 'Structural Plates';
            if (currentShape === 'pipe') matchedCat = 'Pipes & Tubes';
            if (currentShape === 'coil') matchedCat = 'Steel Coils';
            
            openModal(matchedCat, autoNote);
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (rfqModal) {
        rfqModal.addEventListener('click', (e) => {
            if (e.target === rfqModal) {
                closeModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rfqModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 7. RFQ Form Submission Simulation
    if (rfqModalForm) {
        rfqModalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = rfqModalForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Transmitting to Mill Desk...</span>`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                if (rfqSuccess) {
                    rfqSuccess.style.display = 'block';
                }
                rfqModalForm.reset();

                setTimeout(() => {
                    closeModal();
                }, 3500);
            }, 1000);
        });
    }

});
