/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://appcodingeasy.com/
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * Coutndown class displays updating countdown using provided left time or target timestamp.
 * It is possible to display countdown in different time units and formats by providing
 * label objects for specified time units
 *
 * For more information, examples and online documentation visit: 
 * http://appcodingeasy.com/Titanium-Mobile/Any-format-countdown
**************************************************************/
var countdown = function(config) {
	var timer = null;
	var conf = {
		//specified timestamp
		time: 0,
		//time
		year : 0,
		month : 0,
		week : 0,
		day : 0,
		hour : 0,
		min : 0,
		sec : 0,
		//labels
		label_year : null,
		label_month : null,
		label_week : null,
		label_day : null,
		label_hour : null,
		label_min : null,
		label_sec : null,
		//end label
		end : null,
		//settings
		hide_zeros : true,
		leading_zeros: true,
		onend: null,
		onstep: null
	};

	var origConfig = {
		//specified timestamp
		time: 0,
		//time
		year : 0,
		month : 0,
		week : 0,
		day : 0,
		hour : 0,
		min : 0,
		sec : 0,
		//labels
		label_year : null,
		label_month : null,
		label_week : null,
		label_day : null,
		label_hour : null,
		label_min : null,
		label_sec : null,
		//end label
		end : null,
		//settings
		hide_zeros : true,
		leading_zeros: true,
		onend: null,
		onstep: null
	};
	
	var offset = false;
	var abr = {
		y : {name: "year", used: false, value: 0, template:""},
		m : {name: "month", used: false, value: 0, template:""},
		w : {name: "week", used: false, value: 0, template:""},
		d : {name: "day", used: false, value: 0, template:""},
		h : {name: "hour", used: false, value: 0, template:""},
		i : {name: "min", used: false, value: 0, template:""},
		s : {name: "sec", used: false, value: 0, template:""}
	};
	var months = [
		[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	];
	
	//start countdown
	var construct = function(){
		for(var opt in config){
			conf[opt]= config[opt];
			origConfig[opt] = config[opt];
		}
		for(var i in abr)
		{
			if(conf["label_" + abr[i].name] != null)
			{
				abr[i].used = true;
				if(conf["label_" + abr[i].name].text.toString().indexOf("{" + i + "}") != -1)
				{
					abr[i].template = conf["label_" + abr[i].name].text.toString();
					conf["label_" + abr[i].name].text = "";
				}
			}
		}
		if(conf.time > 0)
		{
			conf.sec = conf.time - Math.round(new Date().getTime() / 1000);
		}
		normalize();
		recalc();
		//timer = setInterval(update, 1000);
		update();
	};
	
	this.start = function(){
		if(timer == null)
		{
			timer = setInterval(update, 1000);
		}
	}
	
	this.stop = function(){
		if(timer != null)
		{
			clearInterval(timer);
			timer = null;
		}
	}
	
	// reset works, with some bugs
	this.reset = function(){
		for(var opt in origConfig){
			conf[opt] = origConfig[opt];
		}
		for(var i in abr)
		{
			if(conf["label_" + abr[i].name] != null)
			{
				abr[i].used = true;
				if(conf["label_" + abr[i].name].text.toString().indexOf("{" + i + "}") != -1)
				{
					abr[i].template = conf["label_" + abr[i].name].text.toString();
					conf["label_" + abr[i].name].text = "";
				}
			}
		}
		if(conf.time > 0)
		{
			conf.sec = conf.time - Math.round(new Date().getTime() / 1000);
		}
		normalize();
		recalc();
		//timer = setInterval(update, 1000);
		update();
	}
	
	//normalize things like 100 sec to 1 min and 40 sec
	var normalize = function(){
		conf.min += Math.floor(conf.sec/60);
		conf.sec = conf.sec % 60;
		
		conf.hour += Math.floor(conf.min/60);
		conf.min = conf.min % 60;
		
		conf.day += Math.floor(conf.hour/24);
		conf.hour = conf.hour % 24;
		
		conf.day += conf.week*7;
		conf.week = 0;
		
		var d = new Date();
		var month = d.getMonth();
		var year = d.getFullYear();
		var date = d.getDate();
		var leftover = months[is_leap_year(year)][month] - date;
		var temp;
		if(conf.day > leftover)
		{
			conf.day -= leftover; 
			do
			{
				month++;
				if(month > 11)
				{
					year++;
					month = 0;
				}
				temp = conf.day - months[is_leap_year(year)][month];
				if(temp >= 0)
				{
					conf.month++;
					if(conf.month > 11)
					{
						conf.year++;
						conf.month = 0;
					}
					conf.day = temp;
				}
			}
			while(temp > 0);
			if(conf.day >= date)
			{
				conf.day -= date;
				conf.month++;
				offset = true;
			}
			else
			{
				conf.day += leftover;
			}
			conf.week += Math.floor(conf.day/7);
			conf.day = conf.day % 7;
		}
		
		conf.year += Math.floor(conf.month/12);
		conf.month = conf.month % 12;
	};
	
	//recalculate to whats been requested in format string
	var recalc = function(){
		for(var i in abr)
		{
			abr[i].value = conf[abr[i].name];
		}
		if(!abr.y.used)
		{
			abr.m.value += (abr.y.value*12);
			abr.y.value = 0;
		}
		if(!abr.m.used)
		{
			var d = new Date();
			var month = d.getMonth();
			var year = d.getFullYear();
			if(!offset)
			{
				month++;
				if(month > 11)
				{
					year++;
					month = 0;
				}
			}
			for(var i = 0; i < abr.m.value; i++)
			{
				abr.d.value += months[is_leap_year(year)][month];
				month++;
				if(month > 11)
				{
					year++;
					month = 0;
				}
			}
			abr.m.value = 0;
		}
		if(!abr.w.used)
		{
			abr.d.value += (abr.w.value*7);
			abr.w.value = 0;
		}
		else
		{
			abr.w.value += Math.floor(abr.d.value/7);
			abr.d.value = abr.d.value % 7;
		}
		if(!abr.d.used)
		{
			abr.h.value += (abr.d.value*24);
			abr.d.value = 0;
		}
		if(!abr.h.used)
		{
			abr.i.value += (abr.h.value*60);
			abr.h.value = 0;
		}
		if(!abr.i.used)
		{
			abr.s.value += (abr.i.value*60);
			abr.i.value = 0;
		}
		if(!abr.s.used)
		{
			abr.s.value = 0;
		}
	};
	
	//update countdown elements
	var update = function (){
		conf.sec--;
		if (conf.sec == -1)
		{
			conf.min--;
			conf.sec = 59;
		}
		if (conf.min == -1)
		{
			conf.hour--;
			conf.min = 59;
		}
		if (conf.hour == -1)
		{
			conf.day--;
			conf.hour = 23;
		}
		if(conf.day == -1)
		{
			conf.week--;
			conf.day = 6;
		}
		if(conf.week == -1)
		{
			conf.month--;
			var d = new Date();
			var month = d.getMonth();
			var year = d.getFullYear();
			if(!offset)
			{
				month++;
				if(month > 11)
				{
					year++;
					month = 0;
				}
			}
			var days = months[is_leap_year(year)][month]-1;
			conf.week = Math.floor(days/7);
			conf.day = days % 7;
		}
		if (conf.month == -1)
		{
			conf.year--;
			conf.month = 11;
		}
		recalc();
		if(conf.onstep)
		{
			conf.onstep(get_sec());
		}
		output(abr.y, conf.label_year, "{y}");
		output(abr.m, conf.label_month, "{m}");
		output(abr.w, conf.label_week, "{w}");
		output(abr.d, conf.label_day, "{d}");
		output(abr.h, conf.label_hour, "{h}", true);
		output(abr.i, conf.label_min, "{i}", true);
		output(abr.s, conf.label_sec, "{s}", true);
		if(conf.hide_zeros)
		{
			var hide = true;
			if(abr.y.used)
			{
				if(abr.y.value <= 0 && hide)
				{
					conf.label_year.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.m.used)
			{
				if(abr.m.value <= 0 && hide)
				{
					conf.label_month.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.w.used)
			{
				if(abr.w.value <= 0 && hide)
				{
					conf.label_week.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.d.used)
			{
				if(abr.d.value <= 0 && hide)
				{
					conf.label_day.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.h.used)
			{
				if(abr.h.value <= 0 && hide)
				{
					conf.label_hour.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.i.used)
			{
				if(abr.i.value <= 0 && hide)
				{
					conf.label_min.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
			if(abr.s.used)
			{
				if(abr.s.value <= 0 && hide)
				{
					conf.label_sec.setVisible(false);
				}
				else
				{
					hide = false;
				}
			}
		}
		if(is_ended())
		{
			for(var i in abr)
			{
				if(abr[i].used)
				{
					conf["label_" + abr[i].name].setVisible(false);
				}
			}
			if(conf.end != null)
			{
				conf.end.setVisible(true);
			}
			clearInterval(timer);
			if(conf.onend)
			{
				conf.onend();
			}
		}
	};
	
	var output = function(span, label, mark, leading){
		leading = (leading) ? true : false;
		if(span.used && label != null)
		{
			if(span.template != "")
			{
				if(leading)
				{
					label.text = span.template.replace(mark, lead_zeros(span.value.toString()));
				}
				else
				{
					label.text = span.template.replace(mark, span.value.toString());
				}
			}
			else
			{
				if(leading)
				{
					label.text = lead_zeros(span.value.toString());
				}
				else
				{
					label.text = span.value.toString();
				}
			}
		}	
	};
	
	var is_ended = function(){
		var is_zero = true;
		for(var i in abr)
		{
			if(abr[i].used && abr[i].value < 0)
			{
				return true;
			}
			if(abr[i].value > 0)
			{
				is_zero = false;
			}
		}
		return is_zero;
	};
	//how much seconds left
	var get_sec = function(){
		var arr = [];
		for(var i in abr)
		{
			arr[i] = new Object();
			arr[i].value = ob.conf[abr[i].name];
			
		}
		arr.m.value += (arr.y.value*12);
		var d = new Date();
		var month = d.getMonth();
		var year = d.getFullYear();
		if(!offset)
		{
			month++;
			if(month > 11)
			{
				year++;
				month = 0;
			}
		}
		for(var i = 0; i < arr.m.value; i++)
		{
			arr.d.value += months[is_leap_year(year)][month];
			month++;
			if(month > 11)
			{
				year++;
				month = 0;
			}
		}
		arr.d.value += (arr.w.value*7);
		arr.h.value += (arr.d.value*24);
		arr.i.value += (arr.h.value*60);
		arr.s.value += (arr.i.value*60);
		return arr.s.value;
	};
	//place leading zeros
	var lead_zeros = function(num){
		if(conf.leading_zeros)
		{
			return (parseInt(num) < 10) ? "0"+num : num;
		}
		else
		{
			return num;
		}
	};
	
	//check if is leap year
	var is_leap_year = function(year){
		if(new Date(year,1,29).getDate() == 29)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	};
	
	construct();
};
module.exports = countdown;