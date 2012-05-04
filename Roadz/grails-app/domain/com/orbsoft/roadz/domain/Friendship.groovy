package com.orbsoft.roadz.domain

class Friendship {
	User friend
	String status
	Date dateCreated
	Date lastUpdated

	static belongsTo = [user: User]

	String toString(){
    	return friend.username
  	}
}