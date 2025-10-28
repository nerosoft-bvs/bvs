from odoo import api, models, fields, _


class EventList(models.Model):
    _name = 'event.list'

    name = fields.Char(string="Event Name")