Hull.init({ 
	"appId": "538382639df5c0a8da00018a",
	"orgUrl": "https://22dd92ac.hullapp.io"
	},
	function(hull, me, app, org) {
		
		
	},
	function(error) {
    console.log(error);
	}
);

function setLoginContent() {
	$('#login').html('User Login');
	
	var defaultContent = '<h1>E-Mail</h1>' +
		'<input type="text" name="mail" id="mail" />' +
		'<h1>Password</h1>' +
		'<input type="password" name="password" id="password" />' +
		'<p><a href="#" id="forgot-password">Forgot password?</a><br /><a href="#" id="create-account">Create new account.</a></p>' +
		'<div class="submit"><input type="submit" value="Login &nbsp; &#9658;" id="email-login" /></div><br />' +
		'<p id="login-error"></p>' +
		'<h1>Social Media Login</h1>' +
		'<div class="center">' +
			'<div id="facebook" class="um-button">Login with Facebook</div>' +
			'<div id="twitter" class="um-button">Login with Twitter</div>' +
			'<div id="googleplus" class="um-button">Login with Google+</div>' +
		'</div>';
	$('#login-popup').html(defaultContent);
	$('#login-popup').css('height', 'auto');
	$('#email-login').click(function() {
		signIn();
	});


	$('#create-account').click(function() {
		var content = '<h1>Create new account</h1>' +
			'<p>Name</p>' +
			'<input type="text" name="create-account-name" id="create-account-name" />' +
			'<p>E-Mail</p>' +
			'<input type="text" name="create-account-mail" id="create-account-mail" />' +
			'<p>Password</p>' +
			'<input type="password" name="create-account-password-1" id="create-account-password-1" />' +
			'<p>Confirm password</p>' +
			'<input type="password" name="create-account-password-2" id="create-account-password-2" />' +
			'<p id="signup-error"></p><div class="submit normalized"><input type="submit" value="Submit" id="create-account-submit" /></div><br />';
		createPopUp(257, 310, content);
		$('#create-account-submit').click(function() {
			signUp();
		});
	});

	
	$('#forgot-password').click(function() {
		resetPW();
	});

	$('#facebook').click(function() {
		Hull.login('facebook');
	});

	
	$('#twitter').click(function() {
		Hull.login('twitter');
	});
	
	
	$('#googleplus').click(function() {
		Hull.login('google');
	});
	
	

	

}

function setLogoutContent() {
	$('#login').html('Account');
	
	var user = getUserInfo();
	provider = 'dummy';
	try {
    	provider = user.identities[0].provider;
	}
	catch(err) {
    	
	}
	
	if (provider == 'dummy') {
		provider = 'email';
	}

	var uppercaseProvider = provider.charAt(0).toUpperCase() + provider.substr(1, provider.length);
	content = '<div class="center">' +
			'<img src="' + user.picture + '" class="float-left" />' +
			'<div class="left username">Connected as <b>' + user.name + '</b> via ' + uppercaseProvider + '.</div>' +
			'<div id="' + provider + '" class="um-button">Logout</div>' +
		'</div>';
	$('#login-popup').html(content);
	$('#login-popup').css('height', 'auto');

	$('#' + provider).click(function() {
		Hull.logout();
	});
}

var provider = '';
var content = '';

// Event for Initalization of Hull.io - Include every function that needs to be called on start
Hull.on('hull.init', function() {
	showMessages();
	if ( Hull.currentUser() ) {
		setLogoutContent();
	}
	else {
		setLoginContent();
	}
});


// User logged in
Hull.on('hull.auth.login', function() {
	setLogoutContent();
});

Hull.on('hull.auth.logout', function() {
	setLoginContent();
});
	
// returning user information, null if not logged in
function getUserInfo() {
	return Hull.currentUser();
}

// encoding Hull.id
function getHullId(id) {
	var entity = Hull.util.entity.encode(id);
	return entity;
}

//Registration with E-Mail
function signUp() {
	
	var name = $('#create-account-name').val();
	var email = $('#create-account-mail').val();
	var password1 = $('#create-account-password-1').val();
	var password2 = $('#create-account-password-2').val();
	if (password1 == password2) {
		Hull.api('/users', 'post',{
	  		"email": email,
	  		"password": password1,
	  		"name": name
			}).then(function(response) {
	 		
 				closePopUp();
 			}
 			,function(error) {
		    	var status = error.status;
		 		if (status == 400) {
		 			if (error.param == "email"){
	 					printErrorMsg("Invalid Mailing Adress!");
	 				}else{
	 					printErrorMsg("User already exists!");
	 				}
	 			} 
			}
		);
	} else {
		printErrorMsg("Passwords do not match!");
	}
	
	function printErrorMsg(message) {
		$("#signup-error").text(message);
		$('#popup').css('height', 330);
	}	
}

// Log in with E-Mail
function signIn() {
	var email = $('#mail').val();
	var password = $('#password').val();

	Hull.login(email, password).then(function (me) {
  		$("#login-error").text("");
		}, function (error) {
  		$("#login-error").text("Wrong E-Mail or Password.");
  		$('#login-error').css('color', '#A50026');
  		$('#login-popup').css('height', 'auto');
	});
}

function resetPW() {
	
	var onSuccess = function(user) {
  		closePopUp();
	};

	var onError = function(error) {
	  $('#recover-error').text('Invalid E-Mail or User does not exist.');
	  $('#recover-error').css('color', '#A50026');
	  $('#popup').css('height', '140');
	}

	var content = '<h1>Password Reset</h1>' +
				'<p>Please enter your E-Mail:<p>' +
					'<input type="text" name="mail" id="recover-mail" /><br />' +
					'<div class="submit normalized"><input type="submit" value="Submit &nbsp; &#9658;" id="reset-pw" /></div><br />' +
					'<p id="recover-error"></p>';
	createPopUp(255, 120, content);

	$("#reset-pw").click(function(){
		var email = $("#recover-mail").val();
		Hull.api('/users/request_password_reset', 'post',{
	  		"email": email
			}).then(onSuccess, onError);
	});			
			
}