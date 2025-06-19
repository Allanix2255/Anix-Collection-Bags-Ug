// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');

    // Form submission handling
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!data[field] || data[field].trim() === '') {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById('email');
        if (data.email && !emailRegex.test(data.email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (isValid) {
            showSubmissionSuccess(data);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Initially hide all answers
        answer.style.display = 'none';
        
        question.addEventListener('click', function() {
            const isOpen = answer.style.display === 'block';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherQuestion = otherItem.querySelector('.faq-question');
                otherAnswer.style.display = 'none';
                otherQuestion.style.background = '#f8f8f8';
            });
            
            // Toggle current item
            if (!isOpen) {
                answer.style.display = 'block';
                question.style.background = '#e8e8e8';
                
                // Smooth scroll animation
                answer.style.opacity = '0';
                answer.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    answer.style.opacity = '1';
                    answer.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });

    // Form field validation functions
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    showFieldError(field, 'This field is required');
                    return false;
                }
                break;
                
            case 'email':
                if (!value) {
                    showFieldError(field, 'Email is required');
                    return false;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    showFieldError(field, 'Please select a subject');
                    return false;
                }
                break;
                
            case 'message':
                if (!value) {
                    showFieldError(field, 'Message is required');
                    return false;
                }
                if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }
        
        clearFieldError(field);
        return true;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        field.parentElement.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function showSubmissionSuccess(data) {
        // Create success modal
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 3rem;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 500px;
                    margin: 2rem;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;"><i class="fas fa-envelope" style="color: #d4af37;"></i></div>
                    <h2 style="color: #2c2c2c; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">Thank You!</h2>
                    <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                        Dear ${data.firstName}, your message has been received. Our team will respond within 24 hours.
                    </p>
                    <div style="background: #f8f8f8; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: left;">
                        <strong>Your inquiry:</strong><br>
                        <em>"${data.message.substring(0, 100)}${data.message.length > 100 ? '...' : ''}"</em>
                    </div>
                    <button onclick="this.closest('div').remove()" style="
                        background: #d4af37;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 1rem;
                    ">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Reset form
        contactForm.reset();
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }

    // Animate service items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe boutique info sections
    const boutiqueInfos = document.querySelectorAll('.boutique-info');
    boutiqueInfos.forEach((info, index) => {
        info.style.opacity = '0';
        info.style.transform = 'translateX(-30px)';
        info.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(info);
    });

    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .faq-answer {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
    }
    
    .submit-btn:hover {
        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }
`;
document.head.appendChild(style);
