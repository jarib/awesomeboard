<div class="twatboard">{{#source}}{{#user}}
		<div class="twatownerstuff" data-profile_text_color="{{profile_text_color}}" data-profile_background_image_url="{{profile_background_image_url}}"
		data-profile_image_url_bigger="{{profile_image_url_bigger}}"
		data-profile_use_background_image="{{profile_use_background_image}}" data-profile_profile_background_tile="{{profile_background_tile}}"
		data-profile_background_tile="{{profile_background_tile}}" data-profile_sidebar_border_color="{{profile_sidebar_border_color}}">
    	<div class="twatavatarpic"><img src="{{profile_image_url_bigger}}" alt="{{nick}}" align="top"></div>
    </div>
		{{/user}}{{/source}}
    <div class="twatmessage">{{tweet}}
		{{#source}}{{#user}}
    	<div class="bubblecrap"></div>
        <div class="twatnick"><a href="http://twitter.com/{{screen_name}}">{{screen_name}}</a> <span>{{name}}</span>
		{{/user}}{{/source}}
				<!--time datetime="{{date}}">{{formatedDate}}</time-->
				</div>
		</div>
</div>
	
