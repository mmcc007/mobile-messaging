import java.util.Date;

//import com.google.apps.easyconnect.demos.easyrpbasic.web.data.AccountServiceImpl;
//import com.google.apps.easyconnect.demos.easyrpbasic.web.util.Constants;
import com.google.apps.easyconnect.easyrp.client.basic.Context;
import com.google.apps.easyconnect.easyrp.client.basic.session.RpConfig;
import com.google.apps.easyconnect.easyrp.client.basic.session.SessionBasedSessionManager;
import com.google.apps.easyconnect.easyrp.client.basic.session.SessionManager;
import com.orbsoft.roadz.domain.RoleSec
import com.orbsoft.roadz.domain.UserSecRoleSec
import com.orbsoft.roadz.domain.User
import com.orbsoft.roadz.domain.Friendship
import com.orbsoft.roadz.gitkit.Constants
//import com.orbsoft.roadz.gitkit.SessionManager
import grails.util.Environment

class BootStrap {
	def springSecurityService
	def accountService
	
    def init = { servletContext ->
		if (Environment.isDevelopmentMode()) {

		        def samples = [
		            'inviter' : [ fullName: 'inviter', email: "inviter" ],
		            'maurice' : [ fullName: 'Maurice', email: "mmcc@orbsoft.com" ],
		            'chuck_norris' : [ fullName: 'Chuck Norris', email: "chuck@example.org" ],
		            'glen' : [ fullName: 'Glen Smith', email: "glen@example.org" ],
		            'peter' : [ fullName: 'Peter Ledbrook', email: "peter@somewhere.net" ],
		            'sven' : [ fullName: 'Sven Haiges', email: "sven@example.org" ],
		            'burt' : [fullName : 'Burt Beckwith', email: "burt@somewhere.net" ],
//		            'mmcc007@gmail.com' : [fullName : 'Maurice McCabe', email: "mmcc007@gmail.com" ],
//					'maurice_mccabe@yahoo.com' : [fullName : 'M on Y', email: "maurice_mccabe@yahoo.com" ],
					
					]
				
				def userRole = getOrCreateRole('ROLE_USER')
				def adminRole = getOrCreateRole('ROLE_ADMIN')

				def users = User.list() ?: []
				if (!users) {
		            // Start with the admin user.
		            def adminUser = new User(
		                    username: "admin",
							password: 'admin',
		                    enabled: true).save()
		            UserSecRoleSec.create adminUser, adminRole
					
					// Now the normal users.
					samples.each { username, profileAttrs ->
						println "${username} == ${profileAttrs}"
						def user = new User(
								username: username,
								password: "password",
								enabled: true).save()
						def rel = UserSecRoleSec.create(user, userRole)
						if (rel.hasErrors()) println "Failed to assign user role to ${user.username}: ${rel.errors}"
						users << user

					}
					def maurice = User.findByUsername("maurice")
//					println "maurice == " + maurice.username
					def glen = User.findByUsername("glen")
					def chuck = User.findByUsername("chuck_norris")
//					println "glen == " + glen.username
//					def mmcc007 = User.findByUsername("mmcc007@gmail.com")
//					println "mmcc007 == " + mmcc007.username
//					def maurice_mccabe = User.findByUsername("maurice_mccabe@yahoo.com")
//					println "maurice_mccabe == " + maurice_mccabe.username
					
					new Friendship(friendedBy: maurice, friendOf: glen, status: "sss").save()
					new Friendship(friendedBy: maurice, friendOf: chuck, status: "sss").save()
					new Friendship(friendedBy: chuck, friendOf: maurice, status: "sss").save()
//					new Friendship(friendedBy: mmcc007, friendOf: maurice_mccabe, status: "sss").save()
//					new Friendship(friendedBy: maurice_mccabe, friendOf: mmcc007, status: "sss").save()
					println "friendship saved"
										
			}
	    }
		initEasyRpContext()
    }

    def destroy = {
    }
	
	private getOrCreateRole(name) {
		return  RoleSec.findByAuthority(name) ?: new RoleSec(authority: name).save(failOnError: true)
	}

	private void initEasyRpContext() {
		RpConfig config = new RpConfig.Builder().sessionUserKey(Constants.SESSION_KEY_LOGIN_USER)
			.homeUrl(Constants.HOME_PAGE_URL).signupUrl(Constants.SIGNUP_PAGE_URL).build();
		SessionManager sessionBasedSessionManager = new SessionBasedSessionManager(config);
		SessionManager sessionManager = new com.orbsoft.roadz.gitkit.SessionManager(sessionBasedSessionManager);
		Context.setConfig(config);
		Context.setAccountService(accountService);
		Context.setSessionManager(sessionManager);
		Context.setGoogleApisDeveloperKey("AIzaSyBxRA1SwApaq3WQUreST9m_kJfVMTO3sPw");
	  }
	
}
