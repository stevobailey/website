# Stevo Bailey
# stevo.bailey@gmail.com
# 
# This makefile creates the main pages of the website. It also
# publishes the site by copying over the server_view/ to the
# server.

default: all
base_dir = .

include $(base_dir)/Makefrag

#########################################################
# Variables
#########################################################


#########################################################
# Build Rules
#########################################################

scripts:
	cd $(scripts_dir); make

all: scripts

#########################################################
# Extra 
#########################################################

.PHONY: all scripts

clean:
	cd $(scripts_dir); make clean
