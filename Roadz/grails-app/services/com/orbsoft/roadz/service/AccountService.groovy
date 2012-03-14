package com.orbsoft.roadz.service

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import com.google.apps.easyconnect.easyrp.client.basic.data.Account;
import com.google.apps.easyconnect.easyrp.client.basic.data.AccountException;
import com.orbsoft.roadz.domain.User

class AccountService implements com.google.apps.easyconnect.easyrp.client.basic.data.AccountService {
	transient springSecurityService
	
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
		  user.save()
	      return user;
	    } catch (JSONException e) {
	      throw new AccountException(AccountException.UNKNOWN_ERROR);
	    }
  }

	@Override
	public Account getAccountByEmail(String email) {
		return User.findByUsername(email)
	}

	@Override
	public void toFederated(String email) throws AccountException {
    User user = User.findByEmail(email);
    if (user == null) {
      throw new AccountException(AccountException.ACCOUNT_NOT_FOUND);
    }
    user.setFederated(true);
	}
}
