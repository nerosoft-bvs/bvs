from odoo import api, models, fields, _


class ResPartner(models.Model):
    _inherit = 'res.partner'

    first_name = fields.Char('First Name', compute='_compute_first_last_name')
    last_name = fields.Char('Last Name', compute='_compute_first_last_name')
    lead_count = fields.Integer("No of My Leads", compute='_compute_lead_count')
    #lead_ids = fields.One2many('bvs.lead', 'partner_id', string='My Leads')
    lead_ids = fields.Many2many(
        'bvs.lead',
        'partner_lead_rel',
        'partner_id',
        'lead_id',
        string="My Leads"
    )
    reference_lead_count = fields.Integer("No of Reference Leads", compute='_compute_reference_lead_count')
    reference_lead_ids = fields.Many2many('bvs.lead', 'lead_partner_rel', 'lead_id', 'partner_id', string='Reference Leads')
    applicant_form_count = fields.Integer("No of Applicant Forms", compute='_compute_applicant_form_count')
    applicant_form_ids = fields.One2many('bvs.applicants.form', 'partner_id', string='Applicant Forms')
    free_arrangement_submission = fields.Many2one('bvs.document', string='Free Arrangement')
    insurance_proposition_submission = fields.Many2one('bvs.document', string='Insurance Proposition Summary')
    joint_client_data_submission = fields.Many2one('bvs.document', string='Joint Client Data Protection')
    mortgage_provider_submission = fields.Many2one('bvs.document', string='Mortgage Provider List')
    our_morgages_and_protections_submission = fields.Many2one('bvs.document', string='Our Mortgage & Protection Brochure')
    client_acknowledgment = fields.Boolean(string='Client Acknowledgment of Affordability Assessment')

    @api.depends('name')
    def _compute_first_last_name(self):
        for record in self:
            record.first_name = False
            record.last_name = False
            if record.name:
                if not record.is_company:
                    full_name = record.name.strip()
                    name_parts = full_name.split(' ', 1)

                    record.first_name = name_parts[0] if len(name_parts) == 2 else name_parts[0]
                    record.last_name = name_parts[1] if len(name_parts) == 2 else ''

    # my leads
    @api.depends('lead_ids')
    def _compute_lead_count(self):
        for partner in self:
            partner.lead_count = len(partner.lead_ids)

    def view_leads(self):
        leads = self.mapped('lead_ids')
        action = self.env.ref('bvs_crm.bvs_lead_action').read()[0]
        if len(leads) > 1:
            action['domain'] = [('id', 'in', leads.ids)]
        elif len(leads) == 1:
            action['views'] = [(self.env.ref('bvs_crm.bvs_lead_form').id, 'form')]
            action['res_id'] = leads.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action

    # reference leads
    @api.depends('reference_lead_ids')
    def _compute_reference_lead_count(self):
        for partner in self:
            partner.reference_lead_count = len(partner.reference_lead_ids)

    def view_reference_leads(self):
        leads = self.mapped('reference_lead_ids')
        action = self.env.ref('bvs_crm.bvs_lead_action').read()[0]
        if len(leads) > 1:
            action['domain'] = [('id', 'in', leads.ids)]
        elif len(leads) == 1:
            action['views'] = [(self.env.ref('bvs_crm.bvs_lead_form').id, 'form')]
            action['res_id'] = leads.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action

    # applicant forms
    @api.depends('applicant_form_ids')
    def _compute_applicant_form_count(self):
        for partner in self:
            partner.applicant_form_count = len(partner.applicant_form_ids)

    def view_applicant_forms(self):
        applicant_forms = self.mapped('applicant_form_ids')
        action = self.env.ref('bvs_crm.bvs_applicants_form_action').read()[0]
        if len(applicant_forms) > 1:
            action['domain'] = [('id', 'in', applicant_forms.ids)]
        elif len(applicant_forms) == 1:
            action['views'] = [(self.env.ref('bvs_crm.bvs_applicants_form_motgage').id, 'form')]
            action['res_id'] = applicant_forms.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action
