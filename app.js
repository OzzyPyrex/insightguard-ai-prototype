(function(){
'use strict';

var rows = [
  {date:'2026-05-01',day:'Fri',hour:7,route:'Downtown to Airport',driver:'Ravi Kumar',driver_id:'D101',vehicle:'TX204',customer_email:'amy@example.com',trips:412,revenue:16600,cancellations:10,complaints:5},
  {date:'2026-05-02',day:'Sat',hour:8,route:'CBD to Industrial Area',driver:'Jason Lee',driver_id:'D102',vehicle:'TX208',customer_email:'mark@example.com',trips:398,revenue:15300,cancellations:12,complaints:6},
  {date:'2026-05-03',day:'Sun',hour:10,route:'Airport to Suburbs',driver:'Fatima Ali',driver_id:'D103',vehicle:'TX211',customer_email:'sarah@example.com',trips:312,revenue:13200,cancellations:14,complaints:7},
  {date:'2026-05-04',day:'Mon',hour:11,route:'North Zone to CBD',driver:'Michael D',driver_id:'D104',vehicle:'TX218',customer_email:'john@example.com',trips:276,revenue:10900,cancellations:9,complaints:4},
  {date:'2026-05-05',day:'Tue',hour:9,route:'Port to Warehouse District',driver:'Priya Nair',driver_id:'D105',vehicle:'TX220',customer_email:'niamh@example.com',trips:264,revenue:9800,cancellations:8,complaints:4},
  {date:'2026-05-06',day:'Wed',hour:17,route:'Downtown to Airport',driver:'Ravi Kumar',driver_id:'D101',vehicle:'TX204',customer_email:'emma@example.com',trips:462,revenue:18400,cancellations:11,complaints:5},
  {date:'2026-05-07',day:'Thu',hour:18,route:'CBD to Industrial Area',driver:'Jason Lee',driver_id:'D102',vehicle:'TX208',customer_email:'paul@example.com',trips:435,revenue:17100,cancellations:8,complaints:3},
  {date:'2026-05-08',day:'Fri',hour:19,route:'Airport to Suburbs',driver:'Fatima Ali',driver_id:'D103',vehicle:'TX211',customer_email:'aoife@example.com',trips:388,revenue:15800,cancellations:13,complaints:6},
  {date:'2026-05-09',day:'Sat',hour:8,route:'North Zone to CBD',driver:'Michael D',driver_id:'D104',vehicle:'TX218',customer_email:'david@example.com',trips:390,revenue:14900,cancellations:11,complaints:5},
  {date:'2026-05-10',day:'Sun',hour:12,route:'Port to Warehouse District',driver:'Priya Nair',driver_id:'D105',vehicle:'TX220',customer_email:'grace@example.com',trips:320,revenue:11900,cancellations:17,complaints:8},
  {date:'2026-05-11',day:'Mon',hour:15,route:'Downtown to Airport',driver:'Ravi Kumar',driver_id:'D101',vehicle:'TX204',customer_email:'sean@example.com',trips:285,revenue:10800,cancellations:10,complaints:6},
  {date:'2026-05-12',day:'Tue',hour:7,route:'CBD to Industrial Area',driver:'Jason Lee',driver_id:'D102',vehicle:'TX208',customer_email:'laura@example.com',trips:402,revenue:15200,cancellations:6,complaints:2},
  {date:'2026-05-13',day:'Wed',hour:8,route:'Airport to Suburbs',driver:'Fatima Ali',driver_id:'D103',vehicle:'TX211',customer_email:'doyle@example.com',trips:430,revenue:16300,cancellations:7,complaints:3},
  {date:'2026-05-14',day:'Thu',hour:9,route:'Downtown to Airport',driver:'Ravi Kumar',driver_id:'D101',vehicle:'TX204',customer_email:'fleet@example.com',trips:476,revenue:19000,cancellations:9,complaints:4}
];

var state = {
  page:'dashboard',
  rows: clone(rows),
  uploads:[
    {file:'Trips_May_2026.xlsx',type:'Excel',by:'Aisha Khan',date:'May 31, 2026 10:15 AM',status:'Completed'},
    {file:'Drivers_Master.csv',type:'CSV',by:'Aisha Khan',date:'May 31, 2026 09:43 AM',status:'Completed'},
    {file:'Bookings_May_2026.xlsx',type:'Excel',by:'Aisha Khan',date:'May 30, 2026 06:31 PM',status:'Completed'},
    {file:'Complaints_Apr_2026.csv',type:'CSV',by:'Aisha Khan',date:'May 29, 2026 11:06 AM',status:'Completed'}
  ],
  checks:[
    {text:'Define AI use case and purpose',done:true},
    {text:'Assess data and impact',done:true},
    {text:'Ensure data privacy and security',done:true},
    {text:'Human oversight defined',done:false},
    {text:'Monitoring and reporting in place',done:false}
  ],
  customers:[
    {name:'FleetOps Transport Ltd',type:'Taxi / fleet',status:'Active',data:'4 datasets',score:87},
    {name:'MetroFleet Ireland',type:'Transport',status:'Pilot',data:'2 datasets',score:74},
    {name:'ClearRoute Logistics',type:'Fleet / courier',status:'Prospect',data:'Demo only',score:68}
  ],
  tickets:[
    {subject:'How do I upload monthly CSV files?',status:'Open',priority:'Medium'},
    {subject:'Need governance export for board meeting',status:'In progress',priority:'High'}
  ],
  org:'FleetOps Transport Ltd',
  user:'Aisha Khan',
  currency:'EUR',
    month:'May 2026'
};

try{
  var saved = localStorage.getItem('insightguard_fixed_state');
  if(saved){ state = Object.assign(state, JSON.parse(saved)); }
}catch(e){}

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
function save(){ try{ localStorage.setItem('insightguard_fixed_state', JSON.stringify(state)); }catch(e){} }
function money(n){ return new Intl.NumberFormat('en-IE',{style:'currency',currency:state.currency || 'EUR',maximumFractionDigits:0}).format(Number(n)||0); }
function num(n){ return new Intl.NumberFormat('en-IE').format(Math.round(Number(n)||0)); }
function pct(n){ return (Number(n)||0).toFixed(1)+'%'; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]; }); }

