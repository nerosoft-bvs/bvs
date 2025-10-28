{
    'name': 'BVS Customer Portal',
    'version': '1.0',
    'category': '',
    'sequence': 1,
    'author': 'Nerosoft Solutions',
    'website': 'https://nerosoftsolutions.com/',
    'summary': 'Customer Portal',
    'description': """Customer Portal""",
    'depends': ['base', 'web', 'mail', 'website', 'portal', 'bvs_crm'],
    'data': [
        'security/ir.model.access.csv',
        'views/application_portal_templates.xml',
        # 'views/applicants_form_portal_templates.xml',
        'views/client_portal_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'bvs_portal/static/src/css/client_portal.scss',
        ],
    },

    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
