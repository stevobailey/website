#!/usr/bin/python
# Stevo Bailey
# stevo.bailey@gmail.com
#
# This script sorts the files in the blog directory by date,
# then prints out the names of each file in date order for a perl
# script to use.

import sys
import os
import string
import datetime
import re

def main():

    # message
    print "Sorting the blog entries."

    # read in blog directory files
    blog_dir = sys.argv[1]
    posts = os.listdir(blog_dir)
    if "template" in posts: posts.remove("template") 
    if "blog.json" in posts: posts.remove("blog.json")

    # open each file and find its date
    dates = []
    for post in posts:
        if not blog_dir.endswith('/'): blog_dir = blog_dir + '/'
        fopen = open(blog_dir + post, 'r')
        for line in fopen.readlines():
            if re.match("^date:", line):
                dates.append(datetime.datetime.strptime(string.strip(line[5:]), "%B %d, %Y"))
        fopen.close()

    # sort by date
    combined_list = zip(dates, posts)
    combined_list.sort()
    dates, posts = zip(*combined_list)

    # print results to file
    fopen = open(sys.argv[2], 'w')
    fopen.write("\n".join(posts))
    fopen.close()

if __name__ == "__main__" : main()
