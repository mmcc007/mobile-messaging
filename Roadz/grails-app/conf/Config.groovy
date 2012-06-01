// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts

//grails.config.locations = [
//    "classpath:${appName}-config.properties",
//    "classpath:${appName}-config.groovy",
//    "file:${userHome}/.grails/${appName}-config.properties",
//    "file:${userHome}/.grails/${appName}-config.groovy" ]

// if (System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }

// -------------------------------------------------------------------------------- //
// - START: CONFIGURATION FILE LOADING -------------------------------------------- //
// -------------------------------------------------------------------------------- //
// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts
def ENV_NAME = "${appName}.config.location"
if(!grails.config.locations || !(grails.config.locations instanceof List)) {
	grails.config.locations = []
}
println "--------------------------------------------------------------------------------"
println "- Loading configuration file                                                   -"
println "--------------------------------------------------------------------------------"
// 1: check for environment variable that has been set! This variable must point to the
// configuration file that must be used. Can be a .groovy or .properties file!
if(System.getenv(ENV_NAME) && new File(System.getenv(ENV_NAME)).exists()) {
	println("Including System Environment configuration file: " + System.getenv(ENV_NAME))
	grails.config.locations << "file:" + System.getenv(ENV_NAME)
 
// 2: check for commandline properties!
// Use it like (examples):
//      grails -D[name of app].config.location=/tmp/[name of config file].groovy run-app
// or
//      grails -D[name of app].config.location=/tmp/[name of config file].properties run-app
//
} else if(System.getProperty(ENV_NAME) && new File(System.getProperty(ENV_NAME)).exists()) {
	println "Including configuration file specified on command line: " + System.getProperty(ENV_NAME)
	grails.config.locations << "file:" + System.getProperty(ENV_NAME)
 
// 3: check on local project config file in the project root directory
} else if (new File("./${appName}-config.groovy").exists()) {
	println "*** User defined config: file:./${appName}-config.groovy ***"
	grails.config.locations = ["file:./${appName}-config.groovy"]
} else if (new File("./${appName}-config.properties").exists()) {
	println "*** User defined config: file:./${appName}-config.properties ***"
	grails.config.locations = ["file:./${appName}-config.groovy"]
 
// 4: check on local project config file in ${userHome}/.grails/...
} else if (new File("${userHome}/.grails/${appName}-config.groovy").exists()) {
	println "*** User defined config: file:${userHome}/.grails/${appName}-config.groovy ***"
	grails.config.locations = ["file:${userHome}/.grails/${appName}-config.groovy"]
} else if (new File("${userHome}/.grails/${appName}-config.properties").exists()) {
	println "*** User defined config: file:${userHome}/.grails/${appName}-config.properties ***"
	grails.config.locations = ["file:${userHome}/.grails/${appName}-config.properties"]
 
// 5: we have problem!!
} else {
	println "********************************************************************************"
	println "* No external configuration file defined                                       *"
	println "********************************************************************************"
}
println "(*) grails.config.locations = ${grails.config.locations}"
println "--------------------------------------------------------------------------------"
// -------------------------------------------------------------------------------- //
// - END: CONFIGURATION FILE LOADING ---------------------------------------------- //
// -------------------------------------------------------------------------------- //

grails.project.groupId = appName // change this to alter the default package name and Maven publishing destination
grails.mime.file.extensions = true // enables the parsing of file extensions from URLs into the request format
grails.mime.use.accept.header = false
grails.mime.types = [ html: ['text/html','application/xhtml+xml'],
                      xml: ['text/xml', 'application/xml'],
                      text: 'text/plain',
                      js: 'text/javascript',
                      rss: 'application/rss+xml',
                      atom: 'application/atom+xml',
                      css: 'text/css',
                      csv: 'text/csv',
                      all: '*/*',
                      json: ['application/json','text/json'],
                      form: 'application/x-www-form-urlencoded',
                      multipartForm: 'multipart/form-data'
                    ]

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000

// What URL patterns should be processed by the resources plugin
grails.resources.adhoc.patterns = ['/images/*', '/css/*', '/js/*', '/plugins/*']


// The default codec used to encode data with ${}
grails.views.default.codec = "none" // none, html, base64
grails.views.gsp.encoding = "UTF-8"
grails.converters.encoding = "UTF-8"
// enable Sitemesh preprocessing of GSP pages
grails.views.gsp.sitemesh.preprocess = true
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart=false

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']

// enable query caching by default
grails.hibernate.cache.queries = true

