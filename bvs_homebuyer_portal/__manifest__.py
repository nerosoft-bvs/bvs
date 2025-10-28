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
        'views/bvs_fact_find_mortgage_templates.xml',
        'views/bvs_fact_find_templates.xml',
        'views/bvs_portfolio_templates.xml',
        'views/bvs_applications_templates.xml',
        'views/portal_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            # ============================================
            # PRODUCTION-OPTIMIZED ASSETS
            # ============================================

            # Core Utilities (MUST load first - order matters!)
            'bvs_homebuyer_portal/static/src/js/core/storage-manager.js',
            'bvs_homebuyer_portal/static/src/js/core/step-state.js',
            'bvs_homebuyer_portal/static/src/js/core/error-handler.js',
            'bvs_homebuyer_portal/static/src/js/core/dom-utils.js',

            # Main Widget (Choose ONE)
            # OPTION 1: Original version with safety wrapper (RECOMMENDED FOR NOW)
            'bvs_homebuyer_portal/static/src/js/bvs_homebuyer_portal.js',
            'bvs_homebuyer_portal/static/src/js/state_fix.js',  # Enhances built-in state restoration

            # OPTION 2: Optimized version (NOT READY - needs method migration)
            # 'bvs_homebuyer_portal/static/src/js/bvs_homebuyer_portal_optimized.js',

            # Other JavaScript modules

            # Fact Find Conditions (Choose ONE option)
            # OPTION 1: Original with safety wrapper (RECOMMENDED - no code changes needed)
            'bvs_homebuyer_portal/static/src/js/fact_find_conditions_wrapper.js',  # Load wrapper first
            'bvs_homebuyer_portal/static/src/js/fact_find_conditions.js',           # Then original

            # OPTION 2: Fully optimized version (requires method migration)
            # 'bvs_homebuyer_portal/static/src/js/fact_find_conditions_optimized.js',

            # Other modules
            'bvs_homebuyer_portal/static/src/js/bvs_property_portfolio.js',
            'bvs_homebuyer_portal/static/src/js/form_ux.js',  # Updated with error handling
            'bvs_homebuyer_portal/static/src/js/mobile_navigation.js',
            'bvs_homebuyer_portal/static/src/js/adverse_credit_questions.js',  # Inline adverse credit forms
            # 'bvs_homebuyer_portal/static/src/js/admin_notification.js',

            # SCSS Stylesheets
            'bvs_homebuyer_portal/static/src/scss/portal_my_home.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_my_documents.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_bvs_fact_find.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_portfolio.scss',
            'bvs_homebuyer_portal/static/src/scss/portal_applications.scss',
            'bvs_homebuyer_portal/static/src/css/ux_style.css',

            # Images
            'bvs_homebuyer_portal/static/src/img/background.png',
            'bvs_homebuyer_portal/static/src/img/navbar_bkg.jpg',
        ],
    },
    "application": False,
    "auto_install": False,
    "installable": True,
    "license": 'LGPL-3'
}
# -*- coding: utf-8 -*-
