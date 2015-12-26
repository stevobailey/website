var boxHtml = ""; //html code to put into a box content div
var pubSort = 0; //how to sort the publications (0 = year, 1 = title)
var toggle = false; //toggle the publication sorting
var boxCount = 0;

/********************************
*    Page Loading Methods       *
********************************/

//loads project main page
function loadProjectsMain() {
	//test whether we're loading the main page or a specific project page
    var url_argument = new ArgumentURL();
    try {
		loadProject(url_argument.getArgument('project'));
    }
    catch (err) {
    		$.getJSON("source/projects.json", function (projects) {
            //featured project first
            for (i = 0; i < projects.length; i++) {
                if(projects[i].featured == "yes") {
                    text = "<p class=\"minor-heading\">" + projects[i].title + "</p>" + 
                        "<p class=\"tagline\">" + projects[i].tagline + "</p>" + 
                        "<img src=\"" + projects[i].img_source + "\" alt=\"" + projects[i].img_alt + "\" class=\"project-image\" />" + 
                        "<p class=\"mod descr\">" + projects[i].description + "</p>";

                    setBoxData("Featured Project", text, projects[i].color, null, null);
                }
            }

            //type and date sorted list of projects
            var array = sortProjects(projects);
            var text = "<ul>";
            var heading = "";
            for (i = 0; i < array.length; i++) {
                if (heading.toLowerCase() != projects[array[i]].type.toLowerCase()) {
                    heading = projects[array[i]].type;
                    text += "<p class=\"minor-heading left\">" + heading + "</p>";
                }
                text += "<li><p><a onclick=\"window.location = 'projects.htm?project=" + projects[array[i]].url + "'\">" + projects[array[i]].title + "</a> (" + projects[array[i]].dates + ")</p></li>";
            }
            text += "</ul>";
            setBoxData("All Projects", text, "red", null, null);

            loadNewBoxes();
        });
    }
}

//loads a specific project page
function loadProject(url) {
    $.getJSON("source/projects.json", function (projects) {
        var array = sortProjects(projects);
        var text = "";
        for (i = 0; i < array.length; i++) {
            if (projects[array[i]].url == url) {
                text = "<p class=\"minor-heading\">" + projects[array[i]].title + "</p>" +
                    "<p class=\"tagline\">" + projects[array[i]].tagline + "</p>" +
                    "<img src=\"" + projects[array[i]].img_source + "\" alt=\"" + projects[array[i]].img_alt + "\" class=\"project-image\" />" +
                    "<p class=\"mod descr\">" + projects[array[i]].description + "</p>";
              
                for (j = 0; j < projects[array[i]].documents.length; j++) {
                    if (j == 0) { text += "<p class=\"supp\"><strong>Reports and Publications:</strong><ul>"; }
              
                    text += "<li><a href=\"" + projects[array[i]].documents[j].substring(0, projects[array[i]].documents[j].indexOf("|")) + "\">" +
                        projects[array[i]].documents[j].substring(projects[array[i]].documents[j].indexOf("|")+1) + "</a></li>";
              
                }
              
                setBoxData(projects[array[i]].type + " Project", text, projects[array[i]].color, null, new Array("projects.htm", "Projects"));
            }
        }

        loadNewBoxes();
    });
}

