
var colorSphereV2=
{
	maxBrightness:255*3,

	GetRGBFromThetaTau:function(arr) //using relative r, 0<=r<=1, result contain round off errors
	{
		var theta=arr[0],tau=arr[1];
		
		if(theta>180)
		{
			theta = theta%180;
		};

		if(tau>=360)
		{
			tau = tau%360;		
		};

		var rgb=[0,0,0];
	

		function increaseColor(t)
		{
			if (t>60) t=t%60==0?60:t%60;
			return t/60*255
		};
		function decreaseColor(t)
		{
			if (t>60) t=t%60==0?60:t%60;
			return (1-t/60)*255
		};

		//get original 2d rgb color
		if (tau<=60)//increasing green
		{
			rgb[0]=255;
			rgb[1]=increaseColor(tau);
		}
		else if (tau<=120)//decreasing red	
		{		
			rgb[0]=decreaseColor(tau)
			rgb[1]=255;
		}
		else if (tau<=180)//increase blue
		{
			rgb[1]=255;
			rgb[2]=increaseColor(tau);
		}
		else if (tau<=240)//decrease green
		{
			rgb[1]=decreaseColor(tau)
			rgb[2]=255;
		}
		else if (tau<=300)//decrease green
		{
			rgb[0]=increaseColor(tau);
			rgb[2]=255;
		}
		else if (tau<=360)//decrease green
		{
			rgb[0]=255;
			rgb[2]=decreaseColor(tau)
		};




		function scaleBrightness(tt)
		{			
			return tt<=90?rgb.map(x=>x+(255-x)/90*(90-tt)):rgb.map(x=>x/90*(180-tt));
		};
		
		rgb = scaleBrightness(theta).map(x=>Math.round(x));
	
		var rgbNewS='rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
		return rgbNewS;
	},

	GetThetaTauFromRGB:function(rgb)//contains round off errors
	{	
		var rgbArr=rgb.split('(')[1].split(')')[0].split(',').map(x=>parseInt(x));
		var theta=0,tau=0,rgbO=0;
		var minC=Math.min.apply(Math,rgbArr);

		if(minC==0) //means color may have been darkened
		{
			var maxC=Math.max.apply(Math,rgbArr);
			theta=180-90*(maxC/255);
			rgbO=rgbArr.map(x=>90*x/(180-theta));
		}
		else//brightened
		{
			theta=90-(minC-0)*(90/(255));	
			var k = (90-theta)/90;
			rgbO=rgbArr.map(x=>(x-255*k)/(1-k));
		};
		theta=Math.round(theta);
		rgbO=rgbO.map(x=>Math.round(x));

		var maxPos=rgbO.reduce((iMax,x,i,arr)=>x>arr[iMax]?i:iMax,0);
		var minPos=rgbO.reduce((iMax,x,i,arr)=>x<arr[iMax]?i:iMax,0);

		function ReverseDecreasingC(x){return 60-x*60/255;};
		function ReverseIncreasingC(x){return x*60/255;};
		switch(minPos)
		{
			case 0:
				if (maxPos==1) //g,b, increasing b
					tau=ReverseIncreasingC(rgbO[2])+120
				else	//decreasing g				
					tau=ReverseDecreasingC(rgbO[1])+180
				break;
			case 1:
				if (maxPos==2)  //increasing r
					tau=ReverseIncreasingC(rgbO[0])+240
				else  //decreasing b
					tau=ReverseDecreasingC(rgbO[2])+300
				break;
			case 2:
				if (maxPos==0)  //increasing g
					tau=ReverseIncreasingC(rgbO[1])
				else
					tau=ReverseDecreasingC(rgbO[0])+60
				break;
		};
		theta = isNaN(theta)?0:theta;
		tau = isNaN(tau)?0:tau;
		return [Math.round(theta),Math.round(tau)];
	},

	GetOpposingColors:function(startingColor,count)
	{
		if (count>4) {console.log('Choose less than 5 opposing colors!'); return false;};

		var startColor = this.GetThetaTauFromRGB(startingColor);

		var colorArray=[];

		switch(count)
		{
			case 2:
				var color2=[180,180];
				colorArray.push(color2);
				break;
			case 3:
				var color2=[120,Math.random()];
				colorArray.push(color2);
				var color3=this._AddArrays(color2,[0,180]);
				colorArray.push(color3);
				break;
			case 4:
				var color2=[109.5,Math.random()];
				colorArray.push(color2);
				var color3=this._AddArrays(color2,[0,120]);
				colorArray.push(color3);
				var color4=this._AddArrays(color3,[0,120]);
				colorArray.push(color4);
				break;
		}

		colorArray = colorArray.map(x=>this._AddArrays(x,startColor));
		colorArray = colorArray.map(x=>this.GetRGBFromThetaTau(x));

		return colorArray;
	},

	GetHarmonicColors:function(count,bandwidth)  //smaller bandwidth narrower about center region. less than 90o
	{
		var interval = 360/count;
		var rng = function(){return Math.random();};
		var startAngle = rng()*360;
		var startColor = [90+bandwidth,startAngle];

		var colorArray = [startColor];
		var state = false; //false means negative bandwidth, true means positive bandwidth, alternate

		for(i=0;i<count-1;i++)
		{
			var angle = startAngle+(i+1)*interval;
			var color = state?[90+bandwidth,angle]:[90-bandwidth,angle];
			colorArray.push(color);
			state = state?false:true;
		};
		colorArray = colorArray.map(x=>this.GetRGBFromThetaTau(x));
		return colorArray;
	},

	GetHarmonicColorsFromRGB:function(startColor,count)  //smaller bandwidth narrower about center region. less than 90o
	{
		var interval = 360/count;
		var startColor = this.GetThetaTauFromRGB(startColor);
		var bandwidth = Math.abs(startColor[0]-90);

		var colorArray = [startColor];
		var state = startColor[0]-90>0?false:true; //false means negative bandwidth, true means positive bandwidth, alternate

		for(i=0;i<count-1;i++)
		{
			var angle = startColor[1]+(i+1)*interval;
			var color = state?[90+bandwidth,angle]:[90-bandwidth,angle];
			colorArray.push(color);
			state = state?false:true;
		};
		colorArray = colorArray.map(x=>this.GetRGBFromThetaTau(x));
		return colorArray;
	},


	GetSVGTestResults:function(NoOfIntervals,NoOfLayers,sizer,posxy)
	{
		var svg=d3.select("svg");
		var gr = svg.append('g').attr('class','colorsphereV2');
		var width = +svg.attr("width"),
		height = +svg.attr("height"),
		radius = sizer;		

		var objArray=[],
			angleInterval=360/NoOfIntervals,			
			rInterval=1/NoOfIntervals,
			thetaInterval=180/(NoOfLayers+1),
			xDistanceInterval=100/NoOfLayers,
			xPos=posxy[0],
			yPos=posxy[1]
			;

		for(k=0;k<NoOfLayers;k++)
		{
			var thetaAngle=(k+1)*thetaInterval;
			//Math.sin(Math.PI/2)
			var layerRadius = radius*Math.sin(thetaAngle/360*2*Math.PI);
			xPos+=layerRadius;

			var g = gr.append("g").attr("transform", "translate("+xPos+","+yPos+")");
			objArray=[];
			var pie = d3.pie().sort(null).value(function(d) { return 10; });
			var path=d3.arc().outerRadius(layerRadius).innerRadius(0);
			for(j=0;j<NoOfIntervals;j++)
			{
				var c=this.GetRGBFromThetaTau([(k+1)*thetaInterval,j*angleInterval]);
				objArray.push({color:c});
			};
			var arc = g.selectAll(".arc")
			.data(pie(objArray))
			.enter().append("g")
			.attr("class", "arc");
			arc.append("path")
			.attr("d", path)
			.attr("fill", function(d){return d.data.color;});
			
			xPos+=layerRadius;
		}		
	},

	GetSVG_OpposingColorTest:function(startingColor,count,size,posxy)
	{
		var xpos = posxy[0];
		var ypos = posxy[1];

		//<rect x="50" y="20" width="150" height="150" style="fill:blue;" />
		var oppColors = this.GetOpposingColors(startingColor,count);

		var svg=d3.select("svg");
		var gr = svg.append('g').attr('class','oppositeColorsTest');

		gr.append('rect').attr('x',xpos).attr('y',ypos).attr('width',size)
		.attr('height',size).attr('style','fill:'+startingColor+';');
		xpos += size;

		for(var i in oppColors)
		{
			gr.append('rect').attr('x',xpos).attr('y',ypos).attr('width',size)
			.attr('height',size).attr('style','fill:'+oppColors[i]+';');
			xpos += size;
		};
		return true;
	},

	GetSVG_HarmonicBandTest:function(count,bandwidth,size,posxy)
	{
		var xpos = posxy[0];
		var ypos = posxy[1];

		//<rect x="50" y="20" width="150" height="150" style="fill:blue;" />
		var colorArray = this.GetHarmonicColors(count,bandwidth);

		var svg=d3.select("svg");
		var gr = svg.append('g').attr('class','harmonicBandTest');


		for(var i in colorArray)
		{
			gr.append('rect').attr('x',xpos).attr('y',ypos).attr('width',size)
			.attr('height',size).attr('style','fill:'+colorArray[i]+';');
			xpos += size;
		};
		return true;
	},

	GetSVG_HarmonicBandRGBTest:function(rgb, count,size,posxy)
	{
		var xpos = posxy[0];
		var ypos = posxy[1];

		var colorArray = this.GetHarmonicColorsFromRGB(rgb,count);

		var svg=d3.select("svg");
		var gr = svg.append('g').attr('class','harmonicBandRGBTest');


		for(var i in colorArray)
		{
			gr.append('rect').attr('x',xpos).attr('y',ypos).attr('width',size)
			.attr('height',size).attr('style','fill:'+colorArray[i]+';');
			xpos += size;
		};
		return true;
	},

	_AddArrays:function(a,b)
	{
		if(a.length!=b.length)
		{console.log('Array length not equal.'); return false;}
		
		var l = a.length;
		var result=[];
		for(var i in a){result.push(a[i])};
		for(i=0;i<a.length;i++)
		{
			result[i]+=b[i];
		};		
		return result;
	},
};

var colorPlate=
{
	 

};
