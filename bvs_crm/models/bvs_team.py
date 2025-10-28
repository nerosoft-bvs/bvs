import json
import random

from babel.dates import format_date
from datetime import date
from dateutil.relativedelta import relativedelta

from odoo import api, fields, models, _
from odoo.exceptions import UserError
from odoo.release import version


class BvsTeam(models.Model):
    _name = "bvs.team"
    _inherit = ['mail.thread']
    _description = "BVS Team"

    def _get_default_team_id(self, user_id=None, domain=None):
        """ Compute default team id for sales related documents. Note that this
        method is not called by default_get as it takes some additional
        parameters and is meant to be called by other default methods.

        Heuristic (when multiple match: take from default context value or first
        sequence ordered)

          1- any of my teams (member OR responsible) matching domain, either from
             context or based on _order;
          2- any of my teams (member OR responsible), either from context or based
             on _order;
          3- default from context
          4- any team matching my company and domain (based on company rule)
          5- any team matching my company (based on company rule)

        Note: ResPartner.team_id field is explicitly not taken into account. We
        think this field causes a lot of noises compared to its added value.
        Think notably: team not in responsible teams, team company not matching
        responsible or lead company, asked domain not matching, ...

        :param user_id: salesperson to target, fallback on env.uid;
        :domain: optional domain to filter teams (like use_lead = True);
        """
        if user_id is None:
            user = self.env.user
        else:
            user = self.env['res.users'].sudo().browse(user_id)
        default_team = self.env['bvs.team'].browse(
            self.env.context['default_team_id']
        ) if self.env.context.get('default_team_id') else self.env['bvs.team']
        valid_cids = [False] + [c for c in user.company_ids.ids if c in self.env.companies.ids]

        # 1- find in user memberships - note that if current user in C1 searches
        # for team belonging to a user in C1/C2 -> only results for C1 will be returned
        team = self.env['bvs.team']
        teams = self.env['bvs.team'].search([
            ('company_id', 'in', valid_cids),
             '|', ('user_id', '=', user.id), ('member_ids', 'in', [user.id])
        ])
        if teams and domain:
            filtered_teams = teams.filtered_domain(domain)
            if default_team and default_team in filtered_teams:
                team = default_team
            else:
                team = filtered_teams[:1]

        # 2- any of my teams
        if not team:
            if default_team and default_team in teams:
                team = default_team
            else:
                team = teams[:1]

        # 3- default: context
        if not team and default_team:
            team = default_team

        if not team:
            teams = self.env['bvs.team'].search([('company_id', 'in', valid_cids)])
            # 4- default: based on company rule, first one matching domain
            if teams and domain:
                team = teams.filtered_domain(domain)[:1]
            # 5- default: based on company rule, first one
            if not team:
                team = teams[:1]

        return team

    def _get_default_favorite_user_ids(self):
        return [(6, 0, [self.env.uid])]

    # description
    name = fields.Char('Sales Team', required=True, translate=True)
    sequence = fields.Integer('Sequence', default=10)
    active = fields.Boolean(default=True, help="If the active field is set to false, it will allow you to hide the Sales Team without removing it.")
    company_id = fields.Many2one(
        'res.company', string='Company', index=True,
        default=lambda self: self.env.company)