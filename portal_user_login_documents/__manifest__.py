# -*- coding: utf-8 -*-

{
    "name": "Portal User Login Documents",
    'author': "NeroSoft Solutions",
    'website': "https://nerosoftsolutions.com/",
    "support": "info@nerosoftsolutions.com",
    "category": "Portal",
    "summary": "Verify the necessary documents once a user has logged into the portal",
    "description": "Verify the necessary documents once a user has logged into the portal",
    "version": "16.0.1.2.0",
    "depends": [
        'web',
        'base',
        'portal',
        'bvs_portal'
    ],
    "data": [
        'security/ir.model.access.csv',
        'views/portal_user_documents_views.xml',
        'views/res_config_settings_views.xml',
        'views/portal_user_documents_templates.xml',
        'views/res_users_views.xml',
        'views/webclient_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            # scss
            'portal_user_login_documents/static/src/scss/modal_portal_user_documents.scss',
            'portal_user_login_documents/static/src/scss/portal_user_documents.scss',
            # js
            'portal_user_login_documents/static/src/js/portal_user_documents.js',
            'portal_user_login_documents/static/src/js/portal.js',
        ],
    },
    "application": False,
    "auto_install": False,
    "installable": True,
    "license": 'LGPL-3'
}
