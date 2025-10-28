/**
 * Error Handler - Centralized error handling and user notifications
 * Provides consistent error messages and logging
 */
odoo.define('bvs_homebuyer_portal.error_handler', function(require) {
    'use strict';

    const ErrorHandler = {
        /**
         * Error types
         */
        ERROR_TYPES: {
            NETWORK: 'network',
            VALIDATION: 'validation',
            SERVER: 'server',
            CLIENT: 'client',
            PERMISSION: 'permission'
        },

        /**
         * Handle RPC error
         * @param {Error} error
         * @param {string} context - Context where error occurred
         * @param {boolean} showUser - Show error to user
         * @returns {Object} Normalized error object
         */
        handleRPCError(error, context = 'Unknown', showUser = true) {
            const errorObj = this._normalizeError(error);

            // Log to console
            console.error(`[${context}] RPC Error:`, {
                message: errorObj.message,
                type: errorObj.type,
                data: errorObj.data,
                stack: error.stack
            });

            // Show to user if requested
            if (showUser) {
                this.showErrorNotification(errorObj.userMessage, context);
            }

            return errorObj;
        },

        /**
         * Normalize error object
         * @private
         */
        _normalizeError(error) {
            let type = this.ERROR_TYPES.CLIENT;
            let message = 'An unexpected error occurred';
            let userMessage = 'Something went wrong. Please try again.';
            let data = null;

            if (!error) {
                return { type, message, userMessage, data };
            }

            // Network errors
            if (error.message && error.message.includes('Network')) {
                type = this.ERROR_TYPES.NETWORK;
                message = 'Network connection failed';
                userMessage = 'Network error. Please check your internet connection and try again.';
            }
            // Server errors (from Odoo RPC)
            else if (error.message && typeof error.message === 'object') {
                type = this.ERROR_TYPES.SERVER;
                message = error.message.message || error.message.data?.message || 'Server error';
                userMessage = 'Server error occurred. Please try again or contact support.';
                data = error.message.data;
            }
            // Validation errors
            else if (error.type === 'validation' || error.name === 'ValidationError') {
                type = this.ERROR_TYPES.VALIDATION;
                message = error.message || 'Validation failed';
                userMessage = error.message || 'Please check your input and try again.';
            }
            // Permission errors
            else if (error.message && error.message.includes('Access Denied')) {
                type = this.ERROR_TYPES.PERMISSION;
                message = 'Access denied';
                userMessage = 'You do not have permission to perform this action.';
            }
            // Generic error
            else if (error.message) {
                message = error.message;
                userMessage = 'An error occurred. Please try again.';
            }

            return { type, message, userMessage, data };
        },

        /**
         * Show error notification to user
         * @param {string} message
         * @param {string} title
         */
        showErrorNotification(message, title = 'Error') {
            // Try to use Odoo's notification system
            if (window.$ && $.notify) {
                $.notify({
                    message: message,
                    title: title
                }, {
                    type: 'danger',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay: 5000,
                    timer: 1000
                });
            }
            // Fallback to alert
            else {
                alert(`${title}: ${message}`);
            }
        },

        /**
         * Show success notification to user
         * @param {string} message
         * @param {string} title
         */
        showSuccessNotification(message, title = 'Success') {
            if (window.$ && $.notify) {
                $.notify({
                    message: message,
                    title: title
                }, {
                    type: 'success',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay: 3000,
                    timer: 1000
                });
            } else {
                // Less intrusive for success messages
                console.log(`${title}: ${message}`);
            }
        },

        /**
         * Show warning notification to user
         * @param {string} message
         * @param {string} title
         */
        showWarningNotification(message, title = 'Warning') {
            if (window.$ && $.notify) {
                $.notify({
                    message: message,
                    title: title
                }, {
                    type: 'warning',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay: 4000,
                    timer: 1000
                });
            } else {
                alert(`${title}: ${message}`);
            }
        },

        /**
         * Validate response data
         * @param {Object} response
         * @param {string} context
         * @returns {boolean}
         */
        validateResponse(response, context = 'Unknown') {
            if (!response) {
                console.error(`[${context}] Empty response received`);
                this.showErrorNotification('No data received from server', context);
                return false;
            }

            if (response.error) {
                console.error(`[${context}] Response contains error:`, response.error);
                this.showErrorNotification(response.error, context);
                return false;
            }

            if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
                console.error(`[${context}] Response contains validation errors:`, response.errors);
                this.showErrorNotification(response.errors.join(', '), context);
                return false;
            }

            return true;
        },

        /**
         * Create safe RPC wrapper
         * @param {Function} rpcFunc - Original _rpc function
         * @param {Object} params - RPC parameters
         * @param {string} context - Context description
         * @param {boolean} showErrors - Show errors to user
         * @returns {Promise}
         */
        safeRPC(rpcFunc, params, context = 'RPC Call', showErrors = true) {
            return new Promise((resolve, reject) => {
                rpcFunc(params)
                    .then((response) => {
                        if (this.validateResponse(response, context)) {
                            resolve(response);
                        } else {
                            reject(new Error(response.error || 'Invalid response'));
                        }
                    })
                    .catch((error) => {
                        const normalizedError = this.handleRPCError(error, context, showErrors);
                        reject(normalizedError);
                    });
            });
        }
    };

    return ErrorHandler;
});
