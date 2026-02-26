/**
 * Mobile Navigation Controller
 * Handles elegant mobile dropdown navigation with smooth animations
 */


console.log('Mobile Navigation: Script loading...', 'DOM state:', document.readyState);

function initMobileNavigation() {
    console.log('Mobile Navigation: Starting initialization...', 'DOM state:', document.readyState);
    
    // Check viewport width - only initialize on mobile screens
    const viewportWidth = window.innerWidth;
    const isMobileScreen = viewportWidth < 992; // Bootstrap lg breakpoint
    
    console.log('Mobile Navigation: Viewport check:', {
        width: viewportWidth,
        isMobileScreen: isMobileScreen,
        threshold: '< 992px (Bootstrap lg)'
    });
    
    if (!isMobileScreen) {
        console.log('Mobile Navigation: Desktop screen detected, skipping mobile nav initialization');
        return;
    }
    
    // Mobile Navigation Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavDropdown = document.getElementById('mobileNavDropdown');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const body = document.body;

    // Enhanced debug logging with comprehensive DOM structure check
    console.log('Mobile Navigation Elements Found:', {
        mobileMenuToggle: !!mobileMenuToggle,
        mobileNavDropdown: !!mobileNavDropdown,
        mobileNavBackdrop: !!mobileNavBackdrop,
        topbarExists: !!document.querySelector('.mobile-topbar')
    });
    
    // If elements not found, perform comprehensive DOM debugging
    if (!mobileMenuToggle || !mobileNavDropdown) {
        console.log('Mobile Navigation: Elements not found - performing DOM analysis...');
        
        // Check if main container exists
        const homebuyerPortal = document.querySelector('.homebuyer-portal');
        console.log('Mobile Navigation: DOM Structure Check:', {
            homebuyerPortalExists: !!homebuyerPortal,
            bodyChildren: document.body.children.length,
            allElementsWithId: Array.from(document.querySelectorAll('[id]')).map(el => el.id),
            mobileRelatedClasses: Array.from(document.querySelectorAll('[class*="mobile"]')).map(el => ({
                tagName: el.tagName,
                classes: el.className,
                id: el.id
            }))
        });
        
        // Check Bootstrap CSS loading
        const testElement = document.createElement('div');
        testElement.className = 'd-block d-lg-none';
        document.body.appendChild(testElement);
        const testStyle = window.getComputedStyle(testElement);
        console.log('Mobile Navigation: Bootstrap CSS Check:', {
            displayValue: testStyle.display,
            bootstrapWorking: testStyle.display === 'block' || testStyle.display === 'none'
        });
        document.body.removeChild(testElement);
        
        // Look for elements by alternative selectors
        const alternativeSelectors = [
            'button.hamburger-btn',
            '.mobile-nav-dropdown',
            'nav.mobile-topbar',
            '#mobileMenuToggle',
            '#mobileNavDropdown'
        ];
        
        console.log('Mobile Navigation: Alternative Selector Check:');
        alternativeSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`  ${selector}: ${elements.length} elements found`, 
                elements.length > 0 ? Array.from(elements).map(el => ({
                    id: el.id,
                    classes: el.className,
                    display: window.getComputedStyle(el).display
                })) : []
            );
        });
        
        // Check if we should create elements dynamically as a fallback
        console.log('Mobile Navigation: Elements not found, checking for dynamic creation fallback...');
        
        if (document.querySelector('.homebuyer-portal')) {
            console.log('Mobile Navigation: Main container exists, creating mobile navigation elements dynamically...');
            createMobileNavigationElements();
            return;
        } else {
            console.log('Mobile Navigation: Main container missing, starting polling...');
            pollForElements();
            return;
        }
    }
    
    // Check element visibility if they exist
    if (mobileMenuToggle) {
        const toggleStyle = window.getComputedStyle(mobileMenuToggle);
        console.log('Mobile Navigation: Toggle visibility:', {
            display: toggleStyle.display,
            visibility: toggleStyle.visibility,
            opacity: toggleStyle.opacity,
            computed: {
                width: toggleStyle.width,
                height: toggleStyle.height,
                position: toggleStyle.position
            }
        });
    }

    // Navigation state
    let isNavOpen = false;

    console.log('Mobile Navigation: Adding event listeners...');

    // Test if elements are visible
    const topbar = mobileMenuToggle.closest('.mobile-topbar');
    if (topbar) {
        console.log('Mobile Navigation: Topbar display:', window.getComputedStyle(topbar).display);
        console.log('Mobile Navigation: Topbar visibility:', window.getComputedStyle(topbar).visibility);
    }

    // Hamburger menu toggle
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Mobile Navigation: Hamburger clicked!');
        toggleMobileNav();
    });
    
    // Backdrop click to close
    mobileNavBackdrop?.addEventListener('click', closeMobileNav);
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isNavOpen) {
            closeMobileNav();
        }
    });

    // Handle expandable navigation items
    setupExpandableNavItems();
    
    // Handle navigation link clicks
    setupNavigationLinks();
    
    // Handle resize events
    window.addEventListener('resize', handleResize);

    // Add test function
    window.testMobileNav = function() {
        console.log('Testing mobile navigation...');
        if (mobileMenuToggle && mobileNavDropdown) {
            mobileMenuToggle.click();
            console.log('Mobile nav test completed - classes:', {
                hamburgerActive: mobileMenuToggle.classList.contains('active'),
                dropdownShow: mobileNavDropdown.classList.contains('show')
            });
        } else {
            console.error('Elements not found for mobile nav test');
        }
    };

    console.log('Mobile Navigation: Initialization completed successfully!');
    
    // Update user information in existing elements if they exist
    updateUserDisplayInExistingElements();
    
    // Set global initialization flag
    mobileNavInitialized = true;

    /**
     * Poll for elements if not found initially
     */
    function pollForElements() {
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds total
        
        const poll = setInterval(() => {
            attempts++;
            console.log(`Mobile Navigation: Polling attempt ${attempts}/${maxAttempts} (viewport: ${window.innerWidth}px)`);
            
            // Only continue polling on mobile screens
            if (window.innerWidth >= 992) {
                console.log('Mobile Navigation: Screen size changed to desktop, stopping polling');
                clearInterval(poll);
                return;
            }
            
            const toggle = document.getElementById('mobileMenuToggle');
            const dropdown = document.getElementById('mobileNavDropdown');
            
            if (toggle && dropdown) {
                // Additional check: ensure elements are actually visible
                const toggleStyle = window.getComputedStyle(toggle);
                const isVisible = toggleStyle.display !== 'none';
                
                console.log('Mobile Navigation: Elements found after polling!', {
                    elementsExist: true,
                    toggleVisible: isVisible,
                    display: toggleStyle.display
                });
                
                if (isVisible) {
                    clearInterval(poll);
                    initMobileNavigation(); // Recursive call now that elements exist and are visible
                    return;
                } else {
                    console.log('Mobile Navigation: Elements exist but are hidden, continuing polling...');
                }
            }
            
            if (attempts >= maxAttempts) {
                console.error('Mobile Navigation: Elements not found or not visible after polling attempts');
                clearInterval(poll);
            }
        }, 100);
    }

    /**
     * Toggle mobile navigation
     */
    function toggleMobileNav() {
        console.log('Mobile Navigation: Toggle called, current state:', isNavOpen);
        if (isNavOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    /**
     * Open mobile navigation
     */
    function openMobileNav() {
        console.log('Mobile Navigation: Opening...');
        isNavOpen = true;
        
        // Add classes for animations
        mobileMenuToggle.classList.add('active');
        mobileNavDropdown.classList.add('show');
        body.classList.add('mobile-nav-open');
        
        // Prevent body scroll
        body.style.overflow = 'hidden';
        
        console.log('Mobile Navigation: Classes added, dropdown should be visible');
        console.log('Mobile Navigation: Final classes:', {
            hamburger: mobileMenuToggle.className,
            dropdown: mobileNavDropdown.className,
            body: body.className
        });
        
        // Focus management
        trapFocus(mobileNavDropdown);
        
        // Animate navigation items
        animateNavigationItems(true);
    }

    /**
     * Close mobile navigation
     */
    function closeMobileNav() {
        console.log('Mobile Navigation: Closing...');
        isNavOpen = false;
        
        // Remove classes
        mobileMenuToggle.classList.remove('active');
        mobileNavDropdown.classList.remove('show');
        body.classList.remove('mobile-nav-open');
        
        // Restore body scroll
        body.style.overflow = '';
        
        // Return focus to toggle button
        mobileMenuToggle.focus();
        
        // Animate navigation items
        animateNavigationItems(false);
    }

    /**
     * Setup expandable navigation items (like Fact Find)
     */
    function setupExpandableNavItems() {
        const expandableToggles = document.querySelectorAll('.mobile-nav-toggle');
        
        expandableToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('data-target');
                const submenu = document.getElementById(targetId);
                const isExpanded = this.classList.contains('expanded');
                
                // Close all other expanded items first
                expandableToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.classList.remove('expanded');
                        const otherTargetId = otherToggle.getAttribute('data-target');
                        const otherSubmenu = document.getElementById(otherTargetId);
                        if (otherSubmenu) {
                            otherSubmenu.classList.remove('expanded');
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    this.classList.remove('expanded');
                    submenu?.classList.remove('expanded');
                } else {
                    this.classList.add('expanded');
                    submenu?.classList.add('expanded');

                    // Populate fact-find submenu if needed
                    if (targetId === 'mobile-fact-find') {
                        populateFactFindSubmenu(submenu);
                    }
                }
            });
        });
    }

    /**
     * Setup navigation link clicks
     */
    function setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.mobile-nav-link[data-element]');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetElement = this.getAttribute('data-element');

                // Close mobile navigation
                closeMobileNav();

                // Use hash-based routing for consistency
                setTimeout(() => {
                    try {
                        const sectionName = targetElement.replace('#', '');
                        window.location.hash = sectionName;
                    } catch (e) {
                        console.warn('Mobile Navigation: Cannot access location (CORS):', e);
                    }
                }, 300); // Wait for close animation
            });
        });
    }

    /**
     * Debounce timer for fact-find population
     */
    let factFindPopulateTimer = null;

    /**
     * Clear fact-find population flag (useful for debugging or forced refresh)
     */
    function clearFactFindPopulation() {
        const submenu = document.getElementById('mobile-fact-find');
        if (submenu) {
            submenu.removeAttribute('data-populated');
            submenu.innerHTML = '';
            console.log('Mobile Navigation: Fact-find population cleared');
        }
    }

    // Expose clear function globally for debugging
    window.clearFactFindPopulation = clearFactFindPopulation;

    /**
     * Populate fact-find submenu dynamically with duplicate prevention
     */
    function populateFactFindSubmenu(submenu) {
        if (!submenu) {
            console.log('Mobile Navigation: No submenu provided');
            return;
        }

        // Check if already populated to prevent duplicates
        if (submenu.getAttribute('data-populated') === 'true' && submenu.children.length > 0) {
            console.log('Mobile Navigation: Fact-find already populated, skipping...');
            return;
        }

        // Clear any existing debounce timer
        if (factFindPopulateTimer) {
            clearTimeout(factFindPopulateTimer);
        }

        // Debounce to prevent rapid successive calls
        factFindPopulateTimer = setTimeout(() => {
            console.log('Mobile Navigation: Starting fact-find submenu population...');

            // Get fact-find items from desktop sidebar
            const desktopFactFind = document.getElementById('fact-find');
            if (!desktopFactFind) {
                console.log('Mobile Navigation: Desktop fact-find not found');
                return;
            }

            const factFindItems = desktopFactFind.querySelectorAll('.sidebar-sub-item-1');
            console.log('Mobile Navigation: Found', factFindItems.length, 'fact-find items from desktop');

            if (factFindItems.length === 0) {
                console.log('Mobile Navigation: No fact-find items to populate');
                return;
            }

            // Clear existing content before populating
            submenu.innerHTML = '';

            // Track unique items to prevent duplicates
            const uniqueItems = new Map(); // Use href as key to deduplicate
            let processedCount = 0;
            let skippedCount = 0;

            factFindItems.forEach((item, index) => {
                const link = item.querySelector('a') || item;
                const href = link.getAttribute('href') || '#';
                const text = link.textContent?.trim() || '';
                const dataElement = link.getAttribute('data-element');

                console.log(`Mobile Navigation: Processing item ${index + 1}:`, { href, text, dataElement });

                // Skip empty text or already processed hrefs
                if (!text || uniqueItems.has(href)) {
                    console.log('Mobile Navigation: Skipping duplicate or empty item:', { href, text, reason: !text ? 'empty text' : 'duplicate href' });
                    skippedCount++;
                    return;
                }

                // Store this item as processed
                uniqueItems.set(href, { text, dataElement, item });
                processedCount++;

                // Check if this item has fact-find-display content
                const factFindDisplay = item.querySelector('.fact-find-display');

                const li = document.createElement('li');
                li.className = 'mobile-nav-item';

                if (factFindDisplay) {
                    // Create card structure for fact-find items with display content
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'mobile-fact-find-card';

                    // Create header with title
                    const headerDiv = document.createElement('div');
                    headerDiv.className = 'mobile-fact-find-header';

                    const a = document.createElement('a');
                    a.href = href;
                    a.className = 'mobile-nav-link mobile-fact-find-link';
                    if (dataElement) {
                        a.setAttribute('data-element', dataElement);
                    }

                    const span = document.createElement('span');
                    span.textContent = text;
                    a.appendChild(span);

                    headerDiv.appendChild(a);

                    // Create content area with fact-find display
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'mobile-fact-find-content';
                    contentDiv.innerHTML = factFindDisplay.innerHTML;


//                    cardDiv.appendChild(headerDiv);
                    cardDiv.appendChild(contentDiv);
                    li.appendChild(cardDiv);

//                    contentDiv.addEventListener('click', () => {
//                        window.location.href = href;
//                        closeMobileNav();
//                    });

                    // Add click handler to header link
                    contentDiv.addEventListener('click', function(e) {
                        e.preventDefault();
                        closeMobileNav();

                        setTimeout(() => {
                            try {
                                if (dataElement) {
                                    const sectionName = dataElement.replace('#', '');
                                    window.location.hash = sectionName;
                                } else {
                                    // Trigger original link click
                                    link.click();
                                }
                            } catch (e) {
                                console.warn('Mobile Navigation: Cannot access location (CORS):', e);
                            }
                        }, 300);
                    });
                } else {
                    // Regular nav item without card structure
                    const a = document.createElement('a');
                    a.href = href;
                    a.className = 'mobile-nav-link';
                    if (dataElement) {
                        a.setAttribute('data-element', dataElement);
                    }

                    const span = document.createElement('span');
                    span.textContent = text;
                    a.appendChild(span);

                    li.appendChild(a);

                    // Add click handler
                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        closeMobileNav();

                        setTimeout(() => {
                            try {
                                if (dataElement) {
                                    const sectionName = dataElement.replace('#', '');
                                    window.location.hash = sectionName;
                                } else {
                                    // Trigger original link click
                                    link.click();
                                }
                            } catch (e) {
                                console.warn('Mobile Navigation: Cannot access location (CORS):', e);
                            }
                        }, 300);
                    });
                }

                submenu.appendChild(li);
                console.log('Mobile Navigation: Added item:', text);
            });

            // Mark as populated to prevent future duplicates
            submenu.setAttribute('data-populated', 'true');
            console.log('Mobile Navigation: Fact-find submenu population completed', {
                totalItemsFound: factFindItems.length,
                processedItems: processedCount,
                skippedItems: skippedCount,
                finalCount: submenu.children.length
            });
        }, 100); // 100ms debounce delay
    }

    /**
     * Navigate to section programmatically
     */
    function navigateToSection(targetElement) {
        // Hide all sections
        const sections = document.querySelectorAll('.main > div[id]');
        sections.forEach(section => {
            section.classList.add('d-none');
        });
        
        // Show target section
        const target = document.querySelector(targetElement);
        if (target) {
            target.classList.remove('d-none');
        }
        
        // Update active states
        updateActiveStates(targetElement);
    }

    /**
     * Update active navigation states
     */
    function updateActiveStates(targetElement) {
        // Update desktop sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeDesktopLink = document.querySelector(`.sidebar-link[href="${targetElement}"]`);
        if (activeDesktopLink) {
            activeDesktopLink.classList.add('active');
        }
        
        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeMobileLink = document.querySelector(`.mobile-nav-link[data-element="${targetElement}"]`);
        if (activeMobileLink) {
            activeMobileLink.classList.add('active');
        }
    }

    /**
     * Animate navigation items on open/close
     */
    function animateNavigationItems(isOpening) {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach((item, index) => {
            if (isOpening) {
                item.style.transform = 'translateX(-20px)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.transform = 'translateX(0)';
                    item.style.opacity = '1';
                }, index * 50);
            } else {
                item.style.transition = 'all 0.2s ease';
                item.style.transform = 'translateX(-10px)';
                item.style.opacity = '0';
            }
        });
    }

    /**
     * Trap focus within mobile navigation
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile nav on desktop resize
        if (window.innerWidth >= 1024 && isNavOpen) {
            closeMobileNav();
        }
    }
}

/**
 * Get user information from various sources
 */
