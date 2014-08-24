# I tried rsync but I think login server doesn't like it...

install:
	ssh stevo.bailey@login.eecs.berkeley.edu "cd ~/public_html/; rm -rf *"
	scp -r /Users/stevo.bailey/Documents/website/* stevo.bailey@login.eecs.berkeley.edu:~/public_html/

.PHONY: install
