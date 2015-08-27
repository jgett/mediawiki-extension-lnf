(function($){
	$.lnf = {
		"toolTable": function(table){
            return $.ajax({
                url: '/data/feed/resource-info/json',
                dataType: 'json'
            });
        },
        
        "getResourceId": function(){
			//this gets the the ResourceID stored on the page, if any
			var div = $("div.lnf-resource").first();
			if (div) return div.data("id");
			else return null;
		},
		
		"authCheck": function(callback){
			var result = {"authenticated": false};
			$.ajax({"url": "/login/authcheck"}).done(function(data){
				$.extend(result, data);
			}).always(function(){
				callback(result);	
			});
		},
        
        "load": function(){
            var self = this;
            
            /******* Tool Table *******/
            $("table.tool-table").each(function(){
               var table = $(this);
               self.toolTable().done(function(data){
                    console.log(data);
                    $(table).append($.map(data.Data['default'], function(item){
                        return $("<tr/>")
                            .append($("<td/>").html(item.LabName))
                            .append($("<td/>").html(item.ProcessTechName))
                            .append($("<td/>").html(item.ResourceID))
                            .append($("<td/>").html($("<a/>", {"href": item.WikiPageUrl}).html(item.ResourceName)));
                    }));
               });
            });
            
            /******* Resource Page Infobox *******/
            $(".lnf-resource").each(function(){
				var resourceId = $(this).data("id");
				self.authCheck(function(user){
					if (user.authenticated){
						//inject some scheduler info
						var infobox = $("table.infobox");
						if (infobox.length > 0){ //there is one

							var getHeaderCell = function(text){
								return $("<th/>", {"colspan": 2}).css({"text-align":"center","background":"#ddd"}).html(text)
							}
							
							var getLabelCell = function(text){
								return $("<th/>", {"scope": "row"}).css({"text-align":"left","background":"#eee"}).html(text)
							}
							
							var getCell = function(text){
								return $("<td/>").html(text);
							}
							
							var getExternalLink = function(url, text){
								return $("<a/>", {
									"rel": "nofollow",
									"target": "_blank",
									"class": "external text", 
									"href": url
								}).html(text);
							}
							
							var loader = $("<tr/>", {"class": "loader"}).append(
								$("<td/>", {"colspan": 2})
									.css({"text-align": "center", "font-style": "italic", "color": "#808080"})
									.html($("<img/>", {"src": "/common/images/ajax-loader-2.gif", "alt": "loading..."}))
							).insertBefore($("tbody tr:last", infobox));
							
							setTimeout(function(){
								var rows = [];
							
								rows.push($("<tr/>").append(getHeaderCell("Scheduler Info")));
								
								$.ajax({"url": "/api/scheduler/resource/info?id=" + resourceId}).done(function(data){
									
									var getReservationsUrl = function(){
										var result = "http://ssel-sched.eecs.umich.edu/sselonline/?view=/sselscheduler/ResourceDayWeek.aspx?path=";
										result += data.BuildingID
											+ ":" + data.LabID
											+ ":" + data.ProcessTechID
											+ ":" + data.ResourceID;
										return result;
									}
									
									var getToolEngineers = function(){
										var result = $("<ul/>");
										if ($.isArray(data.ToolEngineers)){
											$.each(data.ToolEngineers, function(index, item){
												result.append($("<li/>").html(
													$("<a/>", {"href": "mailto:" + item.Email[0], "title": item.Email[0]}).html(item.DisplayName)
												));
											});
										}
										return result;
									}
									
									var getCosts = function(){
										var result = [];
										if ($.isArray(data.Costs)){
											$.each(data.Costs, function(index, item){
												var mulVal = parseFloat(item.MulVal);
												var addVal = parseFloat(item.AddVal);
												
												if (isNaN(mulVal) || isNaN(addVal))
													return; //continues each
												
												var costText = "$" + mulVal.toFixed(2);
												
												if (item.AcctPer == 'Hourly')
													costText += "/hr";
												
												if (addVal > 0)
													costText += " + $" + addVal.toFixed(2) + "/use";
												
												result.push($("<tr/>").append(
													getLabelCell(item.ChargeTypeName)
												).append(
													getCell(costText)
												));
											});
										}
										return result;
									}
									
									rows.push($("<tr/>").append(getLabelCell("Scheduler Name")).append(getCell(data.ResourceName)));
									rows.push($("<tr/>").append(getLabelCell("Location")).append(getCell(data.LabName)));
									rows.push($("<tr/>").append(getLabelCell("Tool Engineers")).append(getCell(getToolEngineers())));
									rows.push($("<tr/>").append(getHeaderCell("Costs")));
									rows = rows.concat(getCosts());
									rows.push($("<td/>", {"colspan":"2"}).css({"text-align":"center","background":"#eee"}).html(getExternalLink(getReservationsUrl(), "View reservations")));
									
									loader.after(rows);
									loader.remove();
								});
							}, 750);
						}
					}
				});
			});
        }
	}
    
    $(document).ready(function(){
       $.lnf.load(); 
    });
}(jQuery))