/**
 * DOM Utilities - Safe DOM manipulation and querying
 * Provides null-safe DOM operations with proper error handling
 */
odoo.define('bvs_homebuyer_portal.dom_utils', function(require) {
    'use strict';

    const DOMUtils = {
        /**
         * Safely query selector
         * @param {string} selector
         * @param {Element} context
         * @returns {Element|null}
         */
        querySelector(selector, context = document) {
            if (!selector) {
                console.warn('DOMUtils: Empty selector provided');
                return null;
            }

            try {
                return context.querySelector(selector);
            } catch (e) {
                console.error(`DOMUtils: Invalid selector "${selector}":`, e);
                return null;
            }
        },

        /**
         * Safely query all selectors
         * @param {string} selector
         * @param {Element} context
         * @returns {NodeList|Array}
         */
        querySelectorAll(selector, context = document) {
            if (!selector) {
                console.warn('DOMUtils: Empty selector provided');
                return [];
            }

            try {
                const elements = context.querySelectorAll(selector);
                return elements || [];
            } catch (e) {
                console.error(`DOMUtils: Invalid selector "${selector}":`, e);
                return [];
            }
        },

        /**
         * Safely get element value
         * @param {string|Element} element
         * @returns {string}
         */
        getValue(element) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el) {
                console.warn('DOMUtils: Element not found for getValue');
                return '';
            }

            return el.value || '';
        },

        /**
         * Safely set element value
         * @param {string|Element} element
         * @param {string} value
         * @returns {boolean} Success status
         */
        setValue(element, value) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el) {
                console.warn('DOMUtils: Element not found for setValue');
                return false;
            }

            try {
                el.value = value || '';
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to set value:', e);
                return false;
            }
        },

        /**
         * Safely add class
         * @param {string|Element} element
         * @param {string} className
         * @returns {boolean} Success status
         */
        addClass(element, className) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !className) {
                return false;
            }

            try {
                el.classList.add(className);
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to add class:', e);
                return false;
            }
        },

        /**
         * Safely remove class
         * @param {string|Element} element
         * @param {string} className
         * @returns {boolean} Success status
         */
        removeClass(element, className) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !className) {
                return false;
            }

            try {
                el.classList.remove(className);
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to remove class:', e);
                return false;
            }
        },

        /**
         * Safely toggle class
         * @param {string|Element} element
         * @param {string} className
         * @returns {boolean} Success status
         */
        toggleClass(element, className) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !className) {
                return false;
            }

            try {
                el.classList.toggle(className);
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to toggle class:', e);
                return false;
            }
        },

        /**
         * Check if element has class
         * @param {string|Element} element
         * @param {string} className
         * @returns {boolean}
         */
        hasClass(element, className) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !className) {
                return false;
            }

            try {
                return el.classList.contains(className);
            } catch (e) {
                console.error('DOMUtils: Failed to check class:', e);
                return false;
            }
        },

        /**
         * Safely show element
         * @param {string|Element} element
         * @returns {boolean} Success status
         */
        show(element) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el) {
                return false;
            }

            try {
                el.style.display = '';
                this.removeClass(el, 'd-none');
                this.removeClass(el, 'hidden');
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to show element:', e);
                return false;
            }
        },

        /**
         * Safely hide element
         * @param {string|Element} element
         * @returns {boolean} Success status
         */
        hide(element) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el) {
                return false;
            }

            try {
                this.addClass(el, 'd-none');
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to hide element:', e);
                return false;
            }
        },

        /**
         * Safely get attribute
         * @param {string|Element} element
         * @param {string} attr
         * @returns {string|null}
         */
        getAttribute(element, attr) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !attr) {
                return null;
            }

            try {
                return el.getAttribute(attr);
            } catch (e) {
                console.error('DOMUtils: Failed to get attribute:', e);
                return null;
            }
        },

        /**
         * Safely set attribute
         * @param {string|Element} element
         * @param {string} attr
         * @param {string} value
         * @returns {boolean} Success status
         */
        setAttribute(element, attr, value) {
            const el = typeof element === 'string' ? this.querySelector(element) : element;

            if (!el || !attr) {
                return false;
            }

            try {
                el.setAttribute(attr, value);
                return true;
            } catch (e) {
                console.error('DOMUtils: Failed to set attribute:', e);
                return false;
            }
        },

        /**
         * Wait for element to exist
         * @param {string} selector
         * @param {number} timeout - Timeout in milliseconds
         * @returns {Promise<Element>}
         */
        waitForElement(selector, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const element = this.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                const observer = new MutationObserver((mutations, obs) => {
                    const element = this.querySelector(selector);
                    if (element) {
                        obs.disconnect();
                        clearTimeout(timeoutId);
                        resolve(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                const timeoutId = setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
                }, timeout);
            });
        },

        /**
         * Safely parse integer from element
         * @param {string|Element} element
         * @param {number} defaultValue
         * @returns {number}
         */
        getIntValue(element, defaultValue = 0) {
            const value = this.getValue(element);
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? defaultValue : parsed;
        },

        /**
         * Safely parse float from element
         * @param {string|Element} element
         * @param {number} defaultValue
         * @returns {number}
         */
        getFloatValue(element, defaultValue = 0.0) {
            const value = this.getValue(element);
            const parsed = parseFloat(value);
            return isNaN(parsed) ? defaultValue : parsed;
        }
    };

    return DOMUtils;
});
