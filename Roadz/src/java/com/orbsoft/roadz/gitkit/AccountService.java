package com.orbsoft.roadz.gitkit;

import java.util.HashSet;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public class AccountService {
	private void setAuth(String principal) {
		GrantedAuthority grantedAuthority = new GrantedAuthorityImpl("ROLE_USER");
		HashSet<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
		authorities.add(grantedAuthority);
		Authentication anAuthentication = new PreAuthenticatedAuthenticationToken(principal, "no credentials",authorities);
		SecurityContextHolder.getContext().setAuthentication(anAuthentication);
	}

}
