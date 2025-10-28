odoo.define('portal_user_login_documents.portal_user_documents', function (require) {
    'use strict';

    let publicWidget = require('web.public.widget');

    publicWidget.registry.portalUserDocuments = publicWidget.Widget.extend({
        selector: '#userDocuments',
        events: {
            'change .portal-user-document-chkbx': '_onChangeCheckbox',
            'click .btn-continue': '_onclickBtnContinue',
            'click .url-a' : '_onclickViewDocument'
        },

        /**
         * @private
         * preview the document when the user click on the document
         */
        _onclickViewDocument: function (ev) {
            ev.preventDefault()
            const url = ev.target.getAttribute('data-url');
            const key = ev.target.getAttribute('data-key');
            let landedView = $("div.landed-view");
            let embedPdf = $('.embed-pdf');
            let documentCheckedCheckbox = $('#document-' + key);
            const embedHtml = '<embed class="embed-pdf" src="' + url + '" type="application/pdf"/>';
            if (landedView. length === 0) {
                embedPdf.replaceWith(embedHtml)
            } else {
                landedView.replaceWith(embedHtml);
            }
            documentCheckedCheckbox.prop("disabled", false);
        },

        /**
         * @override
         * check the user is portal, approved documents or not
         */
        start: function () {
            this._rpc({
                route: '/get/user/documents',
                params: {},
            }).then(function (values) {
                $('.user-documents-description').text(values.description);
                let userDocuments = ''
                $.each(values.documents, function (key, value) {
                    userDocuments += '<div class="documents-form-group privacy-policy">\n' +
                        '                                <input class="input-checkbox portal-user-document-chkbx" disabled="" id="document-'+ key +'" type="checkbox"/>\n' +
                        '                                <label class="label-checkbox" for="document-'+ key +'">\n' +
                        '                                    I have read and agreed the <a class="url-a" id="url-a-'+ key +'" data-key="'+ key + '" data-url="'+ value[1] +'">'+ value[0] +'</a>\n' +
                        '                                </label>\n' +
                        '                            </div>\n'
                })
                $('.user-documents-agree').html(userDocuments);
            })
            return this._super.apply(this, arguments);
        },


        /**
         * @private
         * Check and visible continue button
         */
        _onChangeCheckbox: function (ev) {
            let $checkboxes = $('.portal-user-document-chkbx');
            let falseCheckBoxes = false;
            $checkboxes.each(function (el) {
                if (!$($checkboxes[el]).prop('checked')){
                    falseCheckBoxes = true;
                    return false;
                }
            })
            if (!falseCheckBoxes) {
                $('.user-document-modal-footer').removeClass('d-none');
            } else {
                $('.user-document-modal-footer').addClass('d-none');
            }
        },

        /**
         * @private
         * update the user and redirect to /my url
         */
        _onclickBtnContinue: function () {
            this._rpc({
                route: '/update/portal/document/status',
                params: {},
            }).then(function (redirectUrl) {
                window.location.href = redirectUrl.toString()
            })
        },

    });

});