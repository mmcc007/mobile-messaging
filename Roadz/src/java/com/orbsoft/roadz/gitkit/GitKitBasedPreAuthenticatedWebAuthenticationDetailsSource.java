package com.orbsoft.roadz.gitkit;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.authority.mapping.SimpleAttributes2GrantedAuthoritiesMapper;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedGrantedAuthoritiesWebAuthenticationDetails;
import org.springframework.security.web.authentication.preauth.j2ee.AbstractPreAuthenticatedAuthenticationDetailsSource;

/**
 * Implementation of AuthenticationDetailsSource which converts the user's J2EE roles (as obtained by calling
 * {@link HttpServletRequest#isUserInRole(String)}) into {@code GrantedAuthority}s and stores these in the authentication
 * details object.
 *
 * @author Ruud Senden
 * @since 2.0
 */
public class GitKitBasedPreAuthenticatedWebAuthenticationDetailsSource extends AbstractPreAuthenticatedAuthenticationDetailsSource {
    /**
     * Public constructor which overrides the default {@code WebAuthenticationDetails}
     * class to be used.
     */
    public GitKitBasedPreAuthenticatedWebAuthenticationDetailsSource() {
        super.setClazz(PreAuthenticatedGrantedAuthoritiesWebAuthenticationDetails.class);

        j2eeUserRoles2GrantedAuthoritiesMapper = new SimpleAttributes2GrantedAuthoritiesMapper();
    }

    /**
     * Obtains the list of user roles based on the current user's J2EE roles.
     */
    protected Collection<String> getUserRoles(Object context, Set<String> mappableRoles) {
        ArrayList<String> j2eeUserRolesList = new ArrayList<String>();

        for (String role : mappableRoles) {
            if (((HttpServletRequest)context).isUserInRole(role)) {
                j2eeUserRolesList.add(role);
            }
        }

        return j2eeUserRolesList;
    }
}
