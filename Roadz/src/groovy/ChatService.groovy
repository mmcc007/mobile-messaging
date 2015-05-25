//package com.orbsoft.roadz.service
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.cometd.bayeux.client.ClientSessionChannel;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ConfigurableServerChannel;
import org.cometd.bayeux.server.ServerChannel;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.cometd.java.annotation.Configure;
import org.cometd.java.annotation.Listener;
import org.cometd.java.annotation.Service;
import org.cometd.java.annotation.Session;
import org.cometd.server.authorizer.GrantAuthorizer;
import org.cometd.server.filter.DataFilter;
import org.cometd.server.filter.DataFilterMessageListener;
import org.cometd.server.filter.JSONDataFilter;
import org.cometd.server.filter.NoMarkupFilter;
import org.springframework.beans.factory.InitializingBean;

//@javax.inject.Named // Tells Spring that this is a bean
//@javax.inject.Singleton // Tells Spring that this is a Singletonon
@Service("chat")
//public class ChatService implements InitializingBean {
public class ChatService {
//    static scope = "singleton"

//    def serviceMethod() {
//    	println "serviceMethodx: hello"
//    	getClient("demo", "mmcc007@gmail.com")
//    }

//    private String privateStr = "privateStr";
	
	// data structure: Room->Members->
    private static final ConcurrentMap<String, Map<String, String>> _members = new ConcurrentHashMap<String, Map<String, String>>();
 //   private final Map<String, Map<String, String>> _members = new HashMap<String, Map<String, String>>();

    @Inject
    private BayeuxServer _bayeux;
    @Session
    private ServerSession _session;

    static transactional = true

    void afterPropertiesSet() {
        println "afterPropertiesSet"
//        bayeuxSession = bayeux.newLocalSession()
//        bayeuxSession.handshake()
//        bayeuxSession.getChannel('/requests/search').subscribe(new MySubscriberListener
//        (this, 'findAccountsToFollow', ['q', 'params']))
    }

    @SuppressWarnings("unused")
//    @Configure ({"/chat/**","/members/**"})
    @Configure ("/chat/**")
//    @Configure ("/members/**")
    private void configureChatStarStar(ConfigurableServerChannel channel)
    {
        configureChatAndMembers(channel);
    }

    @SuppressWarnings("unused")
//    @Configure ({"/chat/**","/members/**"})
//    @Configure ("/chat/**")
    @Configure ("/members/**")
    private void configureMembersStarStar(ConfigurableServerChannel channel)
    {
        configureChatAndMembersStarStar(channel);
    }

	private configureChatAndMembersStarStar(ConfigurableServerChannel channel) {
		DataFilterMessageListener noMarkup = new DataFilterMessageListener(_bayeux,new NoMarkupFilter(),new BadWordFilter());
		channel.addListener(noMarkup);
		channel.addAuthorizer(GrantAuthorizer.GRANT_ALL)
	}

    @SuppressWarnings("unused")
    @Configure ("/service/members")
    private void configureMembers(ConfigurableServerChannel channel)
    {
        channel.addAuthorizer(GrantAuthorizer.GRANT_PUBLISH);
        channel.setPersistent(true);
    }

    @Listener("/service/members")
    public void handleMembership(ServerSession client, ServerMessage message)
    {
        println "handleMembership: client=" + client
        println "handleMembership: message=" + message

        Map<String, Object> data = message.getDataAsMap();
        final String room = ((String)data.get("room")).substring("/chat/".length());
        Map<String, String> roomMembers = _members.get(room);
        if (roomMembers == null)
        {
            Map<String, String> new_room = new ConcurrentHashMap<String, String>();
            roomMembers = _members.putIfAbsent(room, new_room);
            if (roomMembers == null) roomMembers = new_room;
        }
        final Map<String, String> members = roomMembers;
        String userName = (String)data.get("user");
        members.put(userName, client.getId());
        client.addListener(new ServerSession.RemoveListener()
        {
            public void removed(ServerSession session, boolean timeout)
            {
                members.values().remove(session.getId());
                broadcastMembers(room,members.keySet());
            }
        });

        broadcastMembers(room,members.keySet());
    }

