/* global d3 */
(function() {
	var margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = 500 - margin.left - margin.right,
		height = 200 - margin.top - margin.bottom,
		itemsPerScreen = 7,
		barWidth = Math.floor(width / itemsPerScreen),
		interpolationMethod = 'monotone', // bundle, basis, cardinal, monotone
		daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	var parseDate = d3.time.format("%d-%b-%y").parse;
	
	var barXScale = d3.time.scale()
		.range([0, width - barWidth]);
	
	var yScale = d3.scale.linear()
		.range([height, height / 2]);

	function plotOnBarXScale(d) {
		return barXScale(d.date);
	}
	
	function plotFromCenterOfBars(d) {
		return plotOnBarXScale(d) + (Math.round(barWidth / 2));
	}
	
	function plotOnYScale(d) {
		return yScale(d.things);
	}
	
	function drawChart () {
		var area = d3.svg.area()
			.x(plotFromCenterOfBars)
			.y0(height)
			.y1(plotOnYScale)
			.interpolate(interpolationMethod);
		
		var line = d3.svg.line()
			.x(plotFromCenterOfBars)
			.y(plotOnYScale)
			.interpolate(interpolationMethod);
			
		var svg = d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
		svg.append('rect')
			.attr('class', 'background')
			.attr('width', width)
			.attr('height', height);
		
		d3.tsv('data.tsv', function(error, data) {
			if (error) {
				throw error;
			}
			
			data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.things = Number(d.things);
			});
			
			barXScale.domain(d3.extent(data, function(d) { return d.date; }));
			yScale.domain([0, d3.max(data, function(d) { return d.things; })]);
			
			data.forEach(function(d) {
				svg.append('rect')
					.attr('x', plotOnBarXScale(d))
					.attr('y', 0)
					.attr('width', barWidth)
					.attr('height', height)
					.attr('class', 'bar');
			});
			
			svg.append('path')
				.datum(data)
				.attr('d', area)
				.attr('class', 'area');
				
			svg.append('path')
				.datum(data)
				.attr('d', line)
				.attr('class', 'line');
				
			//addDots(svg, data);
			addDayText(svg, data);
		})
	}
	
	function addDots(svg, data) {
		var dots = svg.selectAll('circle')
			.data(data)
			.enter()
			.append('circle');
			
		dots.attr('cx', plotFromCenterOfBars)
			.attr('cy', plotOnYScale)
			.attr('r', 3)
			.style('fill', 'red');
	}
	
	function getDayOfWeekString(date) {
		return daysOfWeek[date.getDay()];
	}
	
	function addDayText(svg, data) {
		var daysOfWeek = svg.selectAll('text.day-of-week')
			.data(data)
			.enter()
			.append('text');
			
		daysOfWeek.attr('x', plotFromCenterOfBars)
			.attr('y', 20)
			.text(function(d) {
				return getDayOfWeekString(d.date);
			})
			.attr('class', 'day-of-week')
		
		var daysOfMonth = svg.selectAll('text.day-of-month')
			.data(data)
			.enter()
			.append('text');
			
		daysOfMonth.attr('x', plotFromCenterOfBars)
			.attr('y', 40)
			.text(function(d) {
				return d.date.getDate();
			})
			.attr('class', 'day-of-month')
	}
	
	drawChart();
}());