//loads the publications, sorting them by the passed argument
function loadPublications(pubSort) {
    this.pubSort = pubSort;
    $.getJSON("source/publications.json", function (pubs) {
        array = sortPubs(pubs);
        text = "<ul class=\"no-margin\">"; //text will be box content
        var heading = "";

        //loop through each publication
        for (i = 0; i < array.length; i++) {
            
            //add a heading if necessary
            switch (pubSort) {
                case 0:
                    if (heading != pubs[array[i]].year) {
                        heading = pubs[array[i]].year;
                        text += "<p class=\"minor-heading left\">" + heading + "</p>";
                    }
                    break;
                case 1:
                    if (heading != pubs[array[i]].title.charAt(0).toUpperCase()) {
                        heading = pubs[array[i]].title.charAt(0).toUpperCase();
                        text += "<p class=\"minor-heading left\">" + heading + "</p>";
                    }
                    break;
            }

            //add the authors
            authors = "";
            for (j = 0; j < pubs[array[i]].authors.length; j++) {

                //separators
                if (j == pubs[array[i]].authors.length - 1 && pubs[array[i]].authors.length != 1) {
                    authors += " &amp; ";
                }
                else if (j != 0) {
                    authors += ", ";
                }

                authors += pubs[array[i]].authors[j];
            }

            //format data and add to string
            text += "<li><p>" + authors + ", \"<a href=\"" + pubs[array[i]].link + "\">" +
                pubs[array[i]].title + "</a>,\" " + pubs[array[i]].source + (pubs[array[i]].pages != "" ? ", pp. " +
                pubs[array[i]].pages : "") + ", " + pubs[array[i]].month + " " + pubs[array[i]].year +
                (pubs[array[i]].awards != "" ? " [" + pubs[array[i]].awards + "]" : "") + "</p></li>";
        }

        setBoxData("All Publications", text, "green", null, null);
        loadNewBoxes();
    });
}

function loadAbout() {
    text = "<img src=\"images/stevo.jpg\" alt=\"Stevo\" class=\"stevo-image\" />" +
            "<p class=\"minor-heading\">Hello! I'm Stevo!</p>" + 
            "<p class=\"tagline\">December 26, 2015</p>" +
            //"<img src=\"images/stevo.jpg\" alt=\"Stevo\" style=\"float:left; padding:8px\" />" +
            //"<p class=\"mod descr\">My goal in life is to solve the <a href=\"http://en.wikipedia.org/wiki/Health_threat_from_cosmic_rays\">space radiation problem</a>." + 
            "<p class=\"mod descr\">" + 
            "I'm a fourth-year PhD graduate student at the University of Californa, Berkeley. I'm in the Electrical Engineering and Computer Science (EECS) department, researching under Professors <a href=\"http://www.eecs.berkeley.edu/~bora/\">Bora Nikolic</a> and <a href=\"http://www.eecs.berkeley.edu/~krste/\">Krste Asanovic</a>.</p>" +
            "<p class=\"mod descr\"><strong>Resume:</strong> <a href=\"documents/stevo_bailey_resume.pdf\">PDF</a> (updated Dec. 2015)<br><strong>Status:</strong> I'm in Berkeley Spring 2016.<br><strong>Availability:</strong> I'm doing research at Berkeley in Summer 2016.</p>" +
            "<p class=\"mod descr\">Here, have some links!</p>" +
            "<p class=\"supp\"><ul><li><a href=\"http://www.space.com\">Space.com</a> - space-related news site</li>" +
            "<li><a href=\"http://nextbigfuture.com/\">Next Big Future</a> - news about awesome, futuristic science and technology</li>" +
            "<li><a href=\"http://www.ucolick.org/SaveLick/index.html\">Save Lick Observatory</a> - help save a financially ailing research telescope!</li>" +
            "<li><a href=\"http://www.jpl.nasa.gov\">NASA Jet Propulsion Laboratory</a> - satellites and rovers for scientific research</li>" + 
            "<li><a href=\"http://www.nvidia.com\">Nvidia</a> - graphics cards and other gaming essentials</li>" + 
            "<li><a href=\"http://bwrcs.eecs.berkeley.edu/comic/\">ComIC</a> - integrated circuits design group at UC Berkeley that I'm in</li></ul></p>";

    setBoxData("Home", text, "blue", null, null);

	text = "<img src=\"images/tm.jpg\" alt=\"muddy weather\" class=\"mod about-image\" />" +
            "<p>Stevo received his B.S. degrees in Engineering Science and Physics from The University of Virginia in 2012, with a minor in Electrical Engineering. During his undergraduate studies he interned at Jefferson Labs through the Virginia Microelectronics Consortium and Old Dominion University. He also researched fault-tolerant, reconfigurable adder designs for future nanoelectronic systems at UVA under Professor Mircea Stan. In 2012 he joined the Berkeley Wireless Research Center at the University of California, Berkeley. He obtained his M.S. in Electrical Engineering and Computer Science from Berkeley in 2014. He held internships at the NASA Jet Propulsion Laboratory in 2014 and Nvidia Corporation in 2015. He is currently pursuing a Ph.D. at Berkeley.</p><p>His research interests include robust and power-efficient processor and ASIC design. He is currently experimenting with machine learning and its application to and in integrated circuits.</p>";
    
    setBoxData("About", text, "gray", null, null);
    loadNewBoxes();
}

