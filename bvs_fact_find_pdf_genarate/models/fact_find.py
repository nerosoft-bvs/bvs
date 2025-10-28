from odoo import api, models, fields, _
import base64
from io import BytesIO


class FactFind(models.Model):
    _inherit = 'fact.find'
    _description = "Fact FInd"

    def generate_pdf_report(self):
        report_name = 'fact_find_report.pdf'
        pdf_content = self.env['ir.actions.report']._render_qweb_pdf('bvs_fact_find_pdf_genarate.action_pdf_genarate', [self.id])
        pdf_data = base64.b64encode(pdf_content[0])
        self.write({'pdf_report': pdf_data, 'report_name': report_name})

    pdf_report = fields.Binary('PDF Report')
    report_name = fields.Char('Report Name')