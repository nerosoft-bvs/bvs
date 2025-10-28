/**
 * Fact Find Conditions Safety Wrapper
 *
 * This file can be loaded BEFORE fact_find_conditions.js to add safety features
 * without modifying the original file.
 *
 * Benefits:
 * - No need to modify original 2198-line file
 * - Adds global error handling
 * - Wraps jQuery selectors with safety checks
 * - Adds safe parsing helpers
 * - Can be removed to rollback to original
 *
 * Usage in __manifest__.py:
 * 'bvs_homebuyer_portal/static/src/js/fact_find_conditions_wrapper.js',  # Load first
 * 'bvs_homebuyer_portal/static/src/js/fact_find_conditions.js',         # Then original
 */

(function() {
    'use strict';

    console.log('Fact Find Conditions: Loading safety wrapper...');

    /**
     * Global error handler for uncaught errors
     */
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('fact_find_conditions')) {
            console.error('Fact Find Conditions: Uncaught error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
            // Prevent error from breaking the page
            event.preventDefault();
        }
    });

    /**
     * Safe jQuery wrapper
     * Wraps $ to add null checks and error handling
     */
    if (typeof $ !== 'undefined') {
        const original$ = $;

        // Store original functions
        const originalVal = $.fn.val;
        const originalChange = $.fn.change;
        const originalFind = $.fn.find;

        /**
         * Safe .val() with error handling
         */
        $.fn.val = function() {
            try {
                if (arguments.length === 0) {
                    // Getter
                    if (this.length === 0) {
                        console.warn('jQuery.val(): No elements found', this.selector);
                        return '';
                    }
                    return originalVal.apply(this, arguments);
                } else {
                    // Setter
                    if (this.length === 0) {
                        console.warn('jQuery.val(): No elements found to set value', this.selector);
                        return this;
                    }
                    return originalVal.apply(this, arguments);
                }
            } catch (e) {
                console.error('jQuery.val(): Error', e, this.selector);
                return arguments.length === 0 ? '' : this;
            }
        };

        /**
         * Safe .change() with error handling
         */
        $.fn.change = function() {
            try {
                if (this.length === 0) {
                    console.warn('jQuery.change(): No elements found', this.selector);
                    return this;
                }
                return originalChange.apply(this, arguments);
            } catch (e) {
                console.error('jQuery.change(): Error', e, this.selector);
                return this;
            }
        };

        /**
         * Safe .find() with null check
         */
        $.fn.find = function() {
            try {
                const result = originalFind.apply(this, arguments);
                if (result.length === 0 && arguments[0]) {
                    console.debug('jQuery.find(): No elements found for', arguments[0]);
                }
                return result;
            } catch (e) {
                console.error('jQuery.find(): Error', e, arguments[0]);
                return $();
            }
        };

        console.log('Fact Find Conditions: jQuery safety wrappers installed');
    }

    /**
     * Global safe parseFloat
     */
    window.safeParseFloat = function(value, defaultValue = 0) {
        try {
            if (value === null || value === undefined || value === '') {
                return defaultValue;
            }
            const parsed = parseFloat(value);
            return isNaN(parsed) ? defaultValue : parsed;
        } catch (e) {
            console.error('safeParseFloat: Error parsing', value, e);
            return defaultValue;
        }
    };

    /**
     * Global safe parseInt
     */
    window.safeParseInt = function(value, defaultValue = 0) {
        try {
            if (value === null || value === undefined || value === '') {
                return defaultValue;
            }
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? defaultValue : parsed;
        } catch (e) {
            console.error('safeParseInt: Error parsing', value, e);
            return defaultValue;
        }
    };

    /**
     * Global safe element value getter
     */
    window.safeGetElementValue = function(selector, defaultValue = '') {
        try {
            const element = document.querySelector(selector);
            if (!element) {
                console.debug('safeGetElementValue: Element not found', selector);
                return defaultValue;
            }
            return element.value || defaultValue;
        } catch (e) {
            console.error('safeGetElementValue: Error', selector, e);
            return defaultValue;
        }
    };

    /**
     * Global safe element value setter
     */
    window.safeSetElementValue = function(selector, value) {
        try {
            const element = document.querySelector(selector);
            if (!element) {
                console.debug('safeSetElementValue: Element not found', selector);
                return false;
            }
            element.value = value || '';
            return true;
        } catch (e) {
            console.error('safeSetElementValue: Error', selector, e);
            return false;
        }
    };

    /**
     * Global safe show/hide
     */
    window.safeShowElement = function(selector) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.remove('d-none', 'hidden');
                element.style.display = '';
                return true;
            }
            return false;
        } catch (e) {
            console.error('safeShowElement: Error', selector, e);
            return false;
        }
    };

    window.safeHideElement = function(selector) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('d-none');
                return true;
            }
            return false;
        } catch (e) {
            console.error('safeHideElement: Error', selector, e);
            return false;
        }
    };

    /**
     * Monkey-patch setTimeout to catch errors
     */
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        const safeCallback = function() {
            try {
                callback();
            } catch (e) {
                console.error('setTimeout: Caught error in callback:', e);
            }
        };
        return originalSetTimeout.call(window, safeCallback, delay);
    };

    /**
     * Monkey-patch addEventListener to catch errors in event handlers
     */
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const safeListener = function(event) {
            try {
                if (typeof listener === 'function') {
                    listener.call(this, event);
                } else if (listener && typeof listener.handleEvent === 'function') {
                    listener.handleEvent(event);
                }
            } catch (e) {
                console.error(`addEventListener: Caught error in ${type} handler:`, e, this);
            }
        };
        return originalAddEventListener.call(this, type, safeListener, options);
    };

    console.log('Fact Find Conditions: Safety wrapper loaded successfully');
    console.log('Available safe functions:', {
        safeParseFloat: 'window.safeParseFloat(value, default)',
        safeParseInt: 'window.safeParseInt(value, default)',
        safeGetElementValue: 'window.safeGetElementValue(selector, default)',
        safeSetElementValue: 'window.safeSetElementValue(selector, value)',
        safeShowElement: 'window.safeShowElement(selector)',
        safeHideElement: 'window.safeHideElement(selector)'
    });

})();
