from odoo import models, fields, api

class DeleteApplicantWizard(models.TransientModel):
    _name = 'delete.applicant.wizard'
    _description = 'Delete Applicant Wizard'

    lead_id = fields.Many2one('bvs.lead', string='Lead', required=True)
    applicant_ids = fields.Many2many('res.partner', string='Applicants')

    @api.model
    def default_get(self, fields_list):
        res = super().default_get(fields_list)
        active_id = self.env.context.get('active_id')
        if active_id:
            lead = self.env['bvs.lead'].browse(active_id)
            res['lead_id'] = lead.id
            res['applicant_ids'] = [(6, 0, lead.applicant_ids.ids)]
        return res

    @api.onchange('lead_id')
    def _onchange_lead_id(self):
        """Restrict applicant_ids domain to applicants of the selected lead."""
        if self.lead_id:
            return {'domain': {'applicant_ids': [('id', 'in', self.lead_id.applicant_ids.ids)]}}
        return {'domain': {'applicant_ids': []}}

    def action_delete_selected(self):
        self.ensure_one()
        if not self.applicant_ids:
            return

        # Delete related fact find records for each selected applicant
        fact_finds_to_delete = self.lead_id.fact_find_ids.filtered(
            lambda ff: ff.partner_id in self.applicant_ids
        )
        if fact_finds_to_delete:
            fact_finds_to_delete.unlink()

        # Remove the selected applicants from the lead
        self.lead_id.applicant_ids = [(3, applicant.id) for applicant in self.applicant_ids]


