odoo.define('portal_user_login_documents.portal', function (require) {
    'use strict';

    let publicWidget = require('web.public.widget');

    publicWidget.registry.bvsPortal = publicWidget.Widget.extend({
        selector: '.bvs_portal_home',

        /**
         * @override
         */
        start: async function () {
            const def = this._super.apply(this, arguments);
            this._rpc({
                route: '/get/portal/document/status',
                params: {},
            }).then(function (checkPortalUserDocuments) {
                if (checkPortalUserDocuments) {
                    $('#userDocuments').modal('show');
                }
                return def;
            })
        },


    });

})