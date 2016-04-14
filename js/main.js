// Don't execute any code until everything is on the DOM
// since we're manipulating the DOM
$(document).ready(function() {
    var dataDirectory = "/data/antibiotics_data.csv"
    // var csvData = readData(dataDirectory);
    
    // Configurations for Papa
    var config = {
        download: true,
        delimiter: "",
        header: true,
        dynamicTyping: true,
        complete: function(results, file) {
            graphData(results,file);
        }
    }
    
    // Parse csv data into JSON using PapaParse
    Papa.parse(dataDirectory, config);
    // alert(result.data);
});

var graphData = function(results, file) {
    console.log("Parsing complete: ", results, file);
    
    var resultData = formatData(results.data);
    var resultData2 = formatData2(results.data);
    
    
    var layout = {
        title: 'Resilience of Bacterias to Antibacterials (Stacked)',
        barmode:'group',
        xaxis: {
            title: 'Bacterias'
        },
        yaxis: {
            title: 'Minimum Inhibitory Concentration',
            type: 'log',
            autorange: true
        }
    };
    
    var layout2 = {
        title: 'Resilience of Bacterias to Antibacterials (Stacked)',
        barmode:'stack',
        xaxis: {
            title: 'Bacterias'
        },
        yaxis: {
            title: 'Minimum Inhibitory Concentration',
            type: 'log',
            autorange: true
        }
    };
    
    var layout3 = {
        title: 'Resilience of Bacterias to Antibacterials (Box Plot)',
        xaxis: {
            title: 'Antibacterials'
        },
        yaxis: {
            title: 'Minimum Inhibitory Concentration',
            type: 'log',
            autorange: true
        }
    };
    
    Plotly.newPlot('graph-1', resultData, layout);
    Plotly.newPlot('graph-2', resultData, layout2);
    Plotly.newPlot('graph-3', resultData2, layout3);
};

/*
 * Reads the parsed version of CSV file and formats them for Plotly
 * 
 */
var formatData = function(antibacData) {
    console.log("Data formatting begins now ---------------");
    var plotData = {};
    var antibiotics = {
        neo: [],
        peni: [],
        strep: []
    };
    var gramstain = [];
    
    antibacData.forEach(function(d) {
        if (d != null) {
            var gramStain;
            // Converts gramstain string data to boolean
            if (d["Gram Staining "] == "positive") {
                gramStain = "rgba(102, 51, 153, 0.7)";
            } else {
                gramStain = "rgba(255, 47, 47, 0.7)";
            }
            
            plotData[d["Bacteria "]] = {
                stain : gramStain,
                neomycin : d["Neomycin"],
                penicilin : d["Penicilin"],
                streptomycin : d["Streptomycin "]
            };
        }
    });
    

    
    var keys = Object.keys(plotData);
    // console.log(keys);
    
    keys.forEach(function(d) {
        antibiotics.neo.push(plotData[d].neomycin);
        antibiotics.peni.push(plotData[d].penicilin);
        antibiotics.strep.push(plotData[d].streptomycin);
        gramstain.push(plotData[d].stain);
    });
    
    console.log("neo. data: ", antibiotics.neo);
    console.log("peni. data: ", antibiotics.peni);
    console.log("strep. data: ", antibiotics.strep);
    
    var stainConfig = {
        color: gramstain,
        width: 2
    };
    
    var group1 = {
        x : keys,
        y : antibiotics.neo,
        name: 'Neomycin',
        type: 'bar',
        marker: {
            color: 'rgba(220, 255, 209, 1)',
            line: stainConfig
        }
    };
    
    var group2 = {
        x : keys,
        y : antibiotics.peni,
        name: 'Penicilin',
        type: 'bar',
        marker: {
            color: 'rgba(255, 209, 220, 1)',
            line: stainConfig
        }
    };
    
    var group3 = {
        x : keys,
        y: antibiotics.strep,
        name: 'Streptomycin',
        type: 'bar',
        marker: {
            color: 'rgba(209, 220, 255, 1)',
            line: stainConfig
        }
    }
    
    var resultData = [group1, group2, group3] 
    
    
    console.log("Data formatting ends now -----------------");
    
    return resultData;
}

