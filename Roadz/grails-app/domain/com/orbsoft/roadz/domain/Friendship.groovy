package com.orbsoft.roadz.domain

class Friendship {
	public static final String _INVITE_PENDING = "invite pending" 
	public static final String _INVITE_FRIENDS = "friends" 

	User friendedBy
	User friendOf
	String provider
	String address
	String status
	Date dateCreated
	Date lastUpdated

//	static belongsTo = [user: User]

	String toString(){
		def friendStr
		if (friendOf) 
			friendStr = " friended " + friendOf.username 
		else friendStr = ""
		
    	return friendedBy.username + friendStr
  	}

    static constraints = {
    	// can only friend a user once, and cannot be your own friend
    	friendedBy unique: 'friendOf', validator: { val, obj -> return obj.friendOf != val }
		friendOf nullable: true
		provider nullable: true
		address nullable: true
	}
}