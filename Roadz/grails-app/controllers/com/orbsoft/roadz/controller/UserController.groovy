package com.orbsoft.roadz.controller
import java.util.Map;
import java.util.HashMap;

import grails.plugins.springsecurity.Secured
import com.orbsoft.roadz.domain.User
import com.orbsoft.roadz.domain.UserSec
import com.orbsoft.roadz.domain.Friendship
import grails.converters.*
import org.cometd.bayeux.server.ServerMessage;

//@Secured(['ROLE_USER'])
class UserController {
	static scaffold = User
	
	def springSecurityService
	def userService

	def friendsjson () {
		def username=springSecurityService.authentication.name
		println "friendsjson: username=" + username
		User user = User.findByUsername(username) 
		def friendship = Friendship.findWhere(friendedBy: user, status: Friendship._INVITE_FRIENDS)

		//userService.sendMsg(username, "ServerMessage message")

		if (friendship) 
			render friendship.friendOf as JSON		
		else		
			render ''
	}
}