{
    'name': 'Advisor Approval',
    'version': '1.0',
    'category': '',
    'sequence': 1,
    'author': 'Nerosoft Solutions',
    'website': 'https://nerosoftsolutions.com/',
    'summary': '',
    'description': """Create Fact Find & Manage KYC""",
    'depends': ['base', 'bvs_crm'],
    'data': [
        'security/ir.model.access.csv',
        'wizard/advisor_approval.xml',
        'views/bvs_lead.xml',
        # 'views/res_users.xml',

    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
