package com.orbsoft.roadz.controller

import grails.plugins.springsecurity.Secured
import com.orbsoft.roadz.domain.User
import com.orbsoft.roadz.domain.UserSec
import com.orbsoft.roadz.domain.Friendship
import grails.converters.*

@Secured(['ROLE_USER'])
class UserController {
	static scaffold = User

	def friendsjson () {
		def username = params.username
		// TODO set depth level or write custom marshaller
		JSON.use("deep"){ 
			User user = User.findByUsername(username) 
			render user as JSON 
		}
	}
}