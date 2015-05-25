package com.orbsoft.roadz.gitkit;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.google.apps.easyconnect.easyrp.client.basic.data.Account;
import com.google.apps.easyconnect.easyrp.client.basic.session.SessionBasedSessionManager;

public class SessionManager implements com.google.apps.easyconnect.easyrp.client.basic.session.SessionManager {
	 SessionBasedSessionManager sessionMgr;
	 HttpServletRequest request;
	 HttpServletResponse response;
	 
	 SessionManager(SessionBasedSessionManager sessionMgr) {
		 this.sessionMgr = sessionMgr;
	 }
	 
	 public Account getSessionAccount(HttpServletRequest request){
		 this.request = request;
		 return sessionMgr.getSessionAccount(request);
	 }

	 public void setSessionAccount(HttpServletRequest request, HttpServletResponse response, Account account) {
		 this.request = request;
		 this.response = response;
		 sessionMgr.setSessionAccount(request, response, account);		  
	  }

	 public JSONObject getIdpAssertionData(HttpServletRequest request) {
		 this.request = request;
		  return sessionMgr.getIdpAssertionData(request);
	  }

	 public void setIdpAssertionData(HttpServletRequest request, HttpServletResponse response,
	      JSONObject data){
		 this.request = request;
		 this.response = response;
		  sessionMgr.setIdpAssertionData(request, response, data);
	  }

	 public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}



}