function toast(text){
  var t = $('#toast');
  if(!t) return;
  t.textContent = text;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

function aggregate(){
  var r = state.rows || [];
  var totalTrips = r.reduce(function(s,x){ return s + (+x.trips || +x.bookings || 0); },0);
  var revenue = r.reduce(function(s,x){ return s + (+x.revenue || +x.amount || +x.sales || 0); },0);
  var cancellations = r.reduce(function(s,x){ return s + (+x.cancellations || +x.cancelled || 0); },0);
  var complaints = r.reduce(function(s,x){ return s + (+x.complaints || +x.issues || 0); },0);
  var drivers = {};
  r.forEach(function(x){ if(x.driver){ drivers[x.driver]=true; } });
  var keys = r[0] ? Object.keys(r[0]) : [];
  var cells = r.length * keys.length;
  var missing = 0;
  r.forEach(function(x){ keys.forEach(function(k){ if(String(x[k] == null ? '' : x[k]).trim()==='') missing++; }); });
  var quality = cells ? Math.max(0, Math.round((1 - missing/cells)*100)) : 0;
  var complaintRate = totalTrips ? complaints/totalTrips*100 : 0;
  return {totalTrips:totalTrips,revenue:revenue,cancellations:cancellations,complaints:complaints,activeDrivers:Object.keys(drivers).length || 356,quality:quality,missing:missing,complaintRate:complaintRate};
}

function groupBy(key, valueKey){
  var map = {};
  (state.rows || []).forEach(function(r){
    var k = r[key] || 'Unknown';
    var v = +r[valueKey] || 0;
    map[k] = (map[k] || 0) + v;
  });
  return Object.keys(map).map(function(k){ return [k,map[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
}

function header(title, subtitle, actions){
  return '<div class="pageHeader"><div><h1>'+title+'</h1><p>'+subtitle+'</p></div><div class="actions">'+(actions||'')+'</div></div>';
}
function kpi(title, value, sub, tone, icon, down){
  return '<div class="metric '+(tone||'')+'" data-icon="'+icon+'"><small>'+title+'</small><strong>'+value+'</strong><p class="'+(down?'down':'')+'">'+sub+'</p></div>';
}
function table(rows, cols){
  return '<table class="dataTable"><thead><tr>'+cols.map(function(c){ return '<th>'+escapeHtml(c.label)+'</th>'; }).join('')+'</tr></thead><tbody>'+rows.map(function(r){ return '<tr>'+cols.map(function(c){ var v = typeof c.value==='function' ? c.value(r) : r[c.value]; return '<td>'+(c.html ? String(v) : escapeHtml(v == null ? '' : v))+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table>';
}

function lineChart(items){
  var values = items.map(function(x){ return +x[1] || 0; });
  var max = Math.max.apply(null, values.concat([1]));
  var min = Math.min.apply(null, values.concat([0]));
  var w=680,h=270,p=34;
  function x(i){ return p + i*((w-p*2)/Math.max(1,values.length-1)); }
  function y(v){ return h-p - ((v-min)/Math.max(1,max-min))*(h-p*2); }
  var pts = values.map(function(v,i){ return x(i)+','+y(v); }).join(' ');
  var area = p+','+(h-p)+' '+pts+' '+(w-p)+','+(h-p);
  var grid = [0,1,2,3,4].map(function(i){ var yy=p+i*(h-p*2)/4; return '<line class="axis" x1="'+p+'" x2="'+(w-p)+'" y1="'+yy+'" y2="'+yy+'"/>'; }).join('');
  var dots = values.map(function(v,i){ return '<circle class="dot" cx="'+x(i)+'" cy="'+y(v)+'" r="4"/>'; }).join('');
  var labels = items.map(function(d,i){ return i%2===0 ? '<text class="axisLabel" x="'+(x(i)-16)+'" y="'+(h-6)+'">'+escapeHtml(String(d[0]).slice(5))+'</text>' : ''; }).join('');
  return '<svg class="svgChart" viewBox="0 0 '+w+' '+h+'"><polygon class="area" points="'+area+'"></polygon>'+grid+'<polyline class="line" points="'+pts+'"></polyline>'+dots+labels+'</svg>';
}
function barChart(items){
  var values = items.map(function(x){ return +x[1] || 0; });
  var max = Math.max.apply(null, values.concat([1]));
  var w=450,h=270,p=34,gap=14;
  var bw = (w-p*2-gap*(items.length-1))/Math.max(1,items.length);
  var grid = [0,1,2,3,4].map(function(i){ var yy=p+i*(h-p*2)/4; return '<line class="axis" x1="'+p+'" x2="'+(w-p)+'" y1="'+yy+'" y2="'+yy+'"/>'; }).join('');
  var bars = items.map(function(d,i){
    var bh = (+d[1]/max)*(h-p*2), xx=p+i*(bw+gap), yy=h-p-bh;
    return '<rect class="bar" x="'+xx+'" y="'+yy+'" width="'+bw+'" height="'+bh+'" rx="8"></rect><text class="axisLabel" x="'+(xx+bw/2-12)+'" y="'+(h-6)+'">'+escapeHtml(d[0])+'</text>';
  }).join('');
  return '<svg class="svgChart" viewBox="0 0 '+w+' '+h+'">'+grid+bars+'</svg>';
}
function heatmap(){
  var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var hours=['12A','4A','8A','9A','11A','1P','3P','5P','7P','9P','11P','12A'];
  var html='<div class="heatmap"><span></span>'+hours.map(function(h){return '<span class="heatLabel">'+h+'</span>';}).join('');
  days.forEach(function(d,di){
    html+='<span class="heatLabel">'+d+'</span>';
    hours.forEach(function(h,hi){
      var val = Math.max(.08, Math.min(.95, ((Math.sin((hi-2.5)/2)+1)/2) * (di<5?1:.55) * .85));
      html+='<span class="heatCell" style="background:rgba(36,107,254,'+val.toFixed(2)+')"></span>';
    });
  });
  return html+'</div><div class="legend"><span>Low</span><span class="legendBar"></span><span>High</span></div>';
}

var stepDoc = '<div class="docBox"><h3>STEP business evidence pack</h3><p>This portfolio prototype illustrates a possible scalable SaaS direction. The product story is: AI-style SME analytics and governance for transport and fleet businesses, with export potential beyond Ireland.</p><div class="docGrid"><div><b>Minimum evidence</b><span>STEP form, €50k funding proof, source of funds, good character, innovative proposal, and application fee.</span></div><div><b>Strong evidence</b><span>Business plan, pitch deck, screenshots, demo, sample dashboard/report, forecast, and pilot interest emails.</span></div><div><b>Innovation angle</b><span>Dashboards plus AI-style explanations, data quality scoring, AI usage register, policy templates, and audit-ready reporting.</span></div><div><b>Future build scope</b><span>Product build, cloud hosting, secure upload pipeline, AI model integration, customer onboarding, and sales.</span></div></div></div>';

var pages = {
  dashboard:function(){
    var a=aggregate();
    var trend=(state.rows||[]).slice(0,14).map(function(r){return [r.date,+r.revenue||0];});
    var byDay=groupBy('day','trips');
    var dayOrder=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(d){ var f=byDay.filter(function(x){return x[0]===d;})[0]; return [d, f?f[1]:Math.round(a.totalTrips/7)]; });
    var routes=groupBy('route','revenue').slice(0,5).map(function(x){return {route:x[0],trips:num(x[1]/40),revenue:money(x[1])};});
    var drivers=groupBy('driver','revenue').slice(0,5).map(function(x){return {driver:x[0],trips:num(x[1]/90),revenue:money(x[1])};});
    return header('Dashboard','Overview of your fleet performance','<select class="control"><option>May 1 - May 31, 2026</option><option>Last 7 days</option></select><button class="plainBtn" id="filterBtn">☷ Filters</button>')+
    '<div class="grid kpis">'+
      kpi('Total Trips',num(a.totalTrips),'↑ 12.5% vs Apr 1 - Apr 30, 2026','', '⌬')+
      kpi('Revenue',money(a.revenue),'↑ 8.7% vs Apr 1 - Apr 30, 2026','green','$')+
      kpi('Active Drivers',num(a.activeDrivers),'↑ 5.4% vs Apr 1 - Apr 30, 2026','purple','♙')+
      kpi('Complaint Rate',pct(a.complaintRate),'↓ 0.6pp vs Apr 1 - Apr 30, 2026','orange','!',true)+'</div>'+
    '<div class="dashGrid"><div class="card"><div class="cardHeader"><h3>Revenue Trend</h3><select class="control"><option>Daily</option></select></div><div class="cardBody">'+lineChart(trend)+'</div></div>'+
    '<div class="card"><div class="cardHeader"><h3>Bookings by Day</h3><select class="control"><option>This Month</option></select></div><div class="cardBody">'+barChart(dayOrder)+'</div></div>'+
    '<div class="card pad aiPanel"><h3>✦ AI-style summary</h3><p>Demo summary: bookings are up, cancellations are down, and revenue is strongest on weekdays. Peak operating demand is concentrated around morning commute and early evening periods.</p><button class="softBtn full" data-go="insights">View full insights →</button></div>'+
    '<div class="card"><div class="cardHeader"><h3>Peak Hours Heatmap</h3></div><div class="cardBody">'+heatmap()+'</div></div>'+
    '<div class="card"><div class="cardHeader"><h3>Top Performing Routes</h3></div><div class="cardBody">'+table(routes,[{label:'Route',value:'route'},{label:'Trips',value:'trips'},{label:'Revenue',value:'revenue'}])+'<a class="link" data-go="reports">View all routes →</a></div></div>'+
    '<div class="card"><div class="cardHeader"><h3>Top Drivers by Revenue</h3></div><div class="cardBody">'+table(drivers,[{label:'Driver',value:'driver'},{label:'Trips',value:'trips'},{label:'Revenue',value:'revenue'}])+'<a class="link" data-go="customers">View all drivers →</a></div></div></div>';
  },
  upload:function(){
    return header('Upload Data','Upload your Excel or CSV files','<button class="softBtn" id="loadSample">Load sample data</button>')+
    '<div class="uploadLayout"><div class="card pad"><label class="uploadZone" id="uploadZone"><input class="hiddenInput" type="file" id="fileInput" accept=".csv,.txt,.xlsx,.xls"><div><div class="cloud">☁</div><h3>Drag and drop demo files here</h3><p>or</p><button class="primaryBtn" type="button" id="chooseFile">Choose Files</button><p class="fileHint">Use fictional, non-sensitive Excel, CSV, or text files only. Parsing happens locally in this browser.</p></div></label></div><div class="card"><div class="cardHeader"><div><h3>Prototype upload rules</h3><p>Browser-only demonstration; no server-side validation is provided.</p></div></div><div class="cardBody policyList"><div class="policyItem"><b>Allowed formats</b><span class="badge">CSV / Excel</span></div><div class="policyItem"><b>Max file size</b><span>10 MB demo limit</span></div><div class="policyItem"><b>Storage</b><span class="badge green">Local browser only</span></div><div class="policyItem"><b>Processing</b><span>Prototype simulation</span></div></div></div></div>'+
    '<div class="card" style="margin-top:18px"><div class="cardHeader"><h3>Recent Uploads</h3><button class="dangerBtn" id="clearUploads">Reset demo uploads</button></div><div class="cardBody">'+table(state.uploads,[{label:'File Name',value:'file'},{label:'Type',value:'type'},{label:'Uploaded By',value:'by'},{label:'Date',value:'date'},{label:'Status',html:true,value:function(r){return '<span class="badge green">'+escapeHtml(r.status)+'</span>';}}])+'</div></div>';
  },
  insights:function(){
    var a=aggregate();
    return header('AI Insights','Ask questions. Get answers. Take action.','<button class="softBtn" id="regenInsights">Regenerate insights</button>')+
    '<div class="insightsLayout"><div class="card pad"><div class="messages" id="messages"><div class="message user">What drove the revenue increase this month?</div><div class="message ai">Revenue increased because weekday bookings are stronger and the Downtown to Airport route is outperforming other routes. Current revenue is '+money(a.revenue)+' across '+num(a.totalTrips)+' trips.</div></div><form class="chatForm" id="chatForm"><input id="chatInput" placeholder="Ask about revenue, drivers, routes, data quality, or governance..."><button class="primaryBtn">Send</button></form></div><div class="card"><div class="cardHeader"><h3>Top Recommendations</h3></div><div class="cardBody grid"><div class="reco"><span class="badge orange">High impact</span><h4>Optimise peak-hour pricing</h4><p>Increase weekday pricing between 7-9 AM and 5-7 PM to maximise revenue.</p><a class="link">View details →</a></div><div class="reco"><span class="badge green">Medium impact</span><h4>Focus on top routes</h4><p>Downtown to Airport shows strongest revenue potential. Consider more fleet allocation.</p><a class="link">View details →</a></div><div class="reco"><span class="badge orange">Medium impact</span><h4>Reduce idle time</h4><p>Some drivers show higher idle time. Optimise schedules and shift coverage.</p><a class="link">View details →</a></div></div></div></div>';
  },
  reports:function(){
    var a=aggregate();
    return header('Reports','Generate and download business reports','<button class="primaryBtn" id="printReport">Download PDF</button><button class="plainBtn" id="exportCsv">Export Excel</button><button class="plainBtn" id="shareReport">Share</button>')+
    '<div class="reportLayout"><div class="reportCover"><div class="reportLogo">InsightGuard AI</div><h2>Monthly Performance Report</h2><p>'+escapeHtml(state.month)+'</p><div class="reportImage"></div><p><b>Includes:</b></p><ul><li>Executive summary</li><li>Key metrics</li><li>Trends and insights</li><li>Operational overview</li><li>Data quality summary</li><li>STEP evidence note</li></ul><p><small>Generated on '+new Date().toLocaleString('en-IE')+'</small></p></div><div class="grid"><div class="card pad"><h3>Report summary</h3><p style="margin-top:10px">This month shows '+num(a.totalTrips)+' trips, '+money(a.revenue)+' revenue, a '+pct(a.complaintRate)+' complaint rate, and '+a.quality+'% data quality. Recommended focus: peak-hour optimisation, missing data reduction, and governance documentation.</p><div class="reportActions"><button class="primaryBtn" id="printReport2">Download PDF</button><button class="plainBtn" id="exportCsv2">Export Excel</button><button class="plainBtn" id="shareReport2">Share</button></div></div>'+stepDoc+'</div></div>';
  },
  quality:function(){
    var a=aggregate();
    var keys=state.rows[0]?Object.keys(state.rows[0]).length:1; var missRate=state.rows.length?(a.missing/(state.rows.length*keys))*100:0;
    return header('Data Quality','Monitor and improve your data quality','<button class="softBtn" id="runValidation">Run validation</button>')+
    '<div class="qualityGrid"><div class="card pad"><h3>Overall Data Quality Score</h3><div class="scoreRing" style="--score:'+a.quality+'"><strong>'+a.quality+'%</strong></div><p style="text-align:center"><span class="badge green">'+(a.quality>=80?'Good':'Needs work')+'</span></p></div>'+
    kpi('Missing Data',pct(missRate),'↓ 1.1pp vs last upload','','—')+kpi('Duplicate Records','1.5%','↓ 0.4pp vs last upload','green','≡')+kpi('Validation Issues','2.8%','↓ 0.7pp vs last upload','green','!')+'</div>'+
    '<div class="twoCol" style="margin-top:18px"><div class="card"><div class="cardHeader"><h3>Missing Data by Column</h3></div><div class="cardBody">'+qrows(['Driver Phone','Vehicle Model','POD Proof of Delivery','Customer Email'],[64,41,29,12])+'<a class="link">View full data quality report →</a></div></div><div class="card"><div class="cardHeader"><h3>Validation Checks</h3></div><div class="cardBody policyList"><div class="policyItem"><b>✓ Date format is valid</b><span class="badge green">Passed</span></div><div class="policyItem"><b>✓ Trip distance greater than 0</b><span class="badge green">Passed</span></div><div class="policyItem"><b>✓ Revenue greater than or equal 0</b><span class="badge green">Passed</span></div><div class="policyItem"><b>○ Driver ID exists in master</b><span class="badge green">Passed</span></div><div class="policyItem"><b>○ Required fields not empty</b><span class="badge orange">Warning</span></div></div></div></div>';
  },
  governance:function(){
    var done=state.checks.filter(function(c){return c.done;}).length;
    return header('AI Governance','Manage AI usage, risk and compliance','<button class="primaryBtn" id="newUseCase">New AI use case</button><button class="plainBtn" id="policyPack">Download policy pack</button>')+
    '<div class="govGrid">'+kpi('AI Usage Register','12','Active use cases','','▦')+kpi('Overall AI Risk Level',done>=4?'Low':'Medium','Review risks →','orange','!')+kpi('High Risk Use Cases','2','Require attention','purple','⚑')+kpi('Policy Compliance',Math.round(done/state.checks.length*100)+'%','On track','green','✓')+'</div>'+
    '<div class="twoCol" style="margin-top:18px"><div class="card"><div class="cardHeader"><h3>AI Governance Checklist</h3></div><div class="cardBody">'+state.checks.map(function(c,i){return '<label class="checkItem"><input type="checkbox" data-check="'+i+'" '+(c.done?'checked':'')+'><span>'+c.text+'</span><span style="margin-left:auto" class="badge '+(c.done?'green':'orange')+'">'+(c.done?'Done':(i===3?'In progress':'Not started'))+'</span></label>';}).join('')+'</div></div><div class="card"><div class="cardHeader"><h3>Policy Templates</h3></div><div class="cardBody policyList"><div class="policyItem"><b>AI Use Policy</b><span class="badge green">Published</span></div><div class="policyItem"><b>Data Privacy Policy</b><span class="badge green">Published</span></div><div class="policyItem"><b>Model Risk Management Policy</b><span class="badge purple">Draft</span></div><div class="policyItem"><b>AI Ethics Principles</b><span class="badge green">Published</span></div><a class="link">View all policies →</a></div></div></div><div style="margin-top:18px">'+stepDoc+'</div>';
  },
  customers:function(){
    return header('Customer scenarios','Explore fictional customer and pilot examples','<button class="primaryBtn" id="addCustomer">Add demo customer</button><input class="search" id="customerSearch" placeholder="Search demo customers...">')+
    '<div class="threeCol" id="customerList">'+state.customers.map(customerCard).join('')+'</div><div class="card" style="margin-top:18px"><div class="cardHeader"><h3>Illustrative onboarding pipeline</h3></div><div class="cardBody">'+barChart([['Demo',7],['Pilot',3],['Illustrative',1],['Future',1]])+'</div></div>';
  },
  settings:function(){
    return header('Settings','Configure organisation, user profile and reporting defaults','<button class="primaryBtn" id="saveSettings">Save changes</button>')+
    '<div class="card pad"><div class="formGrid"><div class="field"><label>Organisation name</label><input id="setOrg" value="'+escapeHtml(state.org)+'"></div><div class="field"><label>User name</label><input id="setUser" value="'+escapeHtml(state.user)+'"></div><div class="field"><label>Email</label><input id="setEmail" value="admin@fleetops.example"></div><div class="field"><label>Currency</label><select id="setCurrency"><option '+(state.currency==='EUR'?'selected':'')+'>EUR</option><option '+(state.currency==='GBP'?'selected':'')+'>GBP</option><option '+(state.currency==='USD'?'selected':'')+'>USD</option></select></div><div class="field"><label>Default report month</label><input id="setMonth" value="'+escapeHtml(state.month)+'"></div><div class="field"><label>Data retention</label><select><option>12 months</option><option>24 months</option><option>36 months</option></select></div><div class="field full"><label>Governance note</label><textarea rows="5">This workspace tracks data quality, AI usage, reports, and SME governance readiness.</textarea></div></div></div>';
  },
  billing:function(){
    return header('Plan scenarios','Explore illustrative plans, prices, and prototype usage','<button class="primaryBtn" id="invoiceBtn">Download demo receipt</button>')+
    '<div class="threeCol"><div class="plan"><h3>Starter</h3><p>Illustrative scenario for early SME pilots</p><div class="price">€99/mo</div><ul><li>3 fictional uploads/month</li><li>Basic dashboard views</li><li>Monthly report preview</li></ul><button class="plainBtn full" data-plan="Starter">Preview</button></div><div class="plan featured"><span class="badge">Demo scenario</span><h3>Growth</h3><p>Illustrative scenario for transport operators</p><div class="price">€249/mo</div><ul><li>Local demo uploads</li><li>AI-style insights</li><li>Governance checklist</li><li>Report previews</li></ul><button class="primaryBtn full" data-plan="Growth">Preview</button></div><div class="plan"><h3>Scale</h3><p>Illustrative scenario for multi-site fleets</p><div class="price">€699/mo</div><ul><li>Integration concept</li><li>Custom governance templates</li><li>Future support concept</li></ul><button class="plainBtn full" data-plan="Scale">Preview</button></div></div><div class="card" style="margin-top:18px"><div class="cardHeader"><h3>Illustrative usage</h3></div><div class="cardBody policyList"><div class="policyItem"><b>Demo file uploads</b><span>4 / illustrative</span></div><div class="policyItem"><b>AI-style questions</b><span>128 / illustrative</span></div><div class="policyItem"><b>Reports previewed</b><span>7</span></div></div></div>';
  },
  support:function(){
    return header('Prototype guidance','Explore local examples for uploads, reports, and governance','<button class="softBtn" id="docsBtn">Download demo guide</button>')+
    '<div class="twoCol"><div class="card pad"><h3>Record a local demo request</h3><div class="formGrid" style="margin-top:16px"><div class="field"><label>Subject</label><input id="ticketSubject" placeholder="What would you like to demonstrate?"></div><div class="field"><label>Priority</label><select id="ticketPriority"><option>Low</option><option selected>Medium</option><option>High</option></select></div><div class="field full"><label>Message</label><textarea id="ticketMessage" rows="6" placeholder="Describe a demo scenario..."></textarea></div><button class="primaryBtn" id="submitTicket">Save locally</button></div></div><div class="card"><div class="cardHeader"><h3>Local demo requests</h3></div><div class="cardBody policyList">'+state.tickets.map(function(t){return '<div class="policyItem"><div><b>'+escapeHtml(t.subject)+'</b><p>'+escapeHtml(t.priority)+' priority</p></div><span class="badge '+(t.status==='Open'?'orange':'purple')+'">'+escapeHtml(t.status)+'</span></div>';}).join('')+'</div></div></div><div class="card" style="margin-top:18px"><div class="cardHeader"><h3>Quick demo guide</h3></div><div class="cardBody threeCol"><div><h3>Upload guide</h3><p>Use fictional CSV data with date, driver, route, trips, revenue, and complaints columns.</p></div><div><h3>Report guide</h3><p>Preview monthly report layouts and export local CSV rows.</p></div><div><h3>Governance guide</h3><p>Explore illustrative AI-use cases, policies, and checklist evidence.</p></div></div></div>';
  }
};
function qrows(names,vals){ return names.map(function(n,i){ var cls=vals[i]>55?'orange':''; return '<div class="qrow"><b>'+n+'</b><div class="progress '+cls+'"><span style="width:'+vals[i]+'%"></span></div><span>'+(vals[i]/10).toFixed(1)+'%</span></div>'; }).join(''); }
function customerCard(c){ return '<div class="customerCard"><span class="avatar">'+c.name.split(' ').map(function(x){return x[0];}).slice(0,2).join('')+'</span><div style="flex:1"><h3>'+escapeHtml(c.name)+'</h3><p>'+escapeHtml(c.type)+'</p><p><span class="badge '+(c.status==='Active'?'green':c.status==='Pilot'?'orange':'purple')+'">'+escapeHtml(c.status)+'</span> <span class="badge">'+escapeHtml(c.data)+'</span></p></div><b>'+c.score+'%</b></div>'; }

function render(){
  var page = state.page || 'dashboard';
  $('.pageCrumb').textContent = ({dashboard:'Dashboard',upload:'Upload Data',insights:'AI Insights',reports:'Reports',quality:'Data Quality',governance:'AI Governance',customers:'Customers',settings:'Settings',billing:'Billing',support:'Support'})[page] || 'Dashboard';
  $all('.navBtn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-page')===page); });
  $('#page').innerHTML = pages[page] ? pages[page]() : pages.dashboard();
  bindCommon();
  bindPage(page);
}
function go(page){ state.page=page; save(); $('#sidebar').classList.remove('open'); render(); }
function bindCommon(){
  $all('[data-go]').forEach(function(el){ el.onclick=function(e){ e.preventDefault(); go(el.getAttribute('data-go')); }; });
}
function bindPage(page){
  if(page==='dashboard') $('#filterBtn').onclick=function(){ toast('Filters refreshed'); };
  if(page==='upload') bindUpload();
  if(page==='insights') bindInsights();
  if(page==='reports') bindReports();
  if(page==='quality') $('#runValidation').onclick=function(){ toast('Validation completed'); render(); };
  if(page==='governance') bindGovernance();
  if(page==='customers') bindCustomers();
  if(page==='settings') bindSettings();
  if(page==='billing') bindBilling();
  if(page==='support') bindSupport();
}
function bindUpload(){
  var zone=$('#uploadZone'), input=$('#fileInput');
  $('#chooseFile').onclick=function(){ input.click(); };
  input.onchange=function(e){ if(e.target.files[0]) handleFile(e.target.files[0]); };
  ['dragenter','dragover'].forEach(function(ev){ zone.addEventListener(ev,function(e){ e.preventDefault(); zone.classList.add('drag'); }); });
  ['dragleave','drop'].forEach(function(ev){ zone.addEventListener(ev,function(e){ e.preventDefault(); zone.classList.remove('drag'); }); });
  zone.addEventListener('drop',function(e){ var f=e.dataTransfer.files[0]; if(f) handleFile(f); });
  $('#loadSample').onclick=function(){ state.rows=clone(rows); state.uploads.unshift({file:'sample_fleet_data.csv',type:'CSV',by:state.user,date:new Date().toLocaleString('en-IE'),status:'Completed'}); save(); toast('Sample dataset loaded'); go('dashboard'); };
  $('#clearUploads').onclick=function(){ state.uploads=[]; save(); toast('Upload history cleared'); render(); };
}
function handleFile(file){
  var ext=(file.name.split('.').pop()||'').toUpperCase();
  state.uploads.unshift({file:file.name,type:ext==='CSV'||ext==='TXT'?'CSV':'Excel',by:state.user,date:new Date().toLocaleString('en-IE'),status:'Completed'});
  if(ext!=='CSV' && ext!=='TXT'){ state.rows=clone(rows); save(); toast('Excel file accepted. Demo sample data loaded.'); go('dashboard'); return; }
  var reader=new FileReader();
  reader.onload=function(){
    try{ state.rows=normaliseRows(parseCSV(String(reader.result))); save(); toast(file.name+' processed'); go('dashboard'); }
    catch(e){ toast('CSV could not be read. Check headers.'); }
  };
  reader.readAsText(file);
}
function parseCSV(text){
  var lines=text.trim().split(/\r?\n/); if(!lines.length) return [];
  var headers=splitCSV(lines.shift()).map(function(h){return h.trim().toLowerCase().replace(/\s+/g,'_');});
  return lines.filter(Boolean).map(function(line){ var vals=splitCSV(line), obj={}; headers.forEach(function(h,i){obj[h]=vals[i]||'';}); return obj; });
}
function splitCSV(line){
  var out=[],cur='',quote=false;
  for(var i=0;i<line.length;i++){ var c=line[i],n=line[i+1]; if(c==='"'&&quote&&n==='"'){cur+='"';i++;} else if(c==='"'){quote=!quote;} else if(c===','&&!quote){out.push(cur);cur='';} else cur+=c; }
  out.push(cur); return out.map(function(x){return x.trim();});
}
function normaliseRows(input){
  return input.map(function(r,i){return {date:r.date||r.month||('2026-05-'+String((i%28)+1).padStart(2,'0')),day:r.day||['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i%7],hour:+(r.hour||7+i%12),route:r.route||r.area||'Downtown to Airport',driver:r.driver||r.staff||r.agent||('Driver '+(i+1)),driver_id:r.driver_id||r.staff_id||'',vehicle:r.vehicle||r.vehicle_id||'',customer_email:r.customer_email||r.email||'',trips:+(r.trips||r.bookings||r.jobs||1),revenue:+String(r.revenue||r.amount||r.sales||0).replace(/[€$£,\s]/g,''),cancellations:+(r.cancellations||r.cancelled||0),complaints:+(r.complaints||r.issues||0)};});
}
function bindInsights(){
  $('#regenInsights').onclick=function(){ toast('AI insights regenerated'); };
  $('#chatForm').onsubmit=function(e){ e.preventDefault(); var input=$('#chatInput'); var q=input.value.trim(); if(!q) return; var m=$('#messages'); m.insertAdjacentHTML('beforeend','<div class="message user">'+escapeHtml(q)+'</div><div class="message ai">'+answer(q)+'</div>'); input.value=''; m.scrollTop=m.scrollHeight; };
}
function answer(q){ var a=aggregate(), s=q.toLowerCase(); if(s.indexOf('revenue')>-1) return 'Revenue is '+money(a.revenue)+'. The strongest route is '+(groupBy('route','revenue')[0]||['Downtown to Airport'])[0]+', with weekday peaks driving the increase.'; if(s.indexOf('quality')>-1||s.indexOf('missing')>-1) return 'The current data quality score is '+a.quality+'%. I found '+a.missing+' missing cells in the loaded data.'; if(s.indexOf('governance')>-1||s.indexOf('risk')>-1) return 'AI governance risk is Medium because customer data is present and two checklist controls are still incomplete.'; return 'The strongest actions are peak-hour optimisation, top-route allocation, missing data fixes, and keeping AI governance evidence ready.'; }
function bindReports(){ ['printReport','printReport2'].forEach(function(id){ var b=$('#'+id); if(b) b.onclick=function(){ toast('Choose Save as PDF in the print dialog'); setTimeout(function(){ window.print(); },200); }; }); ['exportCsv','exportCsv2'].forEach(function(id){ var b=$('#'+id); if(b) b.onclick=downloadCsv; }); ['shareReport','shareReport2'].forEach(function(id){ var b=$('#'+id); if(b) b.onclick=function(){ try{ navigator.clipboard.writeText(location.href); toast('Report link copied'); }catch(e){ toast('Copy the browser URL to share'); } }; }); }
function downloadCsv(){ var headers=['date','day','hour','route','driver','driver_id','vehicle','customer_email','trips','revenue','cancellations','complaints']; var csv=[headers.join(',')].concat(state.rows.map(function(r){ return headers.map(function(h){ return '"'+String(r[h]||'').replace(/"/g,'""')+'"'; }).join(','); })).join('\n'); download(csv,'InsightGuard_Report_Export.csv','text/csv'); toast('CSV export downloaded'); }
function download(text,name,type){ var blob=new Blob([text],{type:type}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url); }
function bindGovernance(){ $all('[data-check]').forEach(function(c){ c.onchange=function(){ state.checks[+c.getAttribute('data-check')].done=c.checked; save(); toast('Checklist updated'); render(); }; }); $('#newUseCase').onclick=function(){ toast('New AI use case added'); }; $('#policyPack').onclick=function(){ download('InsightGuard AI Policy Pack\n\nAI Use Policy\nData Privacy Policy\nModel Risk Management Policy\nAI Ethics Principles','InsightGuard_AI_Policy_Pack.txt','text/plain'); }; }
function bindCustomers(){ $('#addCustomer').onclick=function(){ state.customers.unshift({name:'New Pilot Company',type:'Transport / fleet',status:'Prospect',data:'Demo only',score:65}); save(); toast('Customer added'); render(); }; $('#customerSearch').oninput=function(e){ var term=e.target.value.toLowerCase(); $all('#customerList .customerCard').forEach(function(c){ c.style.display=c.textContent.toLowerCase().indexOf(term)>-1?'flex':'none'; }); }; }
function bindSettings(){ $('#saveSettings').onclick=function(){ state.org=$('#setOrg').value; state.user=$('#setUser').value; state.currency=$('#setCurrency').value; state.month=$('#setMonth').value; $('#companySelect').options[0].text=state.org; $('#topUser').textContent=state.user; save(); toast('Settings saved'); render(); }; }
function bindBilling(){ $('#invoiceBtn').onclick=function(){ if(window.downloadPrototypeReceipt){ window.downloadPrototypeReceipt(); } else { toast('Complete a prototype checkout to download the demo receipt.'); } }; $all('[data-plan]').forEach(function(b){ b.onclick=function(){ toast(b.getAttribute('data-plan')+' demo scenario selected'); }; }); }
function bindSupport(){ $('#docsBtn').onclick=function(){ toast('Demo guide opened locally'); }; $('#submitTicket').onclick=function(){ var subj=$('#ticketSubject').value.trim(); if(!subj){ toast('Enter a demo request subject'); return; } state.tickets.unshift({subject:subj,status:'Local',priority:$('#ticketPriority').value}); save(); toast('Demo request saved locally'); render(); }; }

function init(){
  $all('.navBtn').forEach(function(b){ b.onclick=function(){ go(b.getAttribute('data-page')); }; });
  $('#mobileMenuBtn').onclick=function(){ $('#sidebar').classList.toggle('open'); };
  $('#notifyBtn').onclick=function(){ toast('No new notifications'); };
  $('#companySelect').onchange=function(e){ toast('Switched to '+e.target.value); };
  $('#companySelect').options[0].text = state.org;
  $('#topUser').textContent = state.user;
  render();
}

document.addEventListener('DOMContentLoaded', init);
})();
