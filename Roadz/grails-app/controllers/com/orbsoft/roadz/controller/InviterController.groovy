package com.orbsoft.roadz.controller

import org.scribe.model.Token
import grails.converters.*

class InviterController {

	def grailsApplication

	def index = { }

	def invite = {
		println "invite entered: params: " + params

		def service = resolveService(params.provider)

//		def authInfo = service.getAuthDetails(createLink(action: 'contacts', controller: 'inviter', absolute: 'true', params: [provider: params.provider]))
		def authInfo = service.getAuthDetails(createLink(controller: '.', absolute: 'true', params: [provider: params.provider]))

		if (authInfo.requestToken)
		{
			session["${params.provider}_requestToken"] = authInfo.requestToken
		}
		println "invite returning: authInfo.authUrl = " + authInfo.authUrl

		redirect(url: authInfo.authUrl)
	}

	def sendInvites = {
		println "sendInvites entered: params: " + params
		def service = resolveService(params.provider)
		def accessToken = session["${params.provider}_accessToken"]

		def message = params.message + ' ' + ( grailsApplication.config.grails.plugin.inviter.defaultMessage ?: '' ) as String

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
						message: params.message
					}
				}
			} else
			{
				params.addresses.split(',').each { address ->
					def response = service.sendMessage( accessToken: accessToken, link: params.link, message: params.message, description: params.description, contact:address, subject: params.subject )
					printf "response=" + response
	
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
		//render(view: '/inviter/contacts', model: [contacts: contacts, provider: params.provider], plugin: 'inviter')
		render contacts as JSON
	}

	def sendEmail = {
		println "sendEmail entered: params: " + params
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

	def test = {
		println "test entered: params: " + params
		render params as JSON
	}	
}