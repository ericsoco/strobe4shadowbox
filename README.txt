http://words.transmote.com/wp/20120521/strobe-player-for-shadowbox-js/

Shadowbox is lovely -- easy to use, well-written and fairly well-documented, and has a nice player architecture for supporting media types other than those packaged with the library.

There isn't great support out-of-the-box for FLV content, just the JW FLV Player, and to be honest, I'm not really a fan.  Skinning it is a bitch, and the skins are not pretty.  I wanted something simpler and cleaner, and I found out about the Adobe Strobe media player.

To be honest, I wrote this a while back and have been quite busy since, and I don't remember exactly why I found Strobe to be such a better option.  But for those who agree with that sentiment, feel free to drop in the Strobe player for Shadowbox I whipped up, just for you.  It plays FLVs, Quicktime .mov files, and all other media formats supported by Flash.  And, it falls back to the HTML5 video player when Flash is not available.

To use it, add strobe.js to your Shadowbox source/players folder, edit the players array in build.yml to include 'strobe' (no quotes), and rake it back together as shown here.