{
    'name': 'BVS Data Capture Form',
    'version': '1.0',
    'category': '',
    'sequence': 1,
    'author': 'Nerosoft Solutions',
    'website': 'https://nerosoftsolutions.com/',
    'summary': 'BVS Data Capture Form',
    'description': """Create Fact Find & Manage KYC""",
    'depends': ['base', 'bvs_crm', 'bvs_fact_find', 'bvs_portal','portal_user_login_documents'],
    'data': [
        'security/ir.model.access.csv',
        'templates/client_portal_templates.xml',
        'templates/data_capture_form.xml',
        'templates/portal_user_documents_views.xml',

    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
