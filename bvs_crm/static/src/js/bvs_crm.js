odoo.define('bvs_crm.bvs_crm', function (require) {
    'use strict';

    const core = require('web.core');
    const FormController = require('web.FormController');
    const _t = core._t;

    FormController.include({
        saveRecord: function (recordID) {
            const self = this;
            const res = this._super.apply(this, arguments);
            const model = this.model;
            const record = model.get(recordID);

            if (record && record.data && record.data.mobile) {
                const mobile = record.data.mobile;
                if (!/^\d{11}$/.test(mobile)) {
                    this.displayNotification({
                        title: _t('Validation Error'),
                        message: _t('The mobile number must have exactly 11 digits.'),
                        type: 'warning',
                    });
                    return Promise.reject();
                }
            }
            return res;
        },
    });
});
