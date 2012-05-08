package com.orbsoft.roadz.controller

import org.scribe.model.Token
import grails.converters.*

class InviterController {

	def springSecurityService
	def grailsApplication

	def index = { 
		// get here from link generated below
		// write params out to session and redirect to login prompt
		session.inviter = params.inviter
		session.invitee = params.invitee
		redirect url: "/"
	}

	def invite = {
		def service = resolveService(params.provider)

		def authInfo = service.getAuthDetails(createLink(controller: '.', absolute: 'true', params: [provider: params.provider]))

		if (authInfo.requestToken)
		{
			session["${params.provider}_requestToken"] = authInfo.requestToken
		}
		println "invite returning: authInfo.authUrl = " + authInfo.authUrl

		redirect(url: authInfo.authUrl)
	}

	def sendInvites = {
		def service = resolveService(params.provider)
		def accessToken = session["${params.provider}_accessToken"]

		def message = ( grailsApplication.config.grails.plugin.inviter.defaultMessage ?: params.message ) as String
		def description = ( grailsApplication.config.grails.plugin.inviter.defaultDescription ?: params.description ) as String

		if( grailsApplication.config.grails.plugin.inviter.debug ){
			render """

				<html>
				<body>
				This is a debug screen.<br/>
				In a real life situation, I would have sent ${ message } to ${ params.addresses } on ${ params.provider }

				</body>
				</html>

			"""

			return

		} else {
			
			if (service.useEmail)
			{
				params.addresses.split(',').each { address ->
					sendMail {
						to: address
						subject: params.subject
						message: message
					}
				}
			} else {
				params.addresses.split(',').each { address ->
					def link = createLink(absolute: 'true', params: [inviter: "fffffffff", invitee: address]) as String
					def response = service.sendMessage( accessToken: accessToken, link: link, contact:address, message: message, subject: params.subject, description: description )
					render response
					return
				}
			}

		}

		render 'Your messages have been sent'

	}

	def contacts = {
		println "contacts entered: params: " + params
		def service = resolveService(params.provider)
		def accessToken = service.getAccessToken(params, session["${params.provider}_requestToken"])
		session["${params.provider}_accessToken"] = accessToken
		def contacts = service.getContacts(accessToken)
		println "contacts returned: " + contacts
		render contacts as JSON
	}

	def sendEmail = {
				sendMail {
						to params.address
						subject params.subject
						body params.message
					}		
	}

	def photo = {
		def service = resolveService(params.provider)
		def photo = service.getPhoto(session["${params.provider}_accessToken"] as Token, params.photo)

		response.contentType = photo.getHeader('Content-Type')

		BufferedReader reader = new BufferedReader(new InputStreamReader(photo.stream));

		byte[] buffer = new byte[4096];
		int bytesRead;
		while ((bytesRead = reader.read(buffer)) != -1)
		{
			response.outputStream.write(buffer, 0, bytesRead);
		}
		reader.close();
		response.flushBuffer()
	}

	private def resolveService(provider) {

		def serviceName = "${ provider as String }InviterService"
		serviceName = serviceName[0].toString().toLowerCase() + serviceName[1..serviceName.length() - 1]
		grailsApplication.mainContext.getBean(serviceName)

	}

}