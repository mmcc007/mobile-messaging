define(["dojo/_base/declare", 
		"dojo/_base/array", 
		"dojo/_base/lang", 
		"dojo/aspect", 
		"dojo/i18n", 
		"dojo/dom-class", 
		"dojo/dom-attr", 
		"dojox/mobile/ScrollableView", 
		"dojox/mobile/ListItem", 
		"dojo/DeferredList", 
		"dojo/_base/xhr",  
		"bywaze/_ViewMixin",
		"dijit/registry"], 
function(declare, baseArray, lang, aspect, i18n, domClass, domAttr, ScrollableView, ListItem, DeferredList, xhr, _ViewMixin, registry) {
	
	return declare("bywaze.FriendsView", [ScrollableView, _ViewMixin], {
		
		// Create a template string for friends:
		friendTemplateString: '<img src="${avatar}" alt="${name}" class="friendviewAvatar" />' + 
		'<div class="friendviewTime" data-dojo-time="${created_at}">${time}</div>' +
		'<div class="friendviewContent"> ' +
			'<div class="friendviewUser">${user}</div>' + 
			'<div class="friendviewText">${text}</div>' + 
		'</div><div class="friendviewClear"></div>',

		// Icon for loading...
//		iconLoading: require.toUrl("js/bywaze/resources/images/loading.gif"),
		iconLoading: _base + "/js/bywaze/resources/images/loading.gif",

		// URL to pull tweets from; simple template included
		//serviceUrl: "http://twitter.com/statuses/user_timeline/${account}.json?since_id=${since_id}",
		serviceUrl: _base + "/user/friendsjson",

		// When the widgets have started....
		startup: function() {
			console.log("friendsView: entered startup")
			// Retain functionality of startup in dojox/mobile/ScrollableView
			this.inherited(arguments);
			
			// Get the refresh button and image
			this.refreshButton = registry.byId(this.getElements("friendsRefreshButton", this.domNode)[0].id);
			this.iconNode = this.refreshButton.iconNode.childNodes[0];
			//this.iconImage = this.iconNode.src;
			
			// Add a click handler to the button that calls refresh
			aspect.after(this.refreshButton, "onClick", lang.hitch(this, "refresh"), true);

			// Add CSS class for styling
			//domClass.add(this.domNode, "tweetviewPane");

			// Get the list widget
			this.listNode = this.getListNode();

			// Hide the list because it's not populated with list items yet
			//this.showListNode(false);

			// Get localization for tweet times
			//this.l10n = i18n.getLocalization("dojo.cldr", "gregorian");

			// Every 60 seconds, update the times
//			setInterval(lang.hitch(this, function() {
//				baseArray.forEach(this.getElements("tweetviewTime", this.domNode), function(timeNode) {
//					timeNode.innerHTML = this.formatTime(domAttr.get(timeNode, "data-dojo-time"));
//				},this);
//			}), 60000);
			
			console.warn("FriendsView: My refresh button is: ", this.iconLoading);
			console.warn("FriendsView: My serviceUrl is: ", this.serviceUrl);

			this.refresh();

		},

		// Contacts server to receive friends
		refresh: function() {
			
			// Set the refresh icon
			var refreshButton = this.refreshButton;
			refreshButton.set("icon", this.iconLoading);
			//this.refreshButton.iconNode.childNodes[0].src = this.iconLoading;
			//refreshButton.select();

			// For every account, add the deferred to the list
//			var defs = [], accounts = bywaze.ACCOUNTS;
			var defs = [];
//			for(var account in accounts) {
				// If the account is enabled...
//				if(accounts[account].enabled) {
					// Get tweets!
//					defs.push(ioScript.get({
//						callbackParamName: "callback",
//						preventCache: true,
//						timeout: 3000,
//						url: this.substitute(this.serviceUrl, { account: account, since_id: accounts[account].since || 1 })
//					}));
						defs.push(xhr.get({
							// The URL of the request
							url: this.serviceUrl,
							// Handle as JSON Data
							handleAs: "json",
							// The success callback with result from server
							load: function(newContent) {
								// Do nothing -- using deferreds
							},
							// The error handler
							error: function() {
								// Do nothing -- keep old content there
								// TODO: retry if connect timeout
								console.warn("FriendsView:refresh: error");
							}
						}));

//				}
//			}

			// Create a deferredlist to handle when all friends are returned
			// Add this.onTweetsReceived as the callback
			new DeferredList(defs).then(lang.hitch(this, this.onFriendsReceived));
		},

/*
		// Fires when tweets are received from the controller
		updateContent: function(rawTweetData) {
			// For every tweet received....
			baseArray.forEach(rawTweetData, function(tweet) {
				// Get the user's screen name
				var screenName = tweet.searchUser || tweet.user.screen_name;

				// Create a new list item, inject into list
				var item = new ListItem({
					"class": "tweetviewListItem user-" + screenName
				}).placeAt(this.listNode, "first");

				// Update the list item's content using our template for tweets
				item.containerNode.innerHTML = this.substitute(this.tweetTemplateString, {
					text: this.formatTweet(tweet.text),
					user: tweet.from_user || screenName,
					name: tweet.from_user || tweet.user.name,
					avatar: tweet.profile_image_url || tweet.user.profile_image_url,
					time: this.formatTime(tweet.created_at),
					created_at: tweet.created_at,
					id: tweet.id
				});
			}, this);
			// Show the list now that we have content for it
			this.showListNode(true);
		},
*/

		// Fires when friends are received from the controller
		updateContent: function(friendsData) {
			// remove existing items
			this.listNode.innerHTML = "";
			// For every friend received....
			var friends = friendsData[0];
			if (friends && dojo.isArray(friends) && friends.length>1 && friends[0] && friends[1] != null ) {
				// remove first element from array
				friends.shift();
				baseArray.forEach(friends, function(friend) {
					// Get the user's screen name
					var screenName = friend.username;
					if (!screenName) return;
					// Create a new list item, inject into list
					var item = new ListItem({
						"class": "friendsviewListItem user-" + screenName
					}).placeAt(this.listNode, "first");

					// Update the list item's content using our template for tweets
					item.containerNode.innerHTML = this.substitute(this.friendTemplateString, {
						//text: this.formatTweet(tweet.text),
						user: screenName,
						name: friend.firstName + " " + friend.lastName,
						avatar: friend.photoUrl,
						//time: this.formatTime(tweet.created_at),
						//created_at: tweet.created_at,
						id: friend.id
					});
				}, this);
			}
			// Show the list now that we have content for it
			this.showListNode(true);
		},

		// Adds the proper tweet linkification to a string
		formatTweet: function(tweetText) {
			return tweetText.
			replace(/(https?:\/\/\S+)/gi, '<a href="$1">$1</a>').
			replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').
			replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
		},

		// Formats the time as received by Twitter
		formatTime: function(date) {
			// Get now
			var now = new Date();

			// Push string date into an Date object
			var tweetDate = new Date(date);

			// Time measurement: seconds
			var secondsDifferent = Math.floor((now - tweetDate) / 1000);
			if(secondsDifferent < 60) {
				return secondsDifferent + " " + (this.l10n["field-second"]) + (secondsDifferent > 1 ? "s" : "");
			}

			// Time measurement: Minutes
			var minutesDifferent = Math.floor(secondsDifferent / 60);
			if(minutesDifferent < 60) {
				return minutesDifferent + " " + this.l10n["field-minute"] + (minutesDifferent > 1 ? "s" : "");
			}

			// Time measurement: Hours
			var hoursDifferent = Math.floor(minutesDifferent / 60);
			if(hoursDifferent < 24) {
				return hoursDifferent + " " + this.l10n["field-hour"] + (hoursDifferent > 1 ? "s" : "");
			}

			// Time measurement: Days
			var daysDifferent = Math.floor(hoursDifferent / 24);
			return daysDifferent + " " + this.l10n["field-day"] + (daysDifferent > 1 ? "s" : "");
		},

		// Merges tweets into one array, sorts them
		sortTweets: function(deflist) {
			// Create an array for our tweets
			var allTweets = [];

			// For each def list result...
			baseArray.forEach(deflist, function(def) {
				// Define which property to check
				// Tweet is just "def[1]", Mentions is def[1].results
				var tweets = (def[1].results || def[1]);

				// If we received any results in this array....
				if(tweets.length) {
					// Get the username and update the since
					var username = !tweets[0].user ? def[1].query.replace("%40", "") : tweets[0].user.screen_name;

					// Update the since for this user
					tweetview.ACCOUNTS[username].since = tweets[0].id_str;

					// If this is a search, we need to add the username to the tweet
					if(def[1].query) {
						baseArray.forEach(tweets, function(tweet) { tweet.searchUser = username; });
					}

					// Join into one big array
					allTweets = allTweets.concat(tweets);
				}
			},this);

			// Sort them by date tweeted
			allTweets.sort(function(a, b) {
				var atime = new Date(a.created_at),
					btime = new Date(b.created_at);

				// Common sorting algorithms like this would return b - a, not a - b.
				// However, we want larger times to be prioritized, not smaller times,
				// so we're doing A's time minus B's time.
				return atime - btime;
			});

			// Return the tweets
			return allTweets;
		},

		// Event for when content is loaded from server
		onFriendsReceived: function(friendData) {
			// Log to console
			console.info("JSON loaded from server:  ", friendData);
			// Sort tweets
			//tweetData = this.sortTweets(rawTweetData);

			// Set the refresh icon back
			var refreshButton = this.refreshButton;
			//this.iconNode.src = this.iconImage;
			refreshButton.select(true);

			// If we receive new tweets, update content
//			if(friendData.length) {
				this.updateContent(friendData);
//			}
		},

		// Updates a tweet's viewability by user account enable change
		onUserChange: function(account,isOn) {
			baseArray.forEach(this.getElements("user-" + account, this.domNode), function(node){ 
				domClass[(isOn ? "remove" : "add")](node, "tweetviewHidden"); 
			});
		}
		
	});
	
});