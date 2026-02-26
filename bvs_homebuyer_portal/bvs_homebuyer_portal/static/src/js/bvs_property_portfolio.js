odoo.define('bvs_homebuyer_portal.bvs_property_portfolio', function (require) {
    'use strict';

    var core = require('web.core');
    var Widget = require('web.Widget');
    var QWeb = core.qweb;

    var PortfolioWidget = Widget.extend({
        template: 'bvs_portal_portfolio',
        events: {
            'click .add-property-btn': '_onclickYourPropertiesAdd',
            'click .edit-property': '_onClickEditProperty',
            'click .delete-property': '_onClickDeleteProperty',
            'click .btn-save-your-properties': '_onclickYourPropertiesSaveCancel',
            'click .btn-cancel-your-properties': '_onclickYourPropertiesSaveCancel',
        },

        init: function(parent) {
            this._super.apply(this, arguments);
            this.properties = [];
            this.factFindId = null;
        },

        start: function() {
            var self = this;
            return this._super.apply(this, arguments).then(function() {
                return self._loadProperties();
            });
        },

        _loadProperties: function() {
            var self = this;
            return this._rpc({
                route: '/get/ff/your-properties',
                params: {
                    'your_properties_id': this.factFindId
                }
            }).then(function(properties) {
                self.properties = properties;
                self._renderProperties();
            });
        },

        _renderProperties: function() {
            var $content = this.$('.portfolio-content');
            if (this.properties.length === 0) {
                $content.html('<p>You don\'t have any properties yet.</p>');
                return;
            }

            $content.html(QWeb.render('bvs_portal_portfolio_items', {
                properties: this.properties,
                widget: this
            }));
        },

        _onclickYourPropertiesAdd: function(ev) {
            ev.preventDefault();
            var $form = this.$('.your-properties-form');
            $form.find('input[type="text"], input[type="number"], select, textarea').val('');
            $form.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            $form.find('#your_properties_id').val('new-your-properties');

            this.$('.portfolio-content').addClass('d-none');
            $form.removeClass('d-none').fadeIn(400);
        },

        _onclickYourPropertiesSaveCancel: function(ev) {
            ev.preventDefault();
            var self = this;
            var $form = this.$('.your-properties-form');
            var $content = this.$('.portfolio-content');

            if ($(ev.currentTarget).hasClass('btn-save-your-properties')) {
                var formData = {
                    property_usage: $form.find('select[name="property_usage_yep"]').val(),
                    house_number: $form.find('input[name="house_number_yep"]').val(),
                    postcode: $form.find('input[name="post_code_yep"]').val(),
                    street_address: $form.find('textarea[name="street_address_existing_properties"]').val(),
                    county: $form.find('input[name="county_yep"]').val(),
                    property_type: $form.find('select[name="property_type_yep"]').val(),
                    bedrooms: $form.find('input[name="bedrooms_yep"]').val(),
                    current_property_valuation: $form.find('input[name="current_property_valuation_yep"]').val(),
                    tenure: $form.find('select[name="tenure_yep"]').val(),
                    has_mortgage: $form.find('input[name="has_mortgage"]').is(':checked'),
                    ground_rent: $form.find('input[name="ground_rent"]').val(),
                    service_charge: $form.find('input[name="service_charge"]').val(),
                    first_let_date: $form.find('input[name="first_let_date"]').val(),
                    monthly_rental_income: $form.find('input[name="monthly_rental_income"]').val(),
                    is_hmo: $form.find('input[name="is_hmo_yep"]').is(':checked'),
                };

                this._rpc({
                    route: '/update/fact-find/your-properties',
                    params: {
                        fact_find_id: this.factFindId,
                        data: formData
                    }
                }).then(function() {
                    self._loadProperties();
                });
            }

            $form.addClass('d-none');
            $content.removeClass('d-none').fadeIn(400);
        },

        _onClickDeleteProperty: function(ev) {
            ev.preventDefault();
            var self = this;
            var propertyId = $(ev.currentTarget).data('property-id');

            if (confirm('Are you sure you want to delete this property?')) {
                this._rpc({
                    route: '/delete/fact-find/your-properties',
                    params: {
                        'your_properties_id': propertyId
                    }
                }).then(function() {
                    self._loadProperties();
                });
            }
        },

        formatCurrency: function(value) {
            return new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP'
            }).format(value);
        },
    });

    return PortfolioWidget;
});