
var rotate=false;
var width=window.innerWidth, height=window.innerHeight;
window.devicePixelRatio=height/800;
var count=1,angle=0;
var x,y,z,layout;

//dataStart
document.body.addEventListener('keypress', triggerRotate);function triggerRotate(){if(rotate==true){rotate=false;}else{rotate=true;requestAnimationFrame(update);}};
var xname="Item100-xCoord", yname="Item100-yCoord", zname="Item136-mfl";
var d0={x:[-499422,-497172,-496044,-494918,-493800,-492702,-491582,-490464,-489342,-488212,-487090,-485952,-484820,-483636,-482450,-481144,-479876,-478612,-477272,-475928,-474552,-473162,-471774,-470330,-468906,-467492,-466062,-464634,-463212,-461794,-460358,-458938,-457508,-456086,-454672,-453252,-451822,-450364,-448914,-447474,-446024,-444562,-443106,-441664,-440214,-438756,-437310,-435828,-434354,-432872,-431392,-429926,-428438,-426956,-425446,-423950,-422458,-420958,-419456,-417954,-416450,-414946,-413428,-411928,-410428,-408902,-407386,-405842,-404314,-402780,-401238,-399690,-398178,-396650,-395114,-393574,-392044,-390522,-388978,-387446,-385908,-384358,-382802,-381258,-379704,-378158,-376606,-375094,-373540,-372000,-370420,-368884,-367324,-365770,-364184,-362624,-361060,-359500,-357924,-356342,-354766,-353166,-351570,-349982,-348416,-346828,-345250,-343648,-342056,-340482,-338908,-337300,-335706,-334094,-332464,-330850,-329242,-327654,-326054,-324456,-322850,-321260,-319684,-318116,-316542,-314990,-313434,-311868,-310310,-308754,-307190,-305614,-304042,-302494,-300926,-299372,-297818,-296256,-294694,-293128,-291570,-290010,-288420,-286846,-285298,-283720,-282152,-280564,-278972,-277406,-275810,-274220,-272614,-271026,-269440,-267862,-266288,-264702,-263124,-261544,-259960,-258376,-256794,-255232,-253676,-252108,-250562,-249002,-247438,-245884,-244342,-242780,-241234,-239676,-238118,-236572,-235016,-233454,-231902,-230328,-228768,-227196,-225630,-224054,-222584,-221034,-219498,-217976,-216486,-214962,-213468,-211970,-210484,-208990,-207520,-206022,-204526,-203026,-201524,-200050,-198572,-197082,-195600,-194104,-192608,-191106,-189610,-188108,-186616,-185118,-183622,-182134,-180638,-179130,-177630,-176150,-174644,-173152,-171648,-170146,-168636,-167128,-165628,-164106,-162612,-161090,-159590,-158094,-156594,-155084,-153560,-152064,-150562,-149066,-147554,-146048,-144538,-143032,-141528,-140032,-138534,-137024,-135522,-133992,-132486,-130980,-129472,-127982,-126472,-124954,-123430,-121930,-120424,-118938,-117432,-115900,-114406,-112896,-111388,-109886,-108380,-106882,-105382,-103862,-102348,-100842,-99342,-97840,-96354,-94868,-93374,-91874,-90374,-88850,-87334,-85834,-84320,-82818,-81308,-79794,-78292,-76788,-75290,-73768,-72266,-70776,-69274,-67764,-66256,-64766,-63262,-61742,-60238,-58732,-57226,-55714,-54218,-52702,-51198,-49694,-48202,-46704,-45202,-43696,-42200,-40698,-39200,-37686,-36184,-34678,-33174,-31664,-30170,-28662,-27168,-25650,-24144,-22646,-21148,-19648,-18144,-16644,-15132,-13638,-12132,-10636,-9102,-7592,-6084,-4600,-3102,-1608,-116,1380,2894,4384,5874,7384,8898,10404,11882,13346,14748,16092,17480,18866,20236,21608,22990,24374,25754,27152,28544,29942,31334,32720,34104,35500,36880,38276,39684,41062,42450,43828,45222,46610,47996,49380,50772,52158,53540,54920,56302,57690,59084,60478,61854,63238,64622,66018,67394,68772,70164,71548,72940,74328,75714,77084,78480,79848,81220,82604,83984,85368,86742,88122,89496,90866,92242,93628,95004,96388,97764,99142,100524,101904,103272,104632,106002,107374,108726,110092,111454,112806,114168,115542,116914,118288,119662,121042,122394,123768,125138,126486,127866,129228,130592,131974,133338,134706,136080,137458,138830,140202,141572,142944,144304,145670,147046,148410,149784,151156,152520,153904,155282,156662,158056,159426,160798,162190,163562,164948,166332,167704,169084,170468,171852,173230,174608,176016,177406,178772,180156,181526,182908,184292,185676,187060,188442,189830,191204,192576,193976,195358,196740,198128,199512,200866,202190,203458,204750,206034,207282,208534,209790,210998,212228,213430,214614,215820,217008,218206,219414,220596,221770,222962,224148,225346,226542,227726,228906,230076,231256,232442,233636,234818,236004,237186,238366,239548,240720,241904,243090,244272,245442,246598,247764,248952,250124,251292,252396,253560,254732,255914,257094,258256,259430,260608,261782,262956,264142,265318,266490,267664,268850,270032,271206,272362,273512,274674,275832,276772,277744,278672,279648,280620,281548,282420,],y:[223140,223290,221928,220602,219268,217914,216564,215224,213868,212510,211160,209794,208444,207110,205790,204530,203254,201992,200804,199616,198468,197320,196168,195058,193954,192824,191716,190602,189486,188364,187236,186106,184972,183840,182720,181600,180470,179324,178178,177040,175890,174736,173584,172436,171288,170136,168990,167824,166662,165490,164314,163154,161978,160802,159612,158428,157244,156060,154870,153684,152494,151292,150084,148896,147708,146504,145300,144074,142864,141648,140426,139206,138006,136794,135576,134356,133138,131926,130702,129482,128258,127026,125786,124556,123326,122100,120872,119676,118452,117228,115980,114762,113526,112296,111044,109812,108578,107344,106098,104848,103600,102334,101062,99800,98558,97300,96050,94784,93520,92278,91034,89758,88494,87216,85928,84652,83376,82116,80852,79584,78310,77044,75792,74540,73286,72052,70822,69580,68356,67122,65884,64642,63400,62172,60932,59708,58480,57250,56018,54778,53546,52316,51054,49810,48584,47336,46096,44844,43576,42334,41070,39814,38544,37284,36032,34784,33538,32286,31038,29784,28526,27276,26024,24790,23566,22324,21098,19858,18616,17382,16152,14904,13676,12446,11214,9990,8760,7530,6298,5058,3832,2614,1428,220,-918,-2148,-3376,-4634,-5930,-7184,-8476,-9768,-11054,-12374,-13680,-14978,-16284,-17590,-18906,-20194,-21492,-22798,-24100,-25416,-26724,-28046,-29358,-30688,-32008,-33330,-34654,-35958,-37280,-38608,-39932,-41248,-42580,-43900,-45224,-46552,-47888,-49218,-50544,-51894,-53214,-54556,-55884,-57204,-58532,-59858,-61198,-62522,-63846,-65174,-66510,-67844,-69184,-70518,-71848,-73174,-74508,-75830,-77160,-78508,-79844,-81172,-82506,-83846,-85160,-86488,-87834,-89156,-90484,-91796,-93130,-94478,-95798,-97128,-98456,-99792,-101116,-102446,-103778,-105108,-106444,-107784,-109124,-110444,-111758,-113070,-114388,-115718,-117032,-118366,-119704,-121028,-122364,-123694,-125022,-126358,-127700,-129028,-130352,-131688,-133010,-134322,-135648,-136980,-138306,-139620,-140934,-142276,-143608,-144942,-146264,-147596,-148924,-150260,-151590,-152928,-154242,-155574,-156908,-158242,-159562,-160884,-162214,-163528,-164842,-166188,-167528,-168844,-170164,-171484,-172794,-174128,-175460,-176784,-178114,-179442,-180764,-182096,-183426,-184746,-186060,-187378,-188728,-190064,-191398,-192716,-194040,-195364,-196678,-197998,-199334,-200648,-201962,-203298,-204630,-205972,-207326,-208700,-210124,-211602,-213066,-214552,-216012,-217452,-218900,-220352,-221822,-223304,-224796,-226272,-227682,-229126,-230514,-231960,-233394,-234830,-236276,-237704,-239148,-240584,-242032,-243476,-244928,-246402,-247836,-249264,-250712,-252138,-253566,-255006,-256430,-257874,-259306,-260742,-262184,-263636,-265066,-266502,-267962,-269412,-270870,-272320,-273770,-275208,-276668,-278104,-279540,-280986,-282432,-283872,-285312,-286756,-288194,-289616,-291064,-292512,-293958,-295398,-296876,-298286,-299726,-301168,-302606,-304036,-305486,-306934,-308374,-309820,-311268,-312708,-314158,-315610,-317072,-318524,-319984,-321444,-322884,-324336,-325776,-327202,-328664,-330108,-331550,-333020,-334476,-335928,-337384,-338852,-340300,-341752,-343206,-344666,-346112,-347564,-349030,-350478,-351942,-353400,-354850,-356314,-357766,-359210,-360666,-362098,-363544,-365000,-366438,-367892,-369344,-370782,-372228,-373680,-375134,-376574,-378026,-379508,-380972,-382406,-383856,-385294,-386748,-388206,-389662,-391120,-392570,-394030,-395472,-396916,-398378,-399828,-401286,-402736,-404196,-405686,-407174,-408684,-410242,-411796,-413376,-414972,-416540,-418122,-419708,-421302,-422888,-424500,-426106,-427730,-429342,-430950,-432568,-434184,-435806,-437442,-439066,-440680,-442300,-443910,-445524,-447150,-448790,-450414,-452044,-453668,-455288,-456910,-458528,-460156,-461784,-463408,-465012,-466596,-468192,-469816,-471420,-473020,-474528,-476120,-477722,-479340,-480948,-482540,-484148,-485758,-487364,-488972,-490598,-492210,-493818,-495434,-497064,-498680,-500292,-501918,-503572,-505204,-506844,-508662,-510412,-512192,-513956,-515716,-517514,-519354,],z:[728,735,742,747,751,758,763,766,772,774,776,787,790,797,801,807,812,816,821,826,830,833,836,839,844,848,855,862,866,872,878,884,888,892,896,899,903,907,912,917,921,926,929,933,939,942,945,950,953,956,960,964,968,972,977,979,984,985,990,993,996,1001,1006,1008,1011,1016,1018,1022,1026,1029,1032,1036,1046,1050,1052,1059,1064,1064,1069,1072,1074,1080,1086,1087,1095,1097,1102,1104,1109,1112,1115,1116,1121,1124,1128,1130,1134,1136,1140,1144,1148,1152,1156,1158,1161,1165,1168,1171,1174,1177,1179,1183,1185,1189,1192,1195,1198,1203,1208,1212,1222,1224,1232,1241,1247,1253,1258,1262,1266,1270,1274,1278,1282,1285,1289,1292,1295,1300,1302,1306,1309,1312,1315,1317,1319,1320,1321,1321,1321,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1321,1322,1324,1327,1331,1335,1339,1343,1347,1351,1355,1359,1364,1367,1370,1374,1378,1381,1384,1387,1390,1393,1395,1397,1398,1400,1400,1400,1401,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,],};
var t0={x:d0.x,y:d0.y,z:d0.z,name: "1102.csv",mode: 'lines',line: {width: 3,opacity: 0.3,color: 'rgb(232,240,225)'},type:'scatter3d',hoverinfo:'title+x+y+z'};
var t1={x:[d0.x[0]],y:[d0.y[0]],z:[d0.z[0]],name: "1102.csv",mode: 'markers',marker: {size: 5,opacity: 0.1,color: 'rgb(232,240,225)'},type:'scatter3d',hoverinfo:'title+x+y+z',showlegend:false};
var xname="Item100-xCoord", yname="Item100-yCoord", zname="Item136-mfl";
var d2={x:[-476792,-476128,-475232,-474204,-473628,-473036,-459106,-458470,-455964,-455006,-454502,-453794,-452150,-451278,-450474,-449626,-448830,-448040,-447248,-446446,-445664,-444866,-444058,-443254,-442178,-441612,-440850,-440032,-439224,-438406,-437602,-436798,-435968,-435146,-431900,-431100,-430304,-429502,-428698,-427890,-427076,-426256,-425438,-424614,-423760,-422912,-422058,-421194,-420342,-419494,-418644,-417794,-416936,-416080,-415224,-414362,-413498,-412632,-411768,-410892,-410022,-409156,-408280,-407412,-406544,-405676,-404800,-403928,-403048,-402172,-401294,-400424,-399550,-398676,-397804,-396924,-396052,-395174,-394296,-393424,-392546,-391666,-390786,-389908,-389030,-388154,-387264,-386388,-385524,-384682,-383870,-383076,-382228,-381016,-380078,-379158,-378242,-377330,-376412,-375500,-374578,-373658,-372738,-371822,-370902,-369984,-369066,-368152,-367238,-366322,-365400,-364476,-363554,-362632,-361706,-360782,-359860,-358934,-358002,-357078,-356160,-355220,-354274,-353336,-352400,-351468,-350536,-349622,-348682,-347750,-346822,-345900,-344972,-344058,-343138,-342222,-341304,-340382,-339458,-338538,-337618,-336690,-335764,-334844,-333922,-333008,-332090,-331176,-330260,-329348,-328432,-327522,-326632,-325750,-324908,-324038,-323202,-322366,-321562,-320732,-319898,-319060,-318220,-317380,-316546,-315694,-314874,-314104,-313280,-311890,-311354,-310508,-311032,-310686,-308150,-307278,-306474,],y:[420446,422520,424454,426532,428116,429742,458308,459610,464080,465690,466906,468274,470206,471676,473154,474708,476168,477640,479108,480568,482076,483554,485038,486530,488728,489334,490992,492496,493994,495506,496998,498502,500024,501546,507582,509086,510592,512102,513606,515110,516618,518132,519642,521150,522662,524174,525694,527210,528732,530250,531768,533288,534810,536330,537856,539384,540912,542448,543978,545518,547050,548584,550128,551664,553194,554732,556254,557786,559310,560844,562378,563920,565464,567010,568558,570116,571662,573226,574784,576340,577900,579464,581026,582594,584162,585742,587308,588884,590470,592066,593652,595364,596964,598462,600028,601604,603176,604760,606344,607928,609520,611110,612704,614300,615898,617498,619100,620712,622326,623928,625536,627146,628760,630378,631992,633612,635230,636852,638480,640110,641742,643376,645010,646648,648282,649920,651544,653184,654788,656390,658002,659614,661220,662804,664406,666016,667630,669246,670862,672482,674102,675718,677336,678956,680566,682170,683784,685390,686994,688598,690202,691804,693414,695034,696672,698302,699946,701592,703256,704906,706554,708196,709844,711488,713140,714774,716436,718156,719932,721888,722952,724644,726364,728178,729446,730996,732690,],z:[659,662,667,670,670,670,781,781,792,795,800,806,810,814,819,822,826,828,831,832,836,838,843,848,852,856,860,863,865,869,869,874,878,883,900,905,909,912,913,915,918,921,924,927,931,934,937,940,943,946,951,954,957,961,963,966,968,970,974,977,980,984,988,993,997,1002,1005,1009,1011,1014,1016,1019,1021,1024,1027,1030,1033,1036,1040,1043,1044,1046,1046,1048,1050,1052,1055,1058,1061,1064,1068,1071,1074,1078,1081,1084,1087,1089,1091,1093,1094,1095,1098,1100,1103,1106,1109,1112,1114,1117,1118,1120,1122,1124,1126,1128,1130,1132,1134,1136,1138,1140,1142,1145,1148,1151,1151,1152,1153,1155,1155,1157,1158,1160,1161,1163,1165,1168,1170,1173,1176,1179,1183,1186,1190,1194,1197,1201,1204,1208,1211,1214,1216,1218,1220,1223,1225,1228,1230,1233,1235,1238,1241,1243,1247,1250,1253,1255,1258,1261,1264,1268,1272,1275,1279,1282,1282,],};
var t2={x:d2.x,y:d2.y,z:d2.z,name: "1140.csv",mode: 'lines',line: {width: 3,opacity: 0.3,color: 'rgb(238,225,152)'},type:'scatter3d',hoverinfo:'title+x+y+z'};
var t3={x:[d2.x[0]],y:[d2.y[0]],z:[d2.z[0]],name: "1140.csv",mode: 'markers',marker: {size: 5,opacity: 0.1,color: 'rgb(238,225,152)'},type:'scatter3d',hoverinfo:'title+x+y+z',showlegend:false};
var data=[t0,t1,t2,t3,];
var xAxis=[-499422,282420];
var yAxis=[-519354,732690];
var zAxis=[659,1401];
var maxCount=548;function update () { 
 if(count==maxCount-1)
 {count=0;}
   if(angle==8*Math.PI)
 {angle=0;} 
 

  
 var layout2= {
    scene:{	  
	  camera:{	 
	   up:{x:0,y:0,z:1,},
	  center:{x:0,y:0,z:0,},
	  eye:{x:1.25*Math.sin(angle),y:1.25*Math.cos(angle),z:1,},	  
	  },
	}
  };

  //graphName, dataInfo,animationInfo
//data

var tt0={x:[d0.x[count]],y:[d0.y[count]],z:[d0.z[count]],mode: 'markers',marker:{opacity: 0.8}};
var tt1={x:[d2.x[count]],y:[d2.y[count]],z:[d2.z[count]],mode: 'markers',marker:{opacity: 0.8}};tracePos=[1,3,];
var data2=[tt0,tt1,];

  Plotly.animate('myDiv', {
		//posA
		data: data2, 
		traces: tracePos,
		layout:layout2,
		},
		
		
  {
    transition: {
      duration: 0,
    },
    frame: {
      duration: 0,
      redraw: false,
    }
  });
  
    count+=1;
	angle+=2*Math.PI/720;
	if(rotate==true)
	{
		requestAnimationFrame(update);
		}
};



