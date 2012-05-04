package com.orbsoft.roadz.taglib

import groovy.text.Template

class InviterTagLib {

	static namespace="riv"

	def invitationLink = { attrs, body ->

		if (!attrs.provider) {
            throwTagError("Tag [invitationLink] is missing required attribute [provider]")
        }

		def linkAttrs = [ controller : 'inviter', action: 'invite', params: [provider: attrs.provider ] ]

		out << link( linkAttrs, body )

	}

	def messageForm = { attrs ->

		out << render( template: '/inviter/invitationForm', model: attrs, plugin:'inviter' )

	}

	def contacts = { attrs ->

		out << render( template: '/inviter/contacts', model: [contacts: attrs.contacts ], plugin:'inviter' )

	}
}