function getUserInfo() {
    let userName = 'User';
    let userAvatar = null;
    
    // Try to get user info from desktop sidebar first
    const desktopUserName = document.querySelector('.user-name');
    if (desktopUserName) {
        userName = desktopUserName.textContent?.trim() || userName;
        console.log('Mobile Navigation: User name extracted from desktop sidebar:', userName);
    }
    
    const desktopUserAvatar = document.querySelector('.small-avatar');
    if (desktopUserAvatar && desktopUserAvatar.src) {
        userAvatar = desktopUserAvatar.src;
        console.log('Mobile Navigation: User avatar extracted from desktop sidebar:', userAvatar);
    }
    
    // Try Odoo session if available
    if (typeof odoo !== 'undefined' && odoo.session_info) {
        if (odoo.session_info.name) {
            userName = odoo.session_info.name;
            console.log('Mobile Navigation: User name from Odoo session:', userName);
        }
        if (odoo.session_info.user_context && odoo.session_info.user_context.avatar) {
            userAvatar = odoo.session_info.user_context.avatar;
            console.log('Mobile Navigation: User avatar from Odoo session');
        }
    }
    
    // Fallback: try to extract from any existing user display elements
    if (userName === 'User') {
        const userElements = document.querySelectorAll('.user-name, .partner-name, .mobile-user-name, [class*="user"], [class*="partner"]');
        for (let element of userElements) {
            const text = element.textContent?.trim();
            if (text && text !== 'User' && text.length > 0) {
                userName = text;
                console.log('Mobile Navigation: User name from fallback element:', userName);
                break;
            }
        }
    }
    
    console.log('Mobile Navigation: Final user info:', { userName, hasAvatar: !!userAvatar });
    
    return { userName, userAvatar };
}