function use(my_chart){
layout = {
     paper_bgcolor: 'black',
     plot_bgcolor: 'black',
	 font: {color: 'white'},
	  
	width: width,
	height: height,
	margin: {
		l: 50,
		r: 0,
		b: 75,
		t: 0
	},

//axisPos1
			
	
    scene:{
	  aspectmode: "manual", 
	  
	  camera:{
		up:{x:0,y:0,z:1,},
		center:{x:0,y:0,z:0,},
		eye:{x:1.25*Math.sin(angle),y:1.25*Math.cos(angle),z:1,},
		},	
		
     aspectratio: { 
		  x: 1, 
        y: 1,
		  z: 1,
		},
		
//axisPos2
xaxis: {nticks: 10,range: [Math.min.apply(null,x), Math.max.apply(null,x)],title: xname,showticklabels: true,showgrid: true,gridcolor: 'white'},yaxis: {nticks: 10,range: [Math.min.apply(null,y), Math.max.apply(null,y)],title: yname,showticklabels: true,showgrid: true,gridcolor: 'white'},zaxis: {nticks: 10,range: [Math.min.apply(null,z), Math.max.apply(null,z)],title: zname,showticklabels: true,showgrid: true,gridcolor: 'white'},		} 
  };  
  
Plotly.newPlot(my_chart, data, layout);
};
function toInt(q)
{return +(q);}