/********************************
*         Box Methods           *
********************************/

function setBoxData(boxTitle, boxText, boxColor, stickies, link) {
    boxHtml += 
        "<div id=\"box-" + boxCount + "-container\" class=\"box-container\">" + //main div = box container
            "<div class=\"box-top\">" + //load the top of the box
                "<p class=\"box-title\">" + boxTitle + "</p>" + //load the box title
                "<img src=\"images/pp_" + boxColor + ".png\" class=\"pushpin\" alt=\"Pushpin\" />" + //load the pushpin
            "</div>" + //close the top of the box
            "<div id=\"box-" + boxCount + "-left\" class=\"box-left\" />" + //load the left side of the box
            "<div class=\"box-bottom\" />" + //load the bottom of the box
            "<div id=\"box-" + boxCount + "-right\" class=\"box-right\" />" + //load the right side of the box
            "<div id=\"box-" + boxCount++ + "-text\" class=\"box-content\">" + boxText + "</div>"; //load the content and add text
            //"<img src=\"images/carrot.png\" class=\"carrot\" alt=\"Back to Top\" onclick=\"toTop()\" />"; //load the "back to top" carrot

    //add stickies if desired
    if (stickies != null) {
        for (i = 0; i < stickies.length; i++) {
            boxHtml += "<img class=\"sticky\" alt=\"\" src=\"images/sticky.png\" onclick=\"" + stickies[i] + "()\" " + 
                "style=\"top:" + (55 + 70*i) + "px;\" />";
        }
    }
    
    //add "back to ..." link if desired
    if (link != null) {
        boxHtml += "<div class=\"back-to\"><a href=\"" + link[0] + "\">&lt; Back to " + link[1] + "</a></div>";
    }

    boxHtml += "</div>"; //close main box container
}

function loadNewBoxes() {
    $("#boxes").html(boxHtml);
    boxHtml = "";

    for (i = 0; i < boxCount; i++) {
        var boxText = document.getElementById("box-" + i + "-text");
        var boxContainer = document.getElementById("box-" + i + "-container");
        var boxLeft = document.getElementById("box-" + i + "-left");
        var boxRight = document.getElementById("box-" + i + "-right");
        var height = Math.ceil((boxText.clientHeight - 40) / 100.0);
        boxText.setAttribute("style", "height:" + (40 + 100 * height) + "px;");
        boxContainer.setAttribute("style", "height:" + (185 + 100 * height) + "px;");
        boxLeft.setAttribute("style", "height:" + (100 * height) + "px;");
        boxRight.setAttribute("style", "height:" + (100 * height) + "px;");
    }

    boxCount = 0;
}

/********************************
 *      Sorting Methods         *
 ********************************/

// sort blog posts
function sortPosts(posts) {
    var array = [];
    for (i = 0; i < posts.length; i++) {
        compare = getPostCompare(posts[i]);
        for (j = array.push(i) - 2; j >= 0; j--) {
            if ((toggle ? compare < getPostCompare(posts[array[j]]) : compare > getPostCompare(posts[array[j]]))) {
                temp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = temp;
            }
            else {
                break;
            }
        }
    }
    
    return array;
}

function sortPubs(pubs) {
    //insertion sort
    var array = [];
    for (i = 0; i < pubs.length; i++) {
        compare = getPubCompare(pubs[i]);
        for (j = array.push(i) - 2; j >= 0; j--) {
            if ((toggle ? compare < getPubCompare(pubs[array[j]]) : compare > getPubCompare(pubs[array[j]]))) {
                temp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = temp;
            }
            else {
                break;
            }
        }
    }

    toggle = !toggle;
    return array;
}

