from odoo import api, models, fields
from odoo.exceptions import UserError, ValidationError
from datetime import datetime


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    fact_find_count = fields.Integer("No of Fact Find Forms", compute='_compute_fact_find_count')
    fact_find_ids = fields.One2many('fact.find', 'lead_id', string='Fact Find Forms')


    def get_first_fact_find_data(self):
        fact_find = self.env['fact.find'].search([('partner_id', '=', self.partner_id.id)], order='create_date asc', limit=1)
        if fact_find:
            values = {
                'title_customer': fact_find.title_customer,
                'first_name': fact_find.first_name,
                'middle_names': fact_find.middle_names,
                'surname': fact_find.surname,
                'known_by_another_name': fact_find.known_by_another_name,
                'credit_comment': fact_find.credit_comment,
                'previous_name': fact_find.previous_name,
                'previous_surname': fact_find.previous_surname,
                'date_of_name_change': fact_find.date_of_name_change,
                'date_of_birth': fact_find.date_of_birth,
                'country_of_birth': fact_find.country_of_birth.id if fact_find.country_of_birth else False,
                'gender': fact_find.gender,
                'nationality': fact_find.nationality,
                'other_nationality': fact_find.other_nationality,
                'eu_country_list': fact_find.eu_country_list,
                'passport_expiry_date': fact_find.passport_expiry_date,
                'dual_nationality': fact_find.dual_nationality,
                'start_continue_living_in_uk': fact_find.start_continue_living_in_uk,
                'indefinite_leave_to_remain': fact_find.indefinite_leave_to_remain,
                'settled_status': fact_find.settled_status,
                'visa_category': fact_find.visa_category,
                'marital_status': fact_find.marital_status,
                'employment_status': fact_find.employment_status,
                'financial_dependants': fact_find.financial_dependants,
                'email_address': fact_find.email_address,
                'other_email_address': fact_find.other_email_address,
                'home_telephone_number': fact_find.home_telephone_number,
                'mobile_number': fact_find.mobile_number,
                'number_of_dependents': fact_find.number_of_dependents,
            }
            self.fact_find_ids.write(values)  # write to fact_find instance
            return values


    @api.depends('fact_find_ids')
    def _compute_fact_find_count(self):
        for lead in self:
            lead.fact_find_count = len(lead.fact_find_ids)

    def view_fact_find(self):
        fact_find = self.mapped('fact_find_ids')
        action = self.env.ref('bvs_fact_find.action_fact_find_form').read()[0]
        if len(fact_find) > 1:
            action['domain'] = [('id', 'in', fact_find.ids)]
        elif len(fact_find) == 1:
            action['views'] = [(self.env.ref('bvs_fact_find.view_fact_find_form').id, 'form')]
            action['res_id'] = fact_find.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action

    def send_kyc_notification(self):
        for lead in self:
            lead.message_post(
                body='Fact Find Form Submitted!',
                message_type='notification',
                subtype_id=self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                author_id=self.env.user.id,
                notification_ids=[(0, 0, {'res_partner_id': lead.team_leader.partner_id.id, 'notification_type': 'inbox'})]
            )

    def send_kyc_document_notification(self):
        for lead in self:
            lead.message_post(
                body='Fact Find Initial Documents Submitted!',
                message_type='notification',
                subtype_id=self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                author_id=self.env.user.id,
                notification_ids=[(0, 0, {'res_partner_id': lead.team_leader.partner_id.id, 'notification_type': 'inbox'})]
            )