/**
 * Update user display in existing template elements
 */
function updateUserDisplayInExistingElements() {
    console.log('Mobile Navigation: Updating user info in existing elements...');
    
    const { userName, userAvatar } = getUserInfo();
    
    // Update mobile user name in template elements
    const mobileUserNames = document.querySelectorAll('.mobile-user-name');
    mobileUserNames.forEach(element => {
        if (element.textContent === 'User' || element.textContent.trim() === '') {
            element.textContent = userName;
            console.log('Mobile Navigation: Updated mobile user name to:', userName);
        }
    });
    
    // Update avatar placeholders with real avatars if available
    if (userAvatar) {
        const avatarPlaceholders = document.querySelectorAll('.mobile-avatar-placeholder, .topbar-avatar-placeholder');
        avatarPlaceholders.forEach(placeholder => {
            if (placeholder.closest('.mobile-user-avatar, .topbar-user')) {
                const img = document.createElement('img');
                img.src = userAvatar;
                img.className = placeholder.classList.contains('mobile-avatar-placeholder') ? 'mobile-avatar' : 'topbar-avatar';
                img.alt = 'User Avatar';
                placeholder.parentNode.replaceChild(img, placeholder);
                console.log('Mobile Navigation: Replaced avatar placeholder with real avatar');
            }
        });
    }
}

