package com.orbsoft.roadz.service

class UserService {

	def bayeux
	def bayeuxSession
	def chatService	

    public void sendMsg(String username, String message)
    {
    	// send system message to user
        println "userService:sendMsg username=" + username
        println "userService:sendMsg message=" + message

        Set<String> rooms = chatService.findRooms(username)
        println "userService:sendMsg rooms=" + rooms

        // build message
        Map<String, Object> chat = new HashMap<String, Object>();
        chat.put("chat", message);
        chat.put("user", "system");
        chat.put("peer", username);
        chat.put("scope", "private");

		bayeuxSession = bayeux.newLocalSession()
		bayeuxSession.handshake()

		// TODO: may have to add code to only send to room that member is currently in
        for (String room : rooms) {
	        chat.put("room", "/chat/" + room);
        	// connect and publish
			bayeuxSession.getChannel('/service/privatechat').publish(chat);
        }
    }


}