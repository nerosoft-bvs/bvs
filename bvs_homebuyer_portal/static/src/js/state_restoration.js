/**
 * State Restoration Enhancement
 *
 * Adds functionality to restore user's position after page refresh
 * Saves and restores: main section, sub-section, fact find ID
 *
 * This file should load AFTER bvs_homebuyer_portal.js
 */
odoo.define('bvs_homebuyer_portal.state_restoration', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');
    const StorageManager = require('bvs_homebuyer_portal.storage_manager');

    // State management
    const StateManager = {
        KEYS: {
            MAIN_SECTION: 'bvs_current_main_section',
            SUB_SECTION: 'bvs_current_sub_section',
            FACT_FIND_ID: 'bvs_current_ff_id',
            SCROLL_POSITION: 'bvs_scroll_position'
        },

        /**
         * Save current state
         */
        saveState(mainSection, subSection, factFindId) {
            try {
                if (mainSection) {
                    StorageManager.setItem(this.KEYS.MAIN_SECTION, mainSection);
                    console.log('State saved - Main:', mainSection);
                }
                if (subSection) {
                    StorageManager.setItem(this.KEYS.SUB_SECTION, subSection);
                    console.log('State saved - Sub:', subSection);
                }
                if (factFindId) {
                    StorageManager.setItem(this.KEYS.FACT_FIND_ID, String(factFindId));
                    console.log('State saved - FF ID:', factFindId);
                }

                // Also save to URL for bookmarking
                this.updateURL(mainSection, subSection, factFindId);
            } catch (e) {
                console.error('State Restoration: Failed to save state:', e);
            }
        },

        /**
         * Get saved state
         */
        getState() {
            try {
                // Try URL first (for bookmarks/shared links)
                const urlState = this.getStateFromURL();
                if (urlState.mainSection) {
                    console.log('State restored from URL:', urlState);
                    return urlState;
                }

                // Fallback to storage
                const storageState = {
                    mainSection: StorageManager.getItem(this.KEYS.MAIN_SECTION),
                    subSection: StorageManager.getItem(this.KEYS.SUB_SECTION),
                    factFindId: StorageManager.getItem(this.KEYS.FACT_FIND_ID),
                    scrollPosition: parseInt(StorageManager.getItem(this.KEYS.SCROLL_POSITION) || '0')
                };

                if (storageState.mainSection) {
                    console.log('State restored from storage:', storageState);
                }

                return storageState;
            } catch (e) {
                console.error('State Restoration: Failed to get state:', e);
                return {};
            }
        },

        /**
         * Get state from URL parameters
         */
        getStateFromURL() {
            try {
                const url = new URL(window.location.href);
                return {
                    mainSection: url.searchParams.get('section'),
                    subSection: url.searchParams.get('subsection'),
                    factFindId: url.searchParams.get('ffid'),
                    scrollPosition: 0
                };
            } catch (e) {
                console.error('State Restoration: Failed to parse URL:', e);
                return {};
            }
        },

        /**
         * Update URL with current state
         */
        updateURL(mainSection, subSection, factFindId) {
            try {
                const url = new URL(window.location.href);

                if (mainSection) {
                    url.searchParams.set('section', mainSection);
                } else {
                    url.searchParams.delete('section');
                }

                if (subSection) {
                    url.searchParams.set('subsection', subSection);
                } else {
                    url.searchParams.delete('subsection');
                }

                if (factFindId) {
                    url.searchParams.set('ffid', factFindId);
                } else {
                    url.searchParams.delete('ffid');
                }

                window.history.replaceState({}, '', url);
            } catch (e) {
                console.error('State Restoration: Failed to update URL:', e);
            }
        },

        /**
         * Save scroll position
         */
        saveScrollPosition() {
            try {
                const scrollY = window.scrollY || window.pageYOffset;
                StorageManager.setItem(this.KEYS.SCROLL_POSITION, String(scrollY));
            } catch (e) {
                console.error('State Restoration: Failed to save scroll position:', e);
            }
        },

        /**
         * Clear state
         */
        clearState() {
            try {
                StorageManager.removeItem(this.KEYS.MAIN_SECTION);
                StorageManager.removeItem(this.KEYS.SUB_SECTION);
                StorageManager.removeItem(this.KEYS.FACT_FIND_ID);
                StorageManager.removeItem(this.KEYS.SCROLL_POSITION);
                console.log('State cleared');
            } catch (e) {
                console.error('State Restoration: Failed to clear state:', e);
            }
        }
    };

    // Extend the existing widget to add state restoration
    publicWidget.registry.bvsHomebuyerPortal.include({
        /**
         * Override start to add state restoration
         */
        start: function () {
            const self = this;
            return this._super.apply(this, arguments).then(function () {
                try {
                    console.log('State Restoration: Initializing...');
                    self._initializeStateRestoration();
                } catch (e) {
                    console.error('State Restoration: Initialization failed:', e);
                }
            });
        },

        /**
         * Initialize state restoration functionality
         */
        _initializeStateRestoration: function () {
            const self = this;

            // Restore state on page load
            setTimeout(function() {
                self._restoreState();
            }, 500); // Small delay to ensure DOM is ready

            // Save state on navigation
            this._setupStateTracking();

            // Save scroll position periodically
            this._setupScrollTracking();
        },

        /**
         * Restore saved state
         */
        _restoreState: function () {
            try {
                const state = StateManager.getState();

                if (!state.mainSection) {
                    console.log('State Restoration: No saved state found');
                    return;
                }

                console.log('State Restoration: Restoring state...', state);

                // Restore fact find ID if exists
                if (state.factFindId) {
                    this.factFindId = parseInt(state.factFindId);
                    const $form = $(".ff-personal-details-submit.ff-form");
                    if ($form.length) {
                        $form.attr("data-fact-find-id", state.factFindId);
                    }
                }

                // Restore main section
                this._restoreMainSection(state.mainSection);

                // Restore sub-section if exists
                if (state.subSection) {
                    setTimeout(() => {
                        this._restoreSubSection(state.subSection);
                    }, 300);
                }

                // Restore scroll position
                if (state.scrollPosition) {
                    setTimeout(() => {
                        window.scrollTo(0, state.scrollPosition);
                    }, 500);
                }

                console.log('State Restoration: State restored successfully');
            } catch (e) {
                console.error('State Restoration: Failed to restore state:', e);
            }
        },

        /**
         * Restore main section
         */
        _restoreMainSection: function (mainSection) {
            try {
                // Hide all sections
                $('.main-step-form').addClass('d-none');

                // Show the target section
                const $targetSection = $(mainSection);
                if ($targetSection.length) {
                    $targetSection.removeClass('d-none');

                    // Update sidebar active state
                    $('.sidebar-item').removeClass('active');
                    const $sidebarItem = $(`.sidebar-item[data-target="${mainSection}"]`);
                    if ($sidebarItem.length) {
                        $sidebarItem.addClass('active');
                    }

                    console.log('State Restoration: Main section restored:', mainSection);
                } else {
                    console.warn('State Restoration: Main section not found:', mainSection);
                }
            } catch (e) {
                console.error('State Restoration: Error restoring main section:', e);
            }
        },

        /**
         * Restore sub-section
         */
        _restoreSubSection: function (subSection) {
            try {
                // Hide all sub-sections in current main
                $('.sub-step-form').addClass('d-none');

                // Show the target sub-section
                const $targetSubSection = $(subSection);
                if ($targetSubSection.length) {
                    $targetSubSection.removeClass('d-none');

                    // Update sub-menu active state
                    $('.li_sub_step').removeClass('active');
                    const $subMenuItem = $(`.li_sub_step[data-target="${subSection}"]`);
                    if ($subMenuItem.length) {
                        $subMenuItem.addClass('active');
                    }

                    console.log('State Restoration: Sub-section restored:', subSection);
                } else {
                    console.warn('State Restoration: Sub-section not found:', subSection);
                }
            } catch (e) {
                console.error('State Restoration: Error restoring sub-section:', e);
            }
        },

        /**
         * Setup state tracking on navigation
         */
        _setupStateTracking: function () {
            const self = this;

            // Track main section clicks
            this.$el.on('click', '.sidebar-item', function (e) {
                try {
                    // Skip if this is the fact-find dropdown item (has collapse toggle inside)
                    if ($(this).hasClass('fact-find-item')) {
                        return; // Don't interfere with fact-find dropdown
                    }

                    const target = $(this).attr('data-target') || $(this).find('a').attr('href');
                    if (target && target.startsWith('#')) {
                        const mainSection = target;
                        StateManager.saveState(mainSection, null, self.factFindId);
                    }
                } catch (e) {
                    console.error('State Restoration: Error tracking main section:', e);
                }
            });

            // Track sub-section clicks
            this.$el.on('click', '.li_sub_step', function (e) {
                try {
                    const subTarget = $(this).attr('data-target') || $(this).find('a').attr('href');
                    const mainTarget = $('.sidebar-item.active').attr('data-target');

                    if (subTarget && subTarget.startsWith('#')) {
                        StateManager.saveState(mainTarget, subTarget, self.factFindId);
                    }
                } catch (e) {
                    console.error('State Restoration: Error tracking sub-section:', e);
                }
            });

            // Track fact find switching
            this.$el.on('click', '.sidebar-item .sidebar-link', function (e) {
                try {
                    // Skip if this is a collapse toggle (fact-find dropdown)
                    if ($(this).attr('data-bs-toggle') === 'collapse') {
                        return; // Don't interfere with Bootstrap collapse
                    }

                    const href = $(this).attr('href');
                    if (href && !isNaN(parseInt(href.replace('#', '')))) {
                        const ffId = parseInt(href.replace('#', ''));
                        const mainTarget = $('.sidebar-item.active').attr('data-target');
                        const subTarget = $('.li_sub_step.active').attr('data-target');
                        StateManager.saveState(mainTarget, subTarget, ffId);
                    }
                } catch (e) {
                    console.error('State Restoration: Error tracking fact find switch:', e);
                }
            });

            console.log('State Restoration: State tracking initialized');
        },

        /**
         * Setup scroll position tracking
         */
        _setupScrollTracking: function () {
            let scrollTimeout;
            $(window).on('scroll', function () {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function () {
                    StateManager.saveScrollPosition();
                }, 250); // Debounce scroll events
            });

            console.log('State Restoration: Scroll tracking initialized');
        },

        /**
         * Clear state when user logs out or goes to home
         */
        _onclickHomeContinue: function (ev) {
            try {
                StateManager.clearState();
                this._super.apply(this, arguments);
            } catch (e) {
                if (this._super) {
                    this._super.apply(this, arguments);
                }
            }
        }
    });

    console.log('State Restoration: Module loaded successfully');

    return StateManager;
});
