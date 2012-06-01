package com.orbsoft.roadz.service

import java.util.HashSet;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.web.context.request.RequestContextHolder;

import com.google.apps.easyconnect.easyrp.client.basic.data.Account;
import com.google.apps.easyconnect.easyrp.client.basic.data.AccountException;
import com.google.apps.easyconnect.easyrp.client.basic.Context;

import com.orbsoft.roadz.domain.User;
import org.codehaus.groovy.grails.web.util.WebUtils;

class AccountService implements com.google.apps.easyconnect.easyrp.client.basic.data.AccountService {
	transient springSecurityService
	
	/** dependency injection for grailsApplication */
	def grailsApplication
	
	RememberMeServices  rememberMeServices
	
    def serviceMethod() {

    }

  private boolean supportAutoCreateAccount = true;

  public boolean isSupportAutoCreateAccount() {
    return supportAutoCreateAccount;
  }

  public void setSupportAutoCreateAccount(boolean supportAutoCreateAccount) {
    this.supportAutoCreateAccount = supportAutoCreateAccount;
  }

  	@Override
	public boolean checkPassword(String email, String password) {
		def encodedPassword = springSecurityService.encodePassword(password)
		def user = User.findByUsername(email)
		if (user != null) {
			return user.getPassword().equals(encodedPassword)
		} else return false
	}

	@Override
	public Account createFederatedAccount(JSONObject assertion)
			throws AccountException {
	    if (!isSupportAutoCreateAccount()) {
	      throw new AccountException(AccountException.ACTION_NOT_ALLOWED);
	    }
	    User user = new User();
	    try {
	      user.setUsername(assertion.getString("email"));
	      user.setPassword(assertion.getString("email"));
	      user.setEmail(assertion.getString("email"));
	      if (assertion.has("firstName")) {
	        user.setFirstName(assertion.getString("firstName"));
	      } else {
	        user.setFirstName("empty");
	      }
	      if (assertion.has("lastName")) {
	        user.setLastName(assertion.getString("lastName"));
	      } else {
	        user.setLastName("empty");
	      }
	      if (assertion.has("profilePicture")) {
	        user.setPhotoUrl(assertion.getString("profilePicture"));
	      } else {
	        user.setPhotoUrl("http://www.google.com/uds/modules/identitytoolkit/image/nophoto.png");
	      }
	      user.setFederated(true);
		  user.save();
		  setAuth(user.getUsername());
	      return user;
	    } catch (JSONException e) {
	      throw new AccountException(AccountException.UNKNOWN_ERROR);
	    }
  }

	@Override
	public Account getAccountByEmail(String email) {
		Account account = User.findByUsername(email)
		if (account != null) setAuth(email)
		return account
	}

	@Override
	public void toFederated(String email) throws AccountException {
    User user = User.findByUsername(email);
    if (user == null) {
      throw new AccountException(AccountException.ACCOUNT_NOT_FOUND);
    }
    user.setFederated(true);
	}
	
	/**
	 * Set authentication for Spring Security 
	 * @param principal
	 */
	private void setAuth(String principal) {
		GrantedAuthority grantedAuthority = new GrantedAuthorityImpl("ROLE_USER");
		HashSet<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
		authorities.add(grantedAuthority);
//		String key = grails.plugins.springsecurity.rememberMe.key;
		String key = 'grailsRocks';
		// set the remember me cookie
		// on reloading the page the remember me filter will catch it and autologin
		
		Authentication anAuthentication = new PreAuthenticatedAuthenticationToken(principal, "no credentials",authorities);
//		Authentication anAuthentication = new RememberMeAuthenticationToken(key, principal, authorities);
		SecurityContextHolder.getContext().setAuthentication(anAuthentication);
//		rememberMeServices = ref('rememberMeServices')
		def grails = grailsApplication.mainContext
//		def requestContextHolder = grails.requestContextHolder
//		def currentRequestAttributes = requestContextHolder.currentRequestAttributes
//		def request = currentRequestAttributes.request
		
//		def response = grails.response
		//def xxx = org.codehaus.groovy.grails.web.context.ServletContextHolder.getServletContext()
//		def servletContext = grails.servletContext
		//grailsApplication.mainContext
		//Context.sessionManager
		//def currentRequestAttributes = RequestContextHolder.currentRequestAttributes()
		//def session = currentRequestAttributes.getSession()
		def sessionMgr = Context.sessionManager;
		def request = sessionMgr.request;
		def response= sessionMgr.response;
		
		rememberMeServices.loginSuccess(request, response, anAuthentication);
	}
}
