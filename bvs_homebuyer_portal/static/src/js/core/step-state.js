/**
 * Step State Manager - Manages navigation state with localStorage and URL sync
 * Provides safe state persistence across page reloads and navigation
 */
odoo.define('bvs_homebuyer_portal.step_state', function(require) {
    'use strict';

    const StorageManager = require('bvs_homebuyer_portal.storage_manager');

    const StepState = {
        /**
         * Storage keys
         */
        KEYS: {
            MAIN: 'bvs_active_main',
            PARENT: 'bvs_parent_el',
            NEXT: 'bvs_next_el',
            FF_ID: 'bvs_ff_id'
        },

        /**
         * Set navigation step and sync with URL
         * @param {Object} options
         * @param {string} options.main - Main section
         * @param {string} options.parentEl - Parent element
         * @param {string} options.nextEl - Next element
         * @param {number} options.ffId - Fact find ID
         */
        setStep({ main, parentEl = null, nextEl = null, ffId = null }) {
            try {
                // Save to storage
                if (main) StorageManager.setItem(this.KEYS.MAIN, main);
                if (parentEl) StorageManager.setItem(this.KEYS.PARENT, parentEl);
                if (nextEl) StorageManager.setItem(this.KEYS.NEXT, nextEl);
                if (ffId) StorageManager.setItem(this.KEYS.FF_ID, String(ffId));

                // Update URL parameters
                this._updateURL({ main, parentEl, nextEl, ffId });
            } catch (e) {
                console.error('StepState: Failed to set step:', e);
            }
        },

        /**
         * Get current step from storage
         * @returns {Object} Current step state
         */
        getStep() {
            try {
                return {
                    main: StorageManager.getItem(this.KEYS.MAIN),
                    parentEl: StorageManager.getItem(this.KEYS.PARENT),
                    nextEl: StorageManager.getItem(this.KEYS.NEXT),
                    ffId: StorageManager.getItem(this.KEYS.FF_ID)
                };
            } catch (e) {
                console.error('StepState: Failed to get step:', e);
                return {
                    main: null,
                    parentEl: null,
                    nextEl: null,
                    ffId: null
                };
            }
        },

        /**
         * Clear all step state
         */
        clearStep() {
            try {
                StorageManager.removeItem(this.KEYS.MAIN);
                StorageManager.removeItem(this.KEYS.PARENT);
                StorageManager.removeItem(this.KEYS.NEXT);
                StorageManager.removeItem(this.KEYS.FF_ID);

                // Clear URL params
                this._updateURL({});
            } catch (e) {
                console.error('StepState: Failed to clear step:', e);
            }
        },

        /**
         * Update URL parameters
         * @private
         */
        _updateURL({ main, parentEl, nextEl, ffId }) {
            try {
                const url = new URL(window.location);

                if (main) {
                    url.searchParams.set('step', main);
                } else {
                    url.searchParams.delete('step');
                }

                if (parentEl) {
                    url.searchParams.set('parentEl', parentEl);
                } else {
                    url.searchParams.delete('parentEl');
                }

                if (nextEl) {
                    url.searchParams.set('nextEl', nextEl);
                } else {
                    url.searchParams.delete('nextEl');
                }

                if (ffId) {
                    url.searchParams.set('ffId', String(ffId));
                } else {
                    url.searchParams.delete('ffId');
                }

                window.history.replaceState({}, '', url);
            } catch (e) {
                console.error('StepState: Failed to update URL:', e);
            }
        },

        /**
         * Get step from URL parameters (for initial load)
         * @returns {Object} Step state from URL
         */
        getStepFromURL() {
            try {
                const url = new URL(window.location);
                return {
                    main: url.searchParams.get('step'),
                    parentEl: url.searchParams.get('parentEl'),
                    nextEl: url.searchParams.get('nextEl'),
                    ffId: url.searchParams.get('ffId')
                };
            } catch (e) {
                console.error('StepState: Failed to get step from URL:', e);
                return {
                    main: null,
                    parentEl: null,
                    nextEl: null,
                    ffId: null
                };
            }
        }
    };

    return StepState;
});
