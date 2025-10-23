     1	// Smooth scrolling for anchor links
     2	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     3	    anchor.addEventListener('click', function (e) {
     4	        e.preventDefault();
     5	        const target = document.querySelector(this.getAttribute('href'));
     6	        if (target) {
     7	            target.scrollIntoView({
     8	                behavior: 'smooth',
     9	                block: 'start'
    10	            });
    11	        }
    12	    });
    13	});
    14	
    15	// Fade-in animation on scroll
    16	const observerOptions = {
    17	    threshold: 0.1,
    18	    rootMargin: '0px 0px -50px 0px'
    19	};
    20	
    21	const observer = new IntersectionObserver((entries) => {
    22	    entries.forEach(entry => {
    23	        if (entry.isIntersecting) {
    24	            entry.target.style.opacity = '1';
    25	            entry.target.style.transform = 'translateY(0)';
    26	        }
    27	    });
    28	}, observerOptions);
    29	
    30	// Apply fade-in to sections
    31	document.querySelectorAll('.video-card, .about-content, .contact-buttons').forEach(el => {
    32	    el.style.opacity = '0';
    33	    el.style.transform = 'translateY(30px)';
    34	    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    35	    observer.observe(el);
    36	});
    37	
    38	// Hide scroll indicator when scrolling
    39	let lastScrollTop = 0;
    40	const scrollIndicator = document.querySelector('.scroll-indicator');
    41	
    42	window.addEventListener('scroll', () => {
    43	    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    44	    
    45	    if (scrollTop > 100 && scrollIndicator) {
    46	        scrollIndicator.style.opacity = '0';
    47	        scrollIndicator.style.pointerEvents = 'none';
    48	    } else if (scrollIndicator) {
    49	        scrollIndicator.style.opacity = '1';
    50	        scrollIndicator.style.pointerEvents = 'auto';
    51	    }
    52	    
    53	    lastScrollTop = scrollTop;
    54	});
    55	
    56	// Video play/pause on viewport
    57	const videoObserver = new IntersectionObserver((entries) => {
    58	    entries.forEach(entry => {
    59	        const video = entry.target;
    60	        if (entry.isIntersecting) {
    61	            // Video is in viewport - let user control playback
    62	            video.setAttribute('data-in-view', 'true');
    63	        } else {
    64	            // Video is out of viewport - pause it
    65	            video.pause();
    66	            video.removeAttribute('data-in-view');
    67	        }
    68	    });
    69	}, {
    70	    threshold: 0.5
    71	});
    72	
    73	// Observe all videos
    74	document.querySelectorAll('video').forEach(video => {
    75	    videoObserver.observe(video);
    76	});
    77	
    78	// Add loading state for videos
    79	document.querySelectorAll('video').forEach(video => {
    80	    video.addEventListener('loadstart', () => {
    81	        const wrapper = video.closest('.video-wrapper');
    82	        if (wrapper) {
    83	            wrapper.style.background = '#000';
    84	        }
    85	    });
    86	
    87	    video.addEventListener('loadeddata', () => {
    88	        const wrapper = video.closest('.video-wrapper');
    89	        if (wrapper) {
    90	            wrapper.style.background = 'transparent';
    91	        }
    92	    });
    93	});
    94	
    95	// Parallax effect for hero section
    96	window.addEventListener('scroll', () => {
    97	    const scrolled = window.pageYOffset;
    98	    const hero = document.querySelector('.hero');
    99	    
   100	    if (hero && scrolled < window.innerHeight) {
   101	        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
   102	        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
   103	    }
   104	});
   105	
   106	// Add hover effect to CTA buttons
   107	document.querySelectorAll('.cta-button, .contact-button').forEach(button => {
   108	    button.addEventListener('mouseenter', function() {
   109	        this.style.transform = 'translateY(-3px) scale(1.02)';
   110	    });
   111	    
   112	    button.addEventListener('mouseleave', function() {
   113	        this.style.transform = 'translateY(0) scale(1)';
   114	    });
   115	});
   116	
   117	// Console welcome message
   118	console.log('%c✨ Welcome to Nadja\'s Dance Portfolio! ✨', 'font-size: 20px; color: #FF6B9D; font-weight: bold;');
   119	console.log('%c🌊 Bringing joy and energy from the beaches of Cyprus 🌊', 'font-size: 14px; color: #4ECDC4;');
   120	
   121	// Add Instagram link tracking
   122	document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
   123	    link.addEventListener('click', () => {
   124	        console.log('Instagram link clicked:', link.href);
   125	    });
   126	});
   127	
