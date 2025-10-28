# -*- coding: utf-8 -*-

{
    "name": "BVS Home Buyer Portal",
    'author': "NeroSoft Solutions",
    'website': "https://nerosoftsolutions.com/",
    "support": "info@nerosoftsolutions.com",
    "category": "Portal",
    "summary": "Customized portal view for BVS",
    "description": "Customized portal view for BVS",
    "version": "16.0.1.0.0",
    "depends": [
        'web',
        'portal',
        'bvs_document'
    ],
    "data": [
        'views/bvs_home_template.xml',
        'views/bvs_documents_templates.xml',
        'views/bvs_documents_templates.xml',
        'views/bvs_fact_find_templates.xml',
        'views/portal_templates.xml',
        'views/bvs_portfolio_templates.xml',
        'views/bvs_applications_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            # scss
            'bvs_homebuyer_portal/static/src/scss/portal_my_home.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_my_documents.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_bvs_fact_find.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_portfolio.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_applications.scss',
            'bvs_homebuyer_portal/static/src/css/ux_style.css',
            # js
            'bvs_homebuyer_portal/static/src/js/bvs_homebuyer_portal.js',
            'bvs_homebuyer_portal/static/src/js/fact_find_conditions.js',
            'bvs_homebuyer_portal/static/src/js/bvs_property_portfolio.js',
            'bvs_homebuyer_portal/static/src/js/form_ux.js',
            'bvs_homebuyer_portal/static/src/js/mobile_navigation.js',
            # 'bvs_homebuyer_portal/static/src/js/admin_notification.js',
            #img
            'bvs_homebuyer_portal/static/src/img/background.png',
            'bvs_homebuyer_portal/static/src/img/navbar_bkg.jpg',
        ],
    },
    "application": False,
    "auto_install": False,
    "installable": True,
    "license": 'LGPL-3'
}
