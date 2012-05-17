package com.orbsoft.roadz.controller

import org.scribe.model.Token
import grails.converters.JSON
import com.orbsoft.roadz.domain.User
import com.orbsoft.roadz.domain.Friendship
import org.springframework.beans.factory.InitializingBean

class InviterController {

	def springSecurityService
	def grailsApplication
	def userService

	def index = { 
		// get here from link generated below
		// write params out to session and redirect to login prompt
		println "inviter.index: session.inviter=" + session.inviter 
		session.inviter = params.inviter
		session.invitee = params.invitee
		session.provider = params.provider
		redirect url: "/"
		// afer first login use session to create pending invitation
	}

	def createPendingInviteFromSession = {
		// after logging-in for first time check for pending invitations
		println "inviter.createPendingInviteFromSession session.inviter=" + session.inviter 
		println "inviter.createPendingInviteFromSession session.invitee=" + session.invitee 
		println "inviter.createPendingInviteFromSession session.provider=" + session.provider 

		if (session.inviter) {
			User inviter = User.findByUsername(session.inviter)
			User invitee = User.findByUsername(springSecurityService.authentication.name)
			def inviterFriendship = Friendship.findWhere(friendedBy: inviter, friendOf: null, provider: session.provider, address: session.invitee, status: Friendship._INVITE_PENDING)
			if (inviterFriendship) inviterFriendship.friendOf = invitee
			render 'inviter.createPendingInviteFromSession: invite saved'
			return
		}
		render 'inviter.createPendingInviteFromSession: no change'
	}

	def getPendingInvites= {
		// could do a join, for now use status
		def username = springSecurityService.authentication.name
		println "inviter.getPendingInvites: username=" + username
		User friendOf = User.findByUsername(springSecurityService.authentication.name)
		def pendingInvites = Friendship.findAllWhere(friendOf: friendOf, status: Friendship._INVITE_PENDING)
		render pendingInvites.friendedBy as JSON
		// TODO add sent invites to list (currently just received)
	}

	def acceptInvites = {
		// accept 
		println "inviter.acceptInvites: params.invites=" + params.invites
		params.invites.split(',').each { username ->
			println "username=" + username
			User inviter = User.findByUsername(username)
			println "inviter=" + inviter
			User invitee = User.findByUsername(springSecurityService.authentication.name)
			println "invitee=" + invitee
			def inviterFriendship = Friendship.findWhere(friendedBy: inviter, friendOf: invitee)
			inviterFriendship.status = Friendship._INVITE_FRIENDS
			inviterFriendship.save()
			new Friendship(friendedBy: invitee, friendOf: inviter, status: Friendship._INVITE_FRIENDS).save()
			// send private notification to inviter
			//chatService.privateChat(chatService.getClientId('demo', inviter), "ServerMessage message")
			userService.sendMsg(username, invitee.username + " has accepted your invitation and is online")
		}		
		render 'inviter.acceptInvites: invites accepted'
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

		// get user
		println "name=" + springSecurityService.authentication.name
		User user = User.findByUsername(springSecurityService.authentication.name)
		println "user=" + user
		//User inviter = User.findByUsername('inviter')
		//println "inviter=" + inviter

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
					Friendship.findOrSaveWhere(friendedBy: user, friendOf: null, provider: params.provider, address: address, status: Friendship._INVITE_PENDING)
				}
			} else {
				params.addresses.split(',').each { address ->
					def username = user.username
					println "username=" + username
					def link = createLink(absolute: 'true', params: [inviter: username, invitee: address, provider: params.provider]) as String
					println "link=" + link
					message = '... join me online. '
					println "message=" + message
					def response = service.sendMessage( accessToken: accessToken, link: link, contact:address, message: message as String, subject: params.subject, description: description )
					// check if invitee exists
					def invitee = null
					def inviteeFriendship = Friendship.findWhere(provider: params.provider, address: address)
					if (inviteeFriendship)
						invitee = inviteeFriendship.friendOf
					Friendship.findOrSaveWhere(friendedBy: user, friendOf: invitee, provider: params.provider, address: address, status: Friendship._INVITE_PENDING)
					// TODO send notification to app
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