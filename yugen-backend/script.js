document.addEventListener('DOMContentLoaded', () => {
    if (window.contactFormEnhanced) return;
    
    const submitButton = document.getElementById('submit-contact');
    const formInputs = {
        fullName: document.getElementById('full-name'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        message: document.getElementById('message')
    };

    const originalButtonText = submitButton.textContent;

    submitButton.addEventListener('click', async () => {
        if (!formInputs.fullName.value || !formInputs.phone.value || !formInputs.email.value || !formInputs.message.value) {
            if (window.notify) {
                notify.warning('Missing Information', 'Please fill out all fields before submitting.');
            } else {
                alert('Please fill out all fields.');
            }
            return;
        }
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // POST request
        const data = {
            full_name: formInputs.fullName.value,
            phone: formInputs.phone.value,
            email: formInputs.email.value,
            message: formInputs.message.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                if (window.notify) {
                    notify.success('Message Sent!', 'We\'ll get back to you soon.');
                } else {
                    alert('Contact saved successfully!');
                }
                
                Object.values(formInputs).forEach(input => {
                    input.value = '';
                });
            } else {
                if (window.notify) {
                    notify.error('Submission Failed', result.error || 'Failed to send your message. Please try again.');
                } else {
                    alert(`Error: ${result.error || 'Failed to save contact'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (window.notify) {
                notify.error('Connection Error', 'Unable to send your message. Please check your connection and try again.');
            } else {
                alert('An error occurred while submitting the form. Please try again later.');
            }
        } finally {
            // Reset button
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 1000);
        }
    });
});

document.querySelectorAll('.project-image').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const index = img.getAttribute('data-index');
        const urls = {
            '0': 'gig.html',
            '1': 'house-of-horns.html',
            '2': 'smoke-lake-cabin.html',
            '3': 'pine-island-cottage.html'
        };
        window.location.href = urls[index];
    });
});

document.querySelectorAll('.tp-image').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const index = img.getAttribute('data-index');
                const urls = {
                    '0': 'gig.html',
                    '1': 'smoke-lake-cabin.html',
                    '2': 'pine-island-cottage.html'
                };
                window.location.href = urls[index];
            });
        });

document.addEventListener('DOMContentLoaded', function() {
    const mainProjectSections = document.querySelectorAll('.main-project');

    function setImageHeights() {
        mainProjectSections.forEach(section => {
            const projectDetails = section.querySelector('.project-details');
            const projectImage = section.querySelector('.project-main-image');
            const detailsHeight = projectDetails.offsetHeight;
            projectImage.style.height = `${detailsHeight}px`;
        });
    }

    setImageHeights();
    window.addEventListener('resize', setImageHeights);

    console.log('script.js loaded');
});