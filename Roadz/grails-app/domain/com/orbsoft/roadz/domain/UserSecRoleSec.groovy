package com.orbsoft.roadz.domain

import org.apache.commons.lang.builder.HashCodeBuilder

class UserSecRoleSec implements Serializable {

	UserSec userSec
	RoleSec roleSec

	boolean equals(other) {
		if (!(other instanceof UserSecRoleSec)) {
			return false
		}

		other.userSec?.id == userSec?.id &&
			other.roleSec?.id == roleSec?.id
	}

	int hashCode() {
		def builder = new HashCodeBuilder()
		if (userSec) builder.append(userSec.id)
		if (roleSec) builder.append(roleSec.id)
		builder.toHashCode()
	}

	static UserSecRoleSec get(long userSecId, long roleSecId) {
		find 'from UserSecRoleSec where userSec.id=:userSecId and roleSec.id=:roleSecId',
			[userSecId: userSecId, roleSecId: roleSecId]
	}

	static UserSecRoleSec create(UserSec userSec, RoleSec roleSec, boolean flush = false) {
		new UserSecRoleSec(userSec: userSec, roleSec: roleSec).save(flush: flush, insert: true)
	}

	static boolean remove(UserSec userSec, RoleSec roleSec, boolean flush = false) {
		UserSecRoleSec instance = UserSecRoleSec.findByUserSecAndRoleSec(userSec, roleSec)
		if (!instance) {
			return false
		}

		instance.delete(flush: flush)
		true
	}

	static void removeAll(UserSec userSec) {
		executeUpdate 'DELETE FROM UserSecRoleSec WHERE userSec=:userSec', [userSec: userSec]
	}

	static void removeAll(RoleSec roleSec) {
		executeUpdate 'DELETE FROM UserSecRoleSec WHERE roleSec=:roleSec', [roleSec: roleSec]
	}

	static mapping = {
		id composite: ['roleSec', 'userSec']
		version false
	}
}
