/**
 * State Restoration Fix - Direct localStorage approach
 *
 * Simple solution: Save section/subsection on click, restore on page load
 * Uses direct localStorage (no StepState dependency)
 */
odoo.define('bvs_homebuyer_portal.state_fix', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');
    const StorageManager = require('bvs_homebuyer_portal.storage_manager');

    // Simple state keys
    const STATE_KEYS = {
        MAIN: 'bvs_last_main_section',
        SUB: 'bvs_last_sub_section',
        FF_ID: 'bvs_last_ff_id'
    };

    // Extend the existing widget
    publicWidget.registry.bvsHomebuyerPortal.include({
        /**
         * Override start to add restoration
         */
        start: function () {
            const self = this;
            return this._super.apply(this, arguments).then(function() {
                // Restore state after a short delay (let original widget load first)
                setTimeout(function() {
                    self._restoreLastSection();
                }, 500);
            });
        },

        /**
         * Restore last visited section
         */
        _restoreLastSection: function() {
            try {
                const mainSection = StorageManager.getItem(STATE_KEYS.MAIN);
                const subSection = StorageManager.getItem(STATE_KEYS.SUB);
                const ffId = StorageManager.getItem(STATE_KEYS.FF_ID);

                console.log('State Fix: Checking saved state:', { mainSection, subSection, ffId });

                // Only restore if we're on home page (no specific navigation yet)
                const currentHash = window.location.hash.replace('#', '');
                if (currentHash && currentHash !== 'home') {
                    console.log('State Fix: Already navigated to:', currentHash);
                    return;
                }

                if (!mainSection) {
                    console.log('State Fix: No saved state found');
                    return;
                }

                console.log('State Fix: Restoring to:', mainSection, '→', subSection);

                // Restore fact find ID if exists
                if (ffId) {
                    this.factFindId = parseInt(ffId);
                    $(`.sub_item_${ffId}`).click();
                }

                // Click main menu
                const $mainMenuItem = $(`.li_main_step[data-id='${mainSection}']`);
                if ($mainMenuItem.length) {
                    $mainMenuItem.click();

                    // Click sub-menu after main loads
                    if (subSection) {
                        setTimeout(() => {
                            const $subMenuItem = $(`.li_sub_step[data-id='${subSection}']`);
                            if ($subMenuItem.length) {
                                $subMenuItem.click();
                                console.log('State Fix: ✅ Restored to', mainSection, '→', subSection);
                            }
                        }, 300);
                    }
                } else {
                    console.warn('State Fix: Main section not found:', mainSection);
                }
            } catch (e) {
                console.error('State Fix: Error restoring state:', e);
            }
        },

        /**
         * Override main step click to save state
         */
        _onclickMainStep: function(el, savedSubstep) {
            try {
                // Call original method
                const result = this._super.apply(this, arguments);

                // Save main section
                const mainId = $(el.currentTarget).attr('data-id');
                if (mainId) {
                    StorageManager.setItem(STATE_KEYS.MAIN, mainId);
                    StorageManager.removeItem(STATE_KEYS.SUB); // Clear sub when changing main
                    console.log('State Fix: Saved main section:', mainId);
                }

                return result;
            } catch (e) {
                console.error('State Fix: Error in _onclickMainStep:', e);
                return this._super ? this._super.apply(this, arguments) : undefined;
            }
        },

        /**
         * Override sub-step click to save state
         */
        _onclickSubStep: function(el) {
            try {
                // Call original method first
                const result = this._super.apply(this, arguments);

                // Save sub-section
                const subId = $(el.currentTarget).attr('data-id');
                const mainId = $('.li_main_step.active').attr('data-id');

                if (subId && mainId) {
                    StorageManager.setItem(STATE_KEYS.SUB, subId);
                    StorageManager.setItem(STATE_KEYS.MAIN, mainId); // Update main too
                    console.log('State Fix: Saved', mainId, '→', subId);
                }

                return result;
            } catch (e) {
                console.error('State Fix: Error in _onclickSubStep:', e);
                return this._super ? this._super.apply(this, arguments) : undefined;
            }
        },

        /**
         * Override fact find switching to save FF ID
         */
        _onclickFFSubItem: function(el) {
            try {
                const result = this._super.apply(this, arguments);

                // Save fact find ID
                const ffId = $(el.currentTarget).attr('data-id');
                if (ffId) {
                    StorageManager.setItem(STATE_KEYS.FF_ID, ffId);
                    console.log('State Fix: Saved FF ID:', ffId);
                }

                return result;
            } catch (e) {
                console.error('State Fix: Error in _onclickFFSubItem:', e);
                return this._super ? this._super.apply(this, arguments) : undefined;
            }
        },

        /**
         * Clear state when going home
         */
        _onclickHomeContinue: function(ev) {
            try {
                StorageManager.removeItem(STATE_KEYS.MAIN);
                StorageManager.removeItem(STATE_KEYS.SUB);
                console.log('State Fix: Cleared state (going home)');
            } catch (e) {
                console.error('State Fix: Error clearing state:', e);
            }

            // Call original
            if (this._super) {
                return this._super.apply(this, arguments);
            }
        }
    });

    console.log('State Fix: Module loaded (direct localStorage approach)');

    return true;
});