// set per-environment serverURL stem for creating absolute links
environments {
    development {
        grails.logging.jul.usebridge = true
    }
    production {
        grails.logging.jul.usebridge = false
        // TODO: grails.serverURL = "http://www.changeme.com"
    }
}

// log4j configuration
log4j = {
    // Example of changing the log pattern for the default console
    // appender:
    //
    //appenders {
    //    console name:'stdout', layout:pattern(conversionPattern: '%c{2} %m%n')
    //}

	// Set level for all application artifacts
	info "grails.app"


    error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
           'org.codehaus.groovy.grails.web.pages', //  GSP
           'org.codehaus.groovy.grails.web.sitemesh', //  layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping', // URL mapping
           'org.codehaus.groovy.grails.commons', // core / classloading
           'org.codehaus.groovy.grails.plugins', // plugins
           'org.codehaus.groovy.grails.orm.hibernate', // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'
		   
//	debug 'com.google.apps.easyconnect',
//		  'org.springframework.security',
//		  'org.springframework.security.web.authentication'
}

//grails.plugin.inviter.facebook.key='197755966948551'
//grails.plugin.inviter.facebook.secret='5dc5ace6405e5882511e6dd177aa5f77'

// facebook on server
grails.plugin.inviter.facebook.key='361078353916023'
grails.plugin.inviter.facebook.secret='7935f90b95cd9ce75ced3f27ffc28e63'

// facebook local
//grails.plugin.inviter.facebook.key='106080722853795'
//grails.plugin.inviter.facebook.secret='0f35f877ef70901985193824676ff096'

grails.plugin.inviter.yahoo.key='dj0yJmk9T21LU3dnazNxUnJ2JmQ9WVdrOWRGQlBhWFZ4TlRZbWNHbzlNVEV6TkRreU5qUTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD04Nw--'
grails.plugin.inviter.yahoo.secret= 'a21f29aa15b65c2394a5cd18a5f266eba15fcc91'
grails.plugin.inviter.google.key='inviter.cloudfoundry.com'
grails.plugin.inviter.google.secret='mIE86xbAHcH5Cr2J9BYoz0k9'
grails.plugin.inviter.linkedin.key='k25tupolcvf1'
grails.plugin.inviter.linkedin.secret='KBtxC418sdmu5eur'

//grails.plugin.inviter.twitter.key='G8rCU7AHBsZAbeLUAP0i7Q'
//grails.plugin.inviter.twitter.secret='BKbt1ygWu0q4xsLuJ8bhjYvegojVHz2GXn1Z5leoXN8'

// twitter local
grails.plugin.inviter.twitter.key='hEa3ktzqOC47av7haygA'
grails.plugin.inviter.twitter.secret='MHukMsTmPnJ6bzhChKqVO3iLsWs2uBbFRraYR8WC1w'

grails.plugin.inviter.windowslive.key='0000000040062703'
grails.plugin.inviter.windowslive.secret='uuQUGpig3kbv14SdlGwPdHYS86eVWlRc'
//grails.plugin.inviter.debug = true
grails.plugin.inviter.defaultMessage="... join me online. "
grails.plugin.inviter.defaultDescription="Do things with your friends nearby with ByWaze"

// Added by the Spring Security Core plugin:
grails.plugins.springsecurity.userLookup.userDomainClassName = 'com.orbsoft.roadz.domain.UserSec'
grails.plugins.springsecurity.userLookup.authorityJoinClassName = 'com.orbsoft.roadz.domain.UserSecRoleSec'
grails.plugins.springsecurity.authority.className = 'com.orbsoft.roadz.domain.RoleSec'
//grails.plugins.springsecurity.providerNames = [
//	'preAuthenticatedAuthenticationProvider',
//	'anonymousAuthenticationProvider',
//	'rememberMeAuthenticationProvider']
grails.plugins.springsecurity.rememberMe.alwaysRemember = true
//grails.plugins.springsecurity.rememberMe.persistent = true


// for development of deployments only, remove before final deploy
grails.gsp.enable.reload=true
grails.gorm.failOnError=true

grails {
   mail {
     host = "smtp.gmail.com"
     port = 465
     username = "mmcc007@gmail.com"
     password = "H3ntra\$\$"
     props = ["mail.smtp.auth":"true",             
              "mail.smtp.socketFactory.port":"465",
              "mail.smtp.socketFactory.class":"javax.net.ssl.SSLSocketFactory",
              "mail.smtp.socketFactory.fallback":"false"]

} }
grails.mail.overrideAddress="mmccabe@orbsoft.com"