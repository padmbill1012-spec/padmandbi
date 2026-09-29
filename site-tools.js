(() => {
    const navbar = document.querySelector('#navbar');

    if (navbar) {
        const navList = navbar.querySelector('ul');
        if (navList && !navList.querySelector('a[href="past-events.html"]')) {
            const pastEvents = document.createElement('li');
            pastEvents.innerHTML = '<a href="past-events.html">Past Events & Tickets</a>';
            navList.append(pastEvents);
        }
    }

    if (navbar && !navbar.querySelector('.site-search')) {
        const search = document.createElement('form');
        search.className = 'site-search';
        search.action = 'https://www.google.com/search';
        search.method = 'get';
        search.target = '_blank';
        search.setAttribute('role', 'search');
        search.innerHTML = '<label class="visually-hidden" for="site-search-input">Search this website</label>' +
            '<input id="site-search-input" type="search" name="q" placeholder="Search services, events" required>' +
            '<input type="hidden" name="sitesearch" value="padmandbill.com">' +
            '<button type="submit">Search</button>';
        navbar.append(search);
    }

    if (!navbar && !document.querySelector('.site-search')) {
        const search = document.createElement('form');
        search.className = 'site-search';
        search.action = 'https://www.google.com/search';
        search.method = 'get';
        search.target = '_blank';
        search.setAttribute('role', 'search');
        search.innerHTML = '<label class="visually-hidden" for="site-search-input">Search this website</label>' +
            '<input id="site-search-input" type="search" name="q" placeholder="Search services, events" required>' +
            '<input type="hidden" name="sitesearch" value="padmandbill.com">' +
            '<button type="submit">Search</button>';
        document.querySelector('.container')?.prepend(search);
    }

    if (!document.querySelector('.floating-contact')) {
        const contacts = document.createElement('div');
        contacts.className = 'floating-contact';
        contacts.setAttribute('aria-label', 'Quick contact');
        contacts.innerHTML = '<a class="whatsapp-link" href="https://wa.me/916395279991?text=Namaste%20PADM%26BILL%2C%20mujhe%20event%20ke%20liye%20quote%20chahiye." target="_blank" rel="noopener noreferrer" aria-label="Chat with PADM&BILL on WhatsApp">WhatsApp</a>' +
            '<a class="call-link" href="tel:+916395279991" aria-label="Call PADM&BILL">Call now</a>';
        document.body.append(contacts);
    }

    const servicePages = {
        '/weddings.html': 'Wedding Planning',
        '/corporate.html': 'Corporate Events',
        '/parties.html': 'Birthday Decoration & Parties',
        '/festivals.html': 'Festival Events',
        '/consultancy.html': 'Event Consultancy'
    };
    const serviceName = servicePages[window.location.pathname.toLowerCase()];
    let footer = document.querySelector('footer');

    if (!footer) {
        footer = document.createElement('footer');
        document.body.append(footer);
    }

    if (!footer.querySelector('.company-signoff')) {
        const signoff = document.createElement('div');
        signoff.className = 'company-signoff';
        signoff.innerHTML = '<strong>PADM&amp;BILL (OPC) PRIVATE LIMITED</strong>' +
            '<span>Since 2025</span>' +
            '<a href="https://wa.me/916395279991" target="_blank" rel="noopener noreferrer">WhatsApp 6395279991</a>';
        footer.append(signoff);
    }

    if (serviceName && footer && !document.querySelector('.site-faq')) {
        const serviceEnd = document.createElement('div');
        serviceEnd.innerHTML = '<section class="site-faq" aria-labelledby="booking-faq-title">' +
            '<h2 id="booking-faq-title">Booking FAQs</h2>' +
            '<details><summary>What is the booking process?</summary><p>Share your event type, date, and location. Our team will discuss your requirements, confirm availability, and send a written quote. Your booking is confirmed after you accept the quote and the agreed advance is received.</p></details>' +
            '<details><summary>How much advance payment is required?</summary><p>The advance amount depends on the event scope and is stated in your written quote before you confirm. No fixed amount is assumed before we review your requirements.</p></details>' +
            '<details><summary>What is the cancellation policy?</summary><p>Cancellation terms depend on the services booked and are shared in the written quote or agreement before payment.</p></details>' +
            '<details><summary>Which areas do you serve?</summary><p>We are based in Dehradun and serve events across Uttarakhand. Service outside the region is considered subject to event requirements and availability.</p></details>' +
            '</section><section class="service-quote-cta"><h2>Planning ' + serviceName + ' in Dehradun or Uttarakhand?</h2>' +
            '<p>Tell us your event date and location to get a tailored quote.</p>' +
            '<a href="index.html#contact">Get a Quote</a></section>';
        footer.before(serviceEnd);
    }
})();