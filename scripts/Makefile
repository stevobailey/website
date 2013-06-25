# Stevo Bailey
# stevo.bailey@gmail.com
# 
# This makefile runs the scripts here to generate the website
# files.

default: all
base_dir = ..

include $(base_dir)/Makefrag

#########################################################
# Variables
#########################################################

### directories ###
temp_dir		 = temp

### scripts ###
blog_sort_sc     = blog_sort.py
pub_sort_sc      = pub_sort.py

### output files ###
blog_sort_out    = $(temp_dir)/sorted_blog_list.txt
pub_sort_out     = $(temp_dir)/sorted_pub_list.txt

#########################################################
# Build Rules
#########################################################

$(temp_dir):
	mkdir $@

$(blog_sort_out): $(temp_dir)
	$(py_exec) $(blog_sort_sc) $(blog_dir) $(blog_sort_out)

$(pub_sort_out): $(temp_dir)
	$(py_exec) $(pub_sort_sc) $(pubs_dir) $(pub_sort_out)

all: $(blog_sort_out) $(pub_sort_out)

#########################################################
# Extra 
#########################################################

.PHONY: all

clean:
	rm -rf temp	
