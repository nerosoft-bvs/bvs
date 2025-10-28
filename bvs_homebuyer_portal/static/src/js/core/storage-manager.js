/**
 * Storage Manager - Safe localStorage/sessionStorage handler with fallbacks
 * Handles privacy mode, storage quota errors, and provides consistent interface
 */
odoo.define('bvs_homebuyer_portal.storage_manager', function(require) {
    'use strict';

    const StorageManager = {
        /**
         * Storage availability flag
         */
        _storageAvailable: null,

        /**
         * Fallback in-memory storage
         */
        _memoryStorage: {},

        /**
         * Check if storage is available
         * @returns {boolean}
         */
        _checkStorageAvailable() {
            if (this._storageAvailable !== null) {
                return this._storageAvailable;
            }

            try {
                const testKey = '__storage_test__';
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);
                this._storageAvailable = true;
                return true;
            } catch (e) {
                console.warn('localStorage not available, using memory fallback:', e.message);
                this._storageAvailable = false;
                return false;
            }
        },

        /**
         * Safely set item in storage
         * @param {string} key
         * @param {string} value
         * @returns {boolean} Success status
         */
        setItem(key, value) {
            if (!key) {
                console.error('StorageManager: key is required');
                return false;
            }

            try {
                if (this._checkStorageAvailable()) {
                    localStorage.setItem(key, value);
                } else {
                    this._memoryStorage[key] = value;
                }
                return true;
            } catch (e) {
                console.error(`StorageManager: Failed to set ${key}:`, e.message);
                // Try memory fallback
                try {
                    this._memoryStorage[key] = value;
                    return true;
                } catch (fallbackError) {
                    console.error('StorageManager: Memory fallback also failed:', fallbackError);
                    return false;
                }
            }
        },

        /**
         * Safely get item from storage
         * @param {string} key
         * @returns {string|null}
         */
        getItem(key) {
            if (!key) {
                console.error('StorageManager: key is required');
                return null;
            }

            try {
                if (this._checkStorageAvailable()) {
                    return localStorage.getItem(key);
                } else {
                    return this._memoryStorage[key] || null;
                }
            } catch (e) {
                console.error(`StorageManager: Failed to get ${key}:`, e.message);
                // Try memory fallback
                return this._memoryStorage[key] || null;
            }
        },

        /**
         * Safely remove item from storage
         * @param {string} key
         * @returns {boolean} Success status
         */
        removeItem(key) {
            if (!key) {
                console.error('StorageManager: key is required');
                return false;
            }

            try {
                if (this._checkStorageAvailable()) {
                    localStorage.removeItem(key);
                } else {
                    delete this._memoryStorage[key];
                }
                return true;
            } catch (e) {
                console.error(`StorageManager: Failed to remove ${key}:`, e.message);
                try {
                    delete this._memoryStorage[key];
                    return true;
                } catch (fallbackError) {
                    return false;
                }
            }
        },

        /**
         * Clear all storage
         * @returns {boolean} Success status
         */
        clear() {
            try {
                if (this._checkStorageAvailable()) {
                    localStorage.clear();
                }
                this._memoryStorage = {};
                return true;
            } catch (e) {
                console.error('StorageManager: Failed to clear:', e.message);
                this._memoryStorage = {};
                return false;
            }
        }
    };

    return StorageManager;
});
