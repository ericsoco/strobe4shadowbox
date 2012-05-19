/**
 * Adobe Strobe Media Player with HTML5 fallback for Shadowbox.js
 * http://sourceforge.net/projects/smp.adobe/files/
 */

/**
 * The height (in pixels) of the Strobe player controller.
 *
 * @type    {Number}
 * @private
 */
var controllerHeight = 20;

/**
 * Append a Strobe video player to the document.
 *
 * @param   {HTMLElement}	videoDiv	The containing element for the video player
 * @param   {Object}        dims		The current Shadowbox dimensions
 * @private
 */
function appendStrobePlayer (videoDiv, dims) {
	var width = dims.innerWidth;
	var height = dims.innerHeight;

	var swf = this.obj.remotePlayer ?
		"http://fpdownload.adobe.com/strobe/FlashMediaPlayback.swf" :
		S.path + "StrobeMediaPlayback.swf";
	var version = S.options.flashVersion;
	var express = S.path + "expressInstall.swf";
	var playerPathToRoot = S.options.playerPathToRoot ? S.options.playerPathToRoot : "";

	var flashvars = {
		src: playerPathToRoot + this.obj.content,
		poster: this.obj.poster,
		autoPlay: (S.options.autoplayMovies ? "true" : "false")
	};

	var params = {
		height: height,
		width: width,
		autostart: (S.options.autoplayMovies ? "true" : "false"),
		controlbar: (S.options.showMovieControls ? "bottom" : "none"),
		allowFullScreen: "true",
		allowscriptaccess: "always"
	};

	S.flash.embedSWF(swf, this.id, width, height, version, express, flashvars, params);
}

/**
 * Append an HTML5 video player to the document.
 *
 * @param   {HTMLElement}	videoDiv	The containing element for the video player
 * @param   {Object}        dims		The current Shadowbox dimensions
 * @private
 */
function appendHTML5Player (videoDiv, dims) {
	var width = dims.innerWidth;
	var height = dims.innerHeight;

	//"<video controls="controls"><source src="projects/dividingspace/title/title.jpg" type="video/mp4"><source src="projects/dividingspace/title/title.jpg" type="video/ogg"></video>"
	var $html5Fallback = $("<video />", {
		controls: (S.options.showMovieControls ? 'controls' : ''),
		poster: this.obj.poster,
		width: width,
		height: height
	});
	$(videoDiv).append($html5Fallback);

	var $html5Source = $("<source />", {
		src: this.obj.content,
		type: 'video/mp4'
	});
	$html5Fallback.append($html5Source);

	if (this.obj.content_ogg) {
		var $html5Source_ogg = $("<source />", {
			src: this.obj.content_ogg,
			type: 'video/ogg'
		});
		$html5Fallback.append($html5Source_ogg);    // firefox 9 requires Ogg Vorbis for HTML5 video
	}

	// TODO: display html notification if content format is not supported by the browser:
	// "This video format is not supported by your browser."
}

/**
 * Remove the Strobe video player from the document.
 *
 * @private
 */
function removeStrobePlayer () {
	// call express install callback here in case express install is
	// active and user has not selected anything
	S.flash.expressInstallCallback();
	S.flash.removeSWF(this.id);
}

/**
 * Remove the HTML5 video player from the document.
 *
 * @private
 */
function removeHTML5Player () {
	// TODO: does HTML5 video need any specific disposal?
	var el = get(this.id);
	if (el)
	    remove(el);
}


/**
 * Constructor. The Strobe video player class for Shadowbox.
 *
 * @constructor
 * @param   {Object}    obj     The content object
 * @param   {String}    id      The player id
 * @public
 */
S.strobe = function(obj, id) {
	this.obj = obj;
	this.id = id;

	// height/width default to 300 pixels
	this.height = obj.height ? parseInt(obj.height, 10) : 300;
	if (S.options.showMovieControls)
		this.height += controllerHeight;
	this.width = obj.width ? parseInt(obj.width, 10) : 300;

	var flashVersion = (obj.options && obj.options.flashVersion) || S.options.flashVersion;
	this.flashSupported = S.plugins.fla && S.flash && S.flash.hasFlashPlayerVersion(flashVersion);
}

S.strobe.ext = ["flv", "f4v", "mp4", "mov", "mp4v", "3gp", "3g2", "mp3"];

S.strobe.prototype = {

	/**
	 * Appends this movie to the document.
	 *
	 * @param   {HTMLElement}   body    The body element
	 * @param   {Object}        dims    The current Shadowbox dimensions
	 * @public
	 */
	append: function(body, dims) {
		// append div to replace with SWFObject content.
		// if SWFObject fails due to lack of flash support, videoDiv is not replaced,
		// but instead is used as an HTML5 <video> element.
		var videoDiv = document.createElement("div");
		videoDiv.id = this.id;
		body.appendChild(videoDiv);

		if (this.flashSupported) {
			appendStrobePlayer.apply(this, [videoDiv, dims]);
		} else {
			appendHTML5Player.apply(this, [videoDiv, dims]);
		}

	},

	/**
	 * Removes this movie from the document.
	 *
	 * @public
	 */
	remove: function() {
		if (this.flashSupported) {
			removeStrobePlayer.apply(this);
		} else {
			removeHTML5Player.apply(this);
		}
	},

	/**
	 * Called when the window is resized.
	 *
	 * @public
	 */
	onWindowResize: function() {
		var dims = S.dimensions,
			el = get(this.id);
		el.height = dims.innerHeight;
		el.width = dims.innerWidth;
	}

}
