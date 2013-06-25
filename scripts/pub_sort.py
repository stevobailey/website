#!/usr/bin/python
# Stevo Bailey
# stevo.bailey@gmail.com
#
# This script sorts the files in the publications directory by date,
# then prints out the names of each file in date order for a perl
# script to use.

import sys
import os
import string
import datetime
import re

def main():

    # message
    print "Sorting the publications."

    # read in publications directory files
    pub_dir = sys.argv[1]
    pubs = os.listdir(pub_dir)

    # open each file and find its date
    dates = []
    for pub in pubs:
        if not pub_dir.endswith('/'): pub_dir = pub_dir + '/'
        fopen = open(pub_dir + pub, 'r')
        for line in fopen.readlines():
            if re.match("^date:", line):
                ###TODO: get the date format before parsing? or guess a bunch of options but don't crash, like it does now
                date = datetime.datetime.strptime(string.strip(line[5:]), "%B %d, %Y")
                print date
        fopen.close()

    # sort by date
    combined_list = zip(dates, pubs)
    combined_list.sort()
    dates, pubs = zip(*combined_list)

    # print results to file
    fopen = open(sys.argv[2], 'w')
    fopen.write("\n".join(pubs))
    fopen.close()

if __name__ == "__main__" : main()