/**
 * Create mobile navigation elements dynamically if template doesn't render them
 */
function createMobileNavigationElements() {
    console.log('Mobile Navigation: Creating elements dynamically...');
    
    const homebuyerPortal = document.querySelector('.homebuyer-portal');
    if (!homebuyerPortal) {
        console.error('Mobile Navigation: Cannot create elements - homebuyer-portal container not found');
        return;
    }
    
    // Get real user information
    const { userName, userAvatar } = getUserInfo();
    
    // Create mobile topbar
    const mobileTopbar = document.createElement('nav');
    mobileTopbar.className = 'mobile-topbar d-block d-lg-none';
    
    // Build topbar avatar HTML
    let topbarAvatarHtml;
    if (userAvatar) {
        topbarAvatarHtml = `<img src="${userAvatar}" class="topbar-avatar" alt="User Avatar"/>`;
    } else {
        topbarAvatarHtml = `
            <div class="topbar-avatar-placeholder">
                <i class="fa fa-user"></i>
            </div>
        `;
    }
    
    mobileTopbar.innerHTML = `
        <div class="topbar-content">
            <button class="hamburger-btn" id="mobileMenuToggle" aria-label="Toggle navigation">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            <div class="topbar-logo">
                <a href="/my">
                    <img src="/bvs_homebuyer_portal/static/src/img/logo-bvs.png" alt="BVS Logo"/>
                </a>
            </div>
            <div class="topbar-user">
                ${topbarAvatarHtml}
            </div>
        </div>
    `;
    
    // Create mobile navigation dropdown
    const mobileNavDropdown = document.createElement('div');
    mobileNavDropdown.className = 'mobile-nav-dropdown d-block d-lg-none';
    mobileNavDropdown.id = 'mobileNavDropdown';
    
    // Build navigation panel avatar HTML
    let navAvatarHtml;
    if (userAvatar) {
        navAvatarHtml = `<img src="${userAvatar}" class="mobile-avatar" alt="User Avatar"/>`;
    } else {
        navAvatarHtml = `
            <div class="mobile-avatar-placeholder">
                <i class="fa fa-user fa-lg"></i>
            </div>
        `;
    }
    
    mobileNavDropdown.innerHTML = `
        <div class="mobile-nav-backdrop" id="mobileNavBackdrop"></div>
        <div class="mobile-nav-panel">
            <div class="mobile-nav-header">
                <div class="mobile-user-info">
                    <div class="mobile-user-avatar">
                        ${navAvatarHtml}
                    </div>
                    <div class="mobile-user-details">
                        <span class="mobile-user-name">${userName}</span>
                    </div>
                </div>
            </div>
//            <div class="mobile-nav-items">
//                <ul class="mobile-nav-list">
//                    <li class="mobile-nav-item">
//                        <a href="#home" class="mobile-nav-link" data-element="#home">
//                            <i class="fa fa-home"></i>
//                            <span>Home</span>
//                        </a>
//                    </li>
//                    <li class="mobile-nav-item mobile-nav-expandable">
//                        <a href="#" class="mobile-nav-link mobile-nav-toggle" data-target="mobile-fact-find">
//                            <i class="fa fa-hand-o-right"></i>
//                            <span>Fact Find</span>
//                            <i class="fa fa-chevron-right mobile-nav-arrow"></i>
//                        </a>
//                        <ul class="mobile-nav-submenu" id="mobile-fact-find"></ul>
//                    </li>
//                    <li class="mobile-nav-item">
//                        <a href="#portfolio" class="mobile-nav-link" data-element="#portfolio">
//                            <i class="fa fa-user"></i>
//                            <span>Portfolio</span>
//                        </a>
//                    </li>
//                    <li class="mobile-nav-item">
//                        <a href="#applications" class="mobile-nav-link" data-element="#applications">
//                            <i class="fa fa-bars"></i>
//                            <span>Applications</span>
//                        </a>
//                    </li>
//                    <li class="mobile-nav-item">
//                        <a href="#further_documents_2" class="mobile-nav-link" data-element="#further_documents_2">
//                            <i class="fa fa-file-text"></i>
//                            <span>Further Documents</span>
//                        </a>
//                    </li>
//                    <li class="mobile-nav-item">
//                        <a href="#initial_documents" class="mobile-nav-link" data-element="#initial_documents">
//                            <i class="fa fa-play"></i>
//                            <span>Initial Documents</span>
//                        </a>
//                    </li>
//                </ul>
//            </div>
        </div>
    `;
    
    // Insert elements at the beginning of homebuyer-portal
    homebuyerPortal.insertBefore(mobileTopbar, homebuyerPortal.firstChild);
    homebuyerPortal.insertBefore(mobileNavDropdown, homebuyerPortal.children[1]);
    
    console.log('Mobile Navigation: Dynamic elements created successfully');
    
    // Add basic mobile navigation styles if they don't exist
    addMobileNavigationStyles();
    
    // Now try to initialize again
    setTimeout(() => {
        console.log('Mobile Navigation: Attempting initialization with dynamic elements...');
        initMobileNavigation();
    }, 100);
}

