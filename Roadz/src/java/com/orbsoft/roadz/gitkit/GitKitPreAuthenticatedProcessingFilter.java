package com.orbsoft.roadz.gitkit;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

/**
 * This AbstractPreAuthenticatedProcessingFilter implementation is based on the
 * J2EE container-based authentication mechanism. It will use the J2EE user
 * principal name as the pre-authenticated principal.
 *
 * @author Ruud Senden
 * @since 2.0
 */
public class GitKitPreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    /**
     * Return the GitKit user name.
     */
	@Override
	protected Object getPreAuthenticatedCredentials(HttpServletRequest httpRequest) {
        Object principal = httpRequest.getUserPrincipal() == null ? null : httpRequest.getUserPrincipal().getName();
        if (logger.isDebugEnabled()) {
            logger.debug("PreAuthenticated GitKit principal: " + principal);
        }
        return principal;
	}

    /**
     * For GitKit container-based authentication there is no generic way to
     * retrieve the credentials, as such this method returns a fixed dummy
     * value.
     */
	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest httpRequest) {
        return "N/A";
	}
}
