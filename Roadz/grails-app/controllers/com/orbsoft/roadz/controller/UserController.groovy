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

		//def chatService = grailsApplication.mainContext.getBean("chatService")

		//println "friendsjson: grailsApplication.mainContext = " + grailsApplication.mainContext
//		println "friendsjson: myChatService.serviceMethod() = " + myChatService.serviceMethod()
//		println "friendsjson: myBean.someProperty = " + myBean.someProperty
//		println "friendsjson: myBean.otherProperty = " + myBean.otherProperty
//            Map<String, Object> chat = new HashMap<String, Object>();
//            String text="ServerMessage message";
//            chat.put("chat", text);
//            chat.put("timestamp", "Sat, 12 May 2012 14:02:11 GMT");
//            chat.put("user", "mmcc007@gmail.com");
//            chat.put("peer", "mmcc007@gmail.com");
//            chat.put("room", "/chat/demo");
//            chat.put("scope", "private");
//            ServerMessage.Mutable forward = bayeux.newMessage();
//            forward.setChannel("/service/privatechat");
//            forward.setId("123");
//            forward.setData(chat);
//        println "forward=" + forward
//		myChatService.privateChat(myChatService.getClient('demo', 'mmcc007@gmail.com'), forward)

		//userService.sendMsg(username, "ServerMessage message")

		if (friendship) 
			render friendship.friendOf as JSON		
		else		
			render ''
	}
}