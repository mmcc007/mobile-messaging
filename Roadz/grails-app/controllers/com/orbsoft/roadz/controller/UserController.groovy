package com.orbsoft.roadz.controller

import grails.plugins.springsecurity.Secured
import com.orbsoft.roadz.domain.User
import com.orbsoft.roadz.domain.UserSec

@Secured(['ROLE_USER'])
class UserController {
	static scaffold = User
}