    private void broadcastMembers(String room, Set<String> members)
    {
        // Broadcast the new members list
        ClientSessionChannel channel = _session.getLocalSession().getChannel("/members/"+room);
        channel.publish(members);
    }
    
    @SuppressWarnings("unused")
    @Configure ("/service/privatechat")
    private void configurePrivateChat(ConfigurableServerChannel channel)
    {
        DataFilterMessageListener noMarkup = new DataFilterMessageListener(_bayeux,new NoMarkupFilter(),new BadWordFilter());
        channel.setPersistent(true);
        channel.addListener(noMarkup);
        channel.addAuthorizer(GrantAuthorizer.GRANT_PUBLISH);
    }

    @Listener("/service/privatechat")
    public void privateChat(ServerSession client, ServerMessage message)
    {
        println "chatService:privateChatx client=" + client
        println "chatService:privateChatx message=" + message
        println "chatService:privateChatx _members=" + _members
        //serviceMethod()

        Map<String,Object> data = message.getDataAsMap();
        String room = ((String)data.get("room")).substring("/chat/".length());
        Map<String, String> membersMap = _members.get(room);
        if (membersMap==null)
        {
            Map<String,String>new_room=new ConcurrentHashMap<String, String>();
            membersMap=_members.putIfAbsent(room,new_room);
            if (membersMap==null)
                membersMap=new_room;
        }
        String[] peerNames = ((String)data.get("peer")).split(",");
        ArrayList<ServerSession> peers = new ArrayList<ServerSession>(peerNames.length);

        for (String peerName : peerNames)
        {
            println "chatService:privateChat peerName=" + peerName
            println "chatService:privateChat clientId=" + _members.get(room).get(peerName)
            String peerId = membersMap.get(peerName);
            if (peerId!=null)
            {
                ServerSession peer = _bayeux.getSession(peerId);
                if (peer!=null)
                    peers.add(peer);
            }
        }

        if (peers.size() > 0)
        {
            Map<String, Object> chat = new HashMap<String, Object>();
            String text=(String)data.get("chat");
            chat.put("chat", text);
            chat.put("user", data.get("user"));
            chat.put("scope", "private");
            ServerMessage.Mutable forward = _bayeux.newMessage();
            forward.setChannel("/chat/"+room);
            forward.setId(message.getId());
            forward.setData(chat);

            // test for lazy messages
            if (text.lastIndexOf("lazy")>0)
                forward.setLazy(true);

            for (ServerSession peer : peers)
                if (peer!=client)
                    peer.deliver(_session, forward);
            client.deliver(_session, forward);
        }
    }

    public ServerSession getClient(String room, String userName) {
        println "chatService:getClientId room=" + room
        println "chatService:getClientId userName=" + userName
        Map<String, String> roomMembers = _members.get(room)
       // println "chatService:getClientId privateStr=" + privateStr
        println "chatService:getClientId roomMembers=" + roomMembers
        String clientId = roomMembers.get(userName)
        println "chatService:getClientId clientId=" + clientId
        return _bayeux.getSession(clientId)
    }

    public Set<String> findRooms(String username) {
        // find rooms that user is currently a member of
        println "chatService:findRooms _members=" + _members
        Set<String> rooms = new HashSet<String>();
        for (String room : _members.keySet()) {
            // ...
            Map<String, String> roomMembers = _members.get(room);
        println "chatService:findRooms roomMembers=" + roomMembers
             if (roomMembers.containsKey(username)) {
                rooms.add(room)
            }
        }
        println "chatService:findRooms rooms=" + rooms
        return rooms
    }

    class BadWordFilter extends JSONDataFilter
    {
        @Override
        protected Object filterString(String string)
        {
            if (string.indexOf("dang")>=0)
                throw new DataFilter.Abort();
            return string;
        }
    }
}

