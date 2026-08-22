---
title: One layer too many
created: 2026-08-16
updated: 2026-08-16
---

Yesterday you said why you stopped: the writing followed the trend, and the
trend was "artful indirection". Careers were built on the extra layer, not on
the thing that would have lasted. AI made that cheaper. You still want to
write because an idea does not get sharp until you have to defend it in
words.

That is a motive. It is not yet a claim.

Tomorrow, write into this:

**Name one time you watched someone get ahead by adding a layer that did
not need to exist.**

Not the industry. One meeting, one PR, one framework adoption, one “we
should abstract this.” What was the layer. Who benefited. What the smaller
thing would have been. What you did, or did not do, in the room.

Write under the question. Ignore the prompt if a better sentence shows up.

---

I'll go deeper here and talk about how the whole industry added layers that did not 
need to be there. 

One example that sticks out to me is Next.js and Distributed Persistent Rendering or 
DPR. I about had milk come out of my nose when I read about it since web devs had 
solved the problem already with reverse proxy caches. Sure, I guess you might say 
adding Varnish in front of a web app is another layer, but I believe that DPR in Next.
js still pushes static content to the edge wit CDNs and needs the server for 
incremental rebuilding vs. full rebuilds. 

So, in that case, it was adding the server to the static output, only because they 
started with static vs. dynamic server. However, since JS people maybe never worked 
with web apps that commonly use Varnish (my whole career I've used Varnish in front of 
a Drupal website/server) they know nothing and are amazed. 

You can try to tell them, point to the sign, "old man shakes fist at cloud", or 
whatever your knee-jerk reaction will be, but they are not likely to listen. The 
community has adopted a new term, and you are better off posting positively about it. 

Once I got to Carson Gross' https://grugbrain.dev/ , I had crossed the line into being 
a "lost cause" as someone called me. I once spoke at Drupal events, and now I all do 
is criticize. 

So, there is really no healthy place for someone to constantly criticize these cyclic 
re-tellings of things already known, and we know the cycle will keep repeating. If you 
choose simple and reliable, there is less and less to discuss each cycle...

But this is only because we are focused on being middle-men and not solving problems. 
Once you solve for the middle layer, why keep talking about it? Well, cause that is 
how you get paid I guess. 

And now that I reading about complexity theory and how information and matter an 
intertwined, I started thinking about how the visual information in a web page must be 
violating some kind of fundamental principle of thermodynamics and information theory 
by taking space and energy away from the actual information on the page, which is not 
really the visual part; hence why we now have the ability to append ".md" to a web 
route and get only markdown in many web frameworks. 