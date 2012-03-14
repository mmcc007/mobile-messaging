package com.orbsoft.roadz.domain

import com.google.apps.easyconnect.easyrp.client.basic.data.Account

class User extends UserSec implements Account {
	String firstName
	String lastName
	String email
	String phone
	String photoUrl
	Boolean smsOk
	Boolean emailOk
	Boolean federated
	Date dateCreated
//	String type
	
    static constraints = {
		firstName nullable: true
		lastName nullable: true
        email nullable: true
		phone nullable: true
		smsOk nullable: true
		emailOk nullable: true
		photoUrl nullable: true		
		federated nullable: true		
    }

	@Override
	public String getDisplayName() {
		return firstName + " " + lastName;
	}

	@Override
	public String getPhotoUrl() {
		return photoUrl;
	}

	@Override
	public boolean isFederated() {
		return federated;
	}
}
