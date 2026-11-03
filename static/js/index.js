// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');

    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';

            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Play rollout videos while they are in view; with reduced motion, show controls instead
function setupVideoAutoplay() {
    const videos = document.querySelectorAll('video.autoplay-video');
    if (videos.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        videos.forEach(video => { video.controls = true; });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(e => {
                    // Autoplay blocked by browser policy: fall back to manual playback
                    console.log('Autoplay prevented:', e);
                    video.controls = true;
                });
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });

    videos.forEach(video => {
        observer.observe(video);
        video.addEventListener('click', () => {
            if (video.paused) video.play(); else video.pause();
        });
    });
}

// Hover/focus tooltip for the result bar charts
function setupChartTooltips() {
    document.querySelectorAll('.viz-root').forEach(chart => {
        const tooltip = chart.querySelector('.viz-tooltip');
        if (!tooltip) return;
        const valueEl = tooltip.querySelector('.viz-tooltip-value');
        const nameEl = tooltip.querySelector('.viz-tooltip-name');

        function show(mark, x, y) {
            const sd = mark.dataset.sd;
            valueEl.textContent = mark.dataset.value + (sd !== undefined ? ' \u00b1 ' + sd : '');
            nameEl.textContent = mark.dataset.name;
            tooltip.hidden = false;

            const box = chart.getBoundingClientRect();
            const left = Math.min(x - box.left + 12, box.width - tooltip.offsetWidth - 4);
            tooltip.style.left = Math.max(4, left) + 'px';
            tooltip.style.top = (y - box.top - tooltip.offsetHeight - 10) + 'px';
        }

        function hide() {
            tooltip.hidden = true;
        }

        chart.querySelectorAll('.bc-hit').forEach(mark => {
            mark.addEventListener('pointermove', e => show(mark, e.clientX, e.clientY));
            mark.addEventListener('pointerleave', hide);
            mark.addEventListener('focus', () => {
                const r = mark.getBoundingClientRect();
                const bar = mark.querySelector('.bc-bar');
                const anchor = bar ? bar.getBoundingClientRect().right : r.left;
                show(mark, anchor, r.top + r.height / 2);
            });
            mark.addEventListener('blur', hide);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupVideoAutoplay();
    setupChartTooltips();
});
