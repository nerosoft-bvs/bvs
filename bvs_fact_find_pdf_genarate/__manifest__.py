{
    'name': 'Fact Find PDF Generator',
    'version': '1.0',
    'category': '',
    'sequence': 1,
    'author': 'Nerosoft Solutions',
    'website': 'https://nerosoftsolutions.com/',
    'summary': '',
    'description': """Create Fact Find & Manage KYC""",
    'depends': ['base', 'bvs_crm','bvs_fact_find'],
    'data': [
        'security/ir.model.access.csv',
        'views/fact_find.xml',
        'views/fact_find_pdf.xml',
        'views/report_template.xml',


    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
