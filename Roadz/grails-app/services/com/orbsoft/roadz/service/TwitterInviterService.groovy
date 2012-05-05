package com.orbsoft.roadz.service

import org.codehaus.groovy.grails.commons.ConfigurationHolder as CH

import grails.converters.deep.JSON
import org.scribe.builder.ServiceBuilder
import org.scribe.builder.api.TwitterApi
import org.scribe.model.OAuthRequest
import org.scribe.model.Token
import org.scribe.model.Verb
import org.scribe.model.Verifier

class TwitterInviterService {

    static transactional = true
	static def authService
	static def useEmail = false

	static def messageAttrs = [ 'message', 'contact', 'accessToken' ]

	def getAuthDetails(callbackUrl) {
		if (!authService) {

			authService = new ServiceBuilder()
							   .provider(TwitterApi.class)
							   .apiKey( CH.config.grails.plugin.inviter.twitter.key as String )
							   .apiSecret( CH.config.grails.plugin.inviter.twitter.secret as String )
							   .callback( callbackUrl as String )
							   .build();
			}

		Token requestToken = authService.getRequestToken();

		[ authUrl : authService.getAuthorizationUrl(requestToken), requestToken : requestToken ]

	}

	def getAccessToken( params, requestToken ){
		requestToken = requestToken as Token
		Verifier verifier = new Verifier( params.oauth_verifier )
		authService.getAccessToken(requestToken, verifier);
	}

	def getContacts(accessToken) {
		printf "Entered TwitterInviterService.getContacts: accessToken=" + accessToken
		def currentUser = sendRequest( accessToken, Verb.GET, "http://api.twitter.com/1/account/verify_credentials.json" ).id

		def friends = sendRequest( accessToken, Verb.GET, "http://api.twitter.com/1/followers/ids.json?user_id=${ currentUser }" )
		def contacts = []

		// get friend details. 100 at a time due to twitter api limits
		chunkArray( friends.ids, 100 ).each{ friendList ->
			printf "friendList=" + friendList
			def friendDetails = sendRequest( accessToken, Verb.GET, "http://api.twitter.com/1/users/lookup.json?user_id=${ friendList.join(',') }" )

			friendDetails.each{
				def contact = [:]
				contact.name = "${ it.name } (@${ it.screen_name })"
				contact.photo = it.profile_image_url
				contact.address = it.id
				contacts << contact
			}
		}

		contacts.sort { it.name.toLowerCase() }

	}

	def sendMessage = { attrs ->
		printf "Entered TwitterInviterService.sendMessage: attrs=" + attrs
		OAuthRequest request = new OAuthRequest( Verb.POST, 'http://api.twitter.com/1/direct_messages/new.json' )
		request.addBodyParameter( 'user_id', attrs.contact )
		request.addBodyParameter( 'text', ( attrs.message + " " + attrs.link?:'' ).trim() )
		authService.signRequest( attrs.accessToken, request )
		return request.send()
	}

	private def sendRequest( accessToken, method, url ){
		OAuthRequest request = new OAuthRequest( method, url )
		authService.signRequest( accessToken, request )
		def response = request.send();
		return JSON.parse( response.body )
	}

	private def chunkArray(array, size) {
		// convert array into array of chunks of length (size)
		def chunks = []
		int chunkCount = array.size() / size

		chunkCount.times { chunkNumber ->
			def start = chunkNumber * size
			def end = start + size - 1
			chunks << array[start..end]
		}

		// get the left over
		def leftOver = array.size() % size
		if (leftOver) {
			def start = chunkCount * size
			def end = leftOver -1
			chunks << array[start..end]
		} 

		return chunks
	}

	private def partition(array, size) {
		printf "array=" + array
		printf "size=" + size
		def partitions = []
		int partitionCount = array.size() / size
		printf "partitionCount=" + partitionCount

		partitionCount.times { partitionNumber ->
			printf "partitionNumber=" + partitionNumber
			def start = partitionNumber * size
			def end = start + size - 1
			partitions << array[start..end]
		}

		if (array.size() % size) partitions << array[partitionCount * size..-1]
		printf "partitions=" + partitions

		return partitions
	}

}