var formatData2 = function(antibacData) {
    console.log("Data formatting begins now ---------------");
    var plotData = {};
    var antibiotics = {
        neomycin: [],
        penicilin: [],
        streptomycin: []
    };
    var gramstain = [];
    
    antibacData.forEach(function(d) {
        if (d != null) {
            var gramStain;
            // Converts gramstain string data to boolean
            if (d["Gram Staining "] == "positive") {
                gramStain = "rgba(102, 51, 153, 0.7)";
            } else {
                gramStain = "rgba(255, 47, 47, 0.7)";
            }
            
            plotData[d["Bacteria "]] = {
                stain : gramStain,
                neomycin : d["Neomycin"],
                penicilin : d["Penicilin"],
                streptomycin : d["Streptomycin "]
            };
        }
    });
    var keys = Object.keys(antibiotics);
    var bactName = Object.keys(plotData);
    console.log(keys);
    console.log(bactName);
    
    antibacData.forEach(function(d) {
        antibiotics.neomycin.push(d["Neomycin"]);
        antibiotics.penicilin.push(d["Penicilin"]);
        antibiotics.streptomycin.push(d["Streptomycin "]);
    });
    console.log(antibiotics);
    
    var name1 = new Array(16).fill('Neomycin');
    var name2 = new Array(16).fill('Penicilin');
    var name3 = new Array(16).fill('Streptomycin');
    
    var group1 = {
        x: name1,
        y: antibiotics.neomycin,
        name: 'Neomycin',
        type: 'box',
        text: bactName
    };

    var group2 = {
        x: name2,
        y: antibiotics.penicilin,
        name: 'Penicilin',
        type: 'box',
        text: bactName
    };
    
    var group3 = {
        x: name3,
        y: antibiotics.streptomycin,
        name: 'Streptomycin',
        type: 'box',
        text: bactName
    };
    
    var resultData = [group1, group2, group3];
    
    console.log("Data formatting ends now -----------------");
    
    return resultData;
}
/*
 * Reads bacteria data from local file using ajax
 *
 * returns a promise
 */

/*
function readData(dir) {
    // Make a reqest to the Github REST api for data about the user
    // with a username stored in the parameter 'username'
    var dataDirectory = dir;
    return $.ajax({
        url: dataDirectory,
        method: "GET",
        success: function(data) {
            alert(data);
        },
        error: function(xhr, ajaxoptions, thrownError) {
            alert('data load failed... Error:' + thrownError);
        }
    });
}
*/


function buildBarGraph(data1, data2) {

    // call your formatRepoData function twice to get a trace for
    // each data object and put them in an array.
    var traces = [formatRepoData(data1), formatRepoData(data2)];

    // Using a layout object to set the title of the graph
    // and set the mode to be a grouped bar chart. You should
    // also use this to label the x- and y- axis
    var layout = {
        title: 'Forks vs Github Repository Primary Language',
        barmode: 'group',
        xaxis: {
            title: "Primary Programming Languages"
        },
        yaxis: {
            title: "# of Forks"
        },
        hovermode: 'closest'
    }

    // call Plotly.newPlot to draw a plotly graph in the dive with an
    // id myDiv with the traces array and layout object you made.
    Plotly.newPlot('myDiv', traces, layout);
}

function isAuth() {
    if (localStorage['auth'] == undefined) {
        return false;
    } else {
        return true;
    }
}

function githubAuth() {
    var auth;
    // Caches a hashed version of user's github credentials so
    // they don't have to log in every time the page reloads.
    if (localStorage['auth'] == undefined) {
        // Super quick/simple github user authorization
        var uname = $("#uname").val();
        var pw = $("#pass").val();
        auth = btoa(uname + ":" + pw); // Encodes string to base-64
        localStorage['auth'] = auth;
        localStorage['uname'] = uname;
        $("#uname").val("");
        $("#pass").val("");
    } else {
        auth = localStorage['auth'];
    }
    updateUserInfoUI();
    return auth;
}

/*
 * Shows and hides user info and sign out button as necessary
 */
function updateUserInfoUI() {
    if (localStorage['auth'] == undefined) {
        $('.links').hide();
    } else {
        $('.links').show();
        $('#username').text(localStorage['uname']);
    }
}