function sortProjects(projects) {
    //insertion sort by date first
    var array = [];
    for (i = 0; i < projects.length; i++) {
        init_date = Number(projects[i].dates.substring(0, 4));
        fin_date = init_date
        if (projects[i].dates.length > 4) {
          if (projects[i].dates.substring(5) === "Now") {
            fin_date = 9999
          }
          else {
            fin_date = Number(projects[i].dates.substring(5)); 
          }
        }
        for (j = array.push(i) - 2; j >= 0; j--) {
            p2_init_date = Number(projects[array[j]].dates.substring(0, 4));
            p2_fin_date = p2_init_date
            if (projects[array[j]].dates.length > 4) {
                if (projects[array[j]].dates.substring(5) === "Now") {
                  p2_fin_date = 9999
                }
                else {
                  p2_fin_date = Number(projects[array[j]].dates.substring(5)); 
                }
            }
            if (fin_date > p2_fin_date) {
                temp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = temp;
            }
            else {
                break;
            }
        }
    }

    //insertion sort by type second
    var array2 = [];
    for (i = 0; i < array.length; i++) {
        compare = projects[array[i]].type;
        for (j = array2.push(array[i]) - 2; j >= 0; j--) {
            if (compare < projects[array2[j]].type) {
                temp = array2[j + 1];
                array2[j + 1] = array2[j];
                array2[j] = temp;
            }
            else {
                break;
            }
        }
    }

    return array2;
}

/********************************
*         Other Methods         *
********************************/

function toTop() {
    $("html").animate({ scrollTop: 0 }, "slow")
}

function getPostCompare(post) {
    return post.year * 10000 + monthToNumber(post.month) * 100 + post.day;
}

function getPubCompare(pub) {
    switch (pubSort) {
        case 0: //sort by date
            return pub.year * 100 + monthToNumber(pub.month);
        case 1: //sort by title
            return pub.title;
    }
}

function monthToNumber(month) {
    switch (month) {
        case "January":
            return 1;
        case "February":
            return 2;
        case "March":
            return 3;
        case "April":
            return 4;
        case "May":
            return 5;
        case "June":
            return 6;
        case "July":
            return 7;
        case "August":
            return 8;
        case "September":
            return 9;
        case "October":
            return 10;
        case "November":
            return 11;
        case "December":
            return 12;
        case "Jan":
            return 1;
        case "Feb":
            return 2;
        case "Mar":
            return 3;
        case "Apr":
            return 4;
        case "May":
            return 5;
        case "Aug":
            return 8;
        case "Sep":
            return 9;
        case "Sept":
            return 9;
        case "Oct":
            return 10;
        case "Nov":
            return 11;
        case "Dec":
            return 12;
    }
}

// stolen from online somewhere
// allows manipulation of url
function ArgumentURL() {
	this.getArgument = _getArg;
	this.setArgument = _setArg;
	this.removeArgument = _removeArg;
	this.toString    = _toString;	//Allows the object to be printed
									//no need to write toString()
	this.arguments   = new Array();

	// Initiation
	var separator = "&";
	var equalsign = "=";
	
	var str = window.location.search.replace(/%20/g, " ");
	var index = str.indexOf("?");
	var sInfo;
	var infoArray = new Array();

	var tmp;
	
	if (index != -1) {
		sInfo = str.substring(index+1,str.length);
		infoArray = sInfo.split(separator);
	}

	for (var i=0; i<infoArray.length; i++) {
		tmp = infoArray[i].split(equalsign);
		if (tmp[0] != "") {
			var t = tmp[0];
			this.arguments[tmp[0]] = new Object();
			this.arguments[tmp[0]].value = tmp[1];
			this.arguments[tmp[0]].name = tmp[0];
		}
	}
	

	
	function _toString() {
		var s = "";
		var once = true;
		for (i in this.arguments) {
			if (once) {
				s += "?";
				once = false;
			}
			s += this.arguments[i].name;
			s += equalsign;
			s += this.arguments[i].value;
			s += separator;
		}
		return s.replace(/ /g, "%20");
	}
	
	function _getArg(name) {
		if (typeof(this.arguments[name].name) != "string")
			return null;
		else
			return this.arguments[name].value;
	}
	
	function _setArg(name,value) {
		this.arguments[name] = new Object()
		this.arguments[name].name = name;
		this.arguments[name].value = value;
	}
	
	function _removeArg(name) {
		this.arguments[name] = null;
	}
	
	return this;
}
