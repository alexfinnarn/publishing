---
title: Impressions and interactions
created: 2026-08-20
updated: 2026-08-20
---

I deleted the prompt you wrote since it makes you consider too many things. We are in 
a discovery method here and just thinking about impressions users can make. The 
impression is where any user interaction starts so it is a first principles thing to 
consider. 

You originally asked me to consider one thing a user could do as an interaction on the 
website and I replied...

---

I think a cool interaction could be just a click on a page where you have a set of 
buttons. The click/tap or scroll are the most common interactions on the web. 

And what do people come to the web for? To find something. If you know what you need, 
you do not need to go on the web. Finding something can be just killing time and 
wanting to be entertained. 

As far as design goes, "component-based" is the way things are going, so probably 
should go all the way with no need for a traditional menu bar. 

What even is the reason websites have menu, search, then main section with sidebars? 
Does this come from magazines and newspapers putting their content online and everyone 
copying that?

We should analyze the primitives of interaction and why the most common form of the 
website exists and has not changed since the beginning of the web.

Try to think about directing people to certain URLs + query params. The homepage would 
be blank enough but not anything with a URI.

We can use HTMX to load and place content but the first draft should be static and 
assembled from many HTML files in some sort of order or pattern. I suppose returning 
HTML via REST-ful interface fits well with HTMX principles and the whole REST API 
could be static and deployed.

Of course, GET is the only proper HTTP verb, but maybe a POST to a GitHub trigger or 
to an email address that would then do other things could work. Also there are cheap 
form submission options that might work too.