package com.orbsoft.roadz.domain

class RoleSec {

	String authority

	static mapping = {
		cache true
	}

	static constraints = {
		authority blank: false, unique: true
	}
}