/**
 * Add essential mobile navigation styles if CSS hasn't loaded properly
 */
function addMobileNavigationStyles() {
    // Check if styles already exist
    if (document.getElementById('mobile-nav-fallback-styles')) {
        return;
    }
    
    console.log('Mobile Navigation: Adding fallback styles...');
    
    const style = document.createElement('style');
    style.id = 'mobile-nav-fallback-styles';
    style.textContent = `
        .mobile-topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: #ffffff;
            border-bottom: 1px solid #e0e0e0;
            z-index: 1000;
        }
        
        .topbar-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 0 16px;
        }
        
        .hamburger-btn {
            background: none;
            border: none;
            width: 30px;
            height: 30px;
            position: relative;
            cursor: pointer;
        }
        
        .hamburger-line {
            display: block;
            width: 20px;
            height: 2px;
            background: #333;
            margin: 4px auto;
            transition: all 0.3s ease;
        }
        
        .mobile-nav-dropdown {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .mobile-nav-dropdown.show {
            visibility: visible;
            opacity: 1;
        }
        
        .mobile-nav-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .mobile-nav-panel {
            position: absolute;
            top: 0;
            left: 0;
            width: 80%;
            max-width: 300px;
            height: 100%;
            background: #ffffff;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .mobile-nav-dropdown.show .mobile-nav-panel {
            transform: translateX(0);
        }
        
        .mobile-nav-header {
            padding: 20px 16px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .mobile-nav-items {
            padding: 16px 0;
        }
        
        .mobile-nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .mobile-nav-link {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: #333;
            text-decoration: none;
        }
        
        .mobile-nav-link i {
            margin-right: 12px;
            width: 20px;
        }
        
        .topbar-avatar,
        .mobile-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .topbar-avatar-placeholder,
        .mobile-avatar-placeholder {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
        }
        
        .mobile-user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .mobile-user-details {
            flex: 1;
        }
        
        .mobile-user-name {
            font-weight: 500;
            color: #333;
        }
        
        @media (min-width: 992px) {
            .d-lg-none {
                display: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    console.log('Mobile Navigation: Fallback styles added');
}

// Global state tracking
let mobileNavInitialized = false;

// 🔹 Use the same pattern as form_ux.js for DOM ready detection
console.log('Mobile Navigation: Checking document ready state...', document.readyState);

if (document.readyState === "loading") {
    console.log('Mobile Navigation: DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener("DOMContentLoaded", initMobileNavigation);
} else {
    console.log('Mobile Navigation: DOM already loaded, initializing immediately...');
    initMobileNavigation();
}

// Additional fallback for window load
window.addEventListener('load', function() {
    console.log('Mobile Navigation: Window load event - checking if initialized...');
    if (!window.testMobileNav && window.innerWidth < 992) {
        console.log('Mobile Navigation: Not initialized on mobile screen, trying again...');
        initMobileNavigation();
    }
});

// DOM Mutation Observer to detect if elements are added dynamically
if (window.innerWidth < 992 && !mobileNavInitialized) {
    console.log('Mobile Navigation: Setting up mutation observer for dynamic elements...');
    
    const observer = new MutationObserver(function(mutations) {
        let elementsAdded = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if any added nodes contain our mobile navigation elements
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.id === 'mobileMenuToggle' || 
                            node.id === 'mobileNavDropdown' ||
                            node.querySelector && 
                            (node.querySelector('#mobileMenuToggle') || node.querySelector('#mobileNavDropdown'))) {
                            elementsAdded = true;
                        }
                    }
                });
            }
        });
        
        if (elementsAdded && !mobileNavInitialized) {
            console.log('Mobile Navigation: DOM mutation detected - mobile elements added, attempting initialization...');
            observer.disconnect(); // Stop observing once we find the elements
            setTimeout(() => initMobileNavigation(), 100); // Small delay to ensure elements are fully rendered
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Auto-disconnect observer after 10 seconds to prevent memory leaks
    setTimeout(() => {
        observer.disconnect();
        console.log('Mobile Navigation: Mutation observer auto-disconnected after timeout');
    }, 10000);
}

// Handle window resize - reinitialize or cleanup based on screen size
window.addEventListener('resize', function() {
    const isMobileScreen = window.innerWidth < 992;
    
    console.log('Mobile Navigation: Resize detected:', {
        width: window.innerWidth,
        isMobileScreen: isMobileScreen,
        currentlyInitialized: mobileNavInitialized
    });
    
    if (isMobileScreen && !mobileNavInitialized) {
        // Screen became mobile and nav not initialized
        console.log('Mobile Navigation: Screen became mobile, initializing...');
        initMobileNavigation();
    } else if (!isMobileScreen && mobileNavInitialized) {
        // Screen became desktop and nav is initialized  
        console.log('Mobile Navigation: Screen became desktop, cleaning up...');
        // Close any open mobile nav
        if (document.body.classList.contains('mobile-nav-open')) {
            document.body.classList.remove('mobile-nav-open');
            document.body.style.overflow = '';
        }
        mobileNavInitialized = false;
    }
});

/**
 * Public API for external access
 */
window.MobileNavigation = {
    init: initMobileNavigation
};