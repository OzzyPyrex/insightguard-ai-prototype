(function(){
  'use strict';

  var $ = function(s, root){ return (root || document).querySelector(s); };
  var $$ = function(s, root){ return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var planPrices = { Starter:99, Growth:249, Scale:699 };
  var planDescriptions = {
    Starter:'For early SME reporting pilots',
    Growth:'For growing operational teams',
    Scale:'For multi-site organisations'
  };
  var checkoutState = { plan:'Growth', cycle:'monthly', coupon:'', paymentMethod:'card', discount:0 };
  var lastTransaction = null;

  function storageGet(key){ try{return window.localStorage.getItem(key);}catch(e){return null;} }
  function storageSet(key,value){ try{window.localStorage.setItem(key,value);return true;}catch(e){return false;} }
  function storageRemove(key){ try{window.localStorage.removeItem(key);}catch(e){} }

  function showToast(message){
    var toast = $('#toast');
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function(){ toast.classList.remove('show'); }, 2500);
  }

  function showOnly(view){
    ['marketingSite','applicationShell','checkoutView','paymentSuccess'].forEach(function(id){
      var el = $('#'+id); if(el) el.classList.toggle('isHidden', id !== view);
    });
    window.scrollTo(0,0);
  }

  function launchApp(page){
    storageSet('ig_view','app');
    showOnly('applicationShell');
    if(page){
      setTimeout(function(){
        var btn = document.querySelector('.navBtn[data-page="'+page+'"]');
        if(btn) btn.click();
      },80);
    }
  }

  function returnToSite(){
    storageSet('ig_view','site');
    showOnly('marketingSite');
  }

  function openModal(id){ var el=$('#'+id); if(el) el.classList.remove('isHidden'); }
  function closeModal(id){ var el=$('#'+id); if(el) el.classList.add('isHidden'); }

  function openGeneric(html){
    $('#genericModalContent').innerHTML = html;
    openModal('genericModal');
  }

  function readAppState(){
    try{return JSON.parse(storageGet('insightguard_fixed_state') || '{}');}catch(e){return {};}
  }
  function writeAppState(state){ storageSet('insightguard_fixed_state',JSON.stringify(state)); }

  function openAuth(mode){
    var login = mode === 'login';
    $('#authKicker').textContent = login ? 'Open the local demo' : 'Create a local demo profile';
    $('#authTitle').textContent = login ? 'Enter the InsightGuard prototype' : 'Personalise this prototype';
    $('#authSubtitle').textContent = login ? 'This is not a sign-in. Use fictional details to open the interactive demo.' : 'Use fictional details only. They are stored locally in this browser for the demo.';
    $('#authSubmit').textContent = login ? 'Open demo workspace →' : 'Save demo profile →';
    $('#authOrgLabel').style.display = login ? 'none' : 'flex';
    $('#authOrg').required = !login;
    $('#authForm').dataset.mode = mode;
    openModal('authModal');
  }

  function handleAuthSubmit(event){
    event.preventDefault();
    var name = $('#authName').value.trim();
    var email = $('#authEmail').value.trim();
    var org = $('#authOrg').value.trim();
    if(!name || !/^\S+@\S+\.\S+$/.test(email)){ showToast('Enter a demo name and a valid demo email.'); return; }
    var state = readAppState();
    state.user = name;
    state.email = email;
    if($('#authForm').dataset.mode !== 'login') state.org = org || state.org || 'My Organisation';
    writeAppState(state);
    closeModal('authModal');
    storageSet('ig_view','app');
    location.reload();
  }

  function formatCurrency(amount){
    return new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',minimumFractionDigits:2}).format(amount);
  }

  function cycleAmount(plan, cycle){
    var monthly = planPrices[plan] || planPrices.Growth;
    return cycle === 'annual' ? monthly * 12 * .8 : monthly;
  }

  function updateCheckoutSummary(){
    var base = cycleAmount(checkoutState.plan,checkoutState.cycle);
    var discount = checkoutState.discount ? base * checkoutState.discount : 0;
    var final = Math.max(0,base-discount);
    $('#summaryPlanName').textContent = checkoutState.plan;
    $('#summaryPlanDescription').textContent = planDescriptions[checkoutState.plan];
    $('#summaryBasePrice').textContent = formatCurrency(base);
    $('#discountLine').classList.toggle('isHidden',discount<=0);
    $('#summaryDiscount').textContent = '−'+formatCurrency(discount);
    $('#renewalText').textContent = formatCurrency(final) + (checkoutState.cycle==='annual'?'/year':'/month');
    $('#checkoutSubmitText').textContent = checkoutState.paymentMethod === 'invoice' ? 'Create demo receipt' : 'Complete prototype checkout';
    $$('.cycleSelector button').forEach(function(b){b.classList.toggle('active',b.dataset.checkoutCycle===checkoutState.cycle);});
  }

  function openCheckout(plan){
    checkoutState.plan = plan || 'Growth';
    checkoutState.cycle = document.querySelector('[data-home-cycle].active') && document.querySelector('[data-home-cycle].active').dataset.homeCycle || 'monthly';
    checkoutState.coupon=''; checkoutState.discount=0; checkoutState.paymentMethod='card';
    $('#couponInput').value=''; $('#couponMessage').textContent='';
    var state=readAppState();
    $('#payName').value=state.user||''; $('#payEmail').value=state.email||''; $('#payCompany').value=state.org||'';
    selectPaymentMethod('card');
    updateCheckoutSummary();
    showOnly('checkoutView');
  }

  function selectPaymentMethod(method){
    checkoutState.paymentMethod=method;
    $$('[data-payment-method]').forEach(function(b){b.classList.toggle('active',b.dataset.paymentMethod===method);});
    $$('.paymentPanel').forEach(function(p){p.classList.remove('active');});
    var panel=$('#'+method+'PaymentFields'); if(panel) panel.classList.add('active');
    updateCheckoutSummary();
  }

  function isTestCard(number){ return number.replace(/\D/g,'') === '4242424242424242'; }
  function isTestExpiry(value){ return value === '12/30'; }
  function markInvalid(el,invalid){ if(el) el.classList.toggle('invalid',!!invalid); return !invalid; }

  function validateCheckout(){
    var ok=true;
    ['payName','payCompany','billAddress','billCity','billPostcode'].forEach(function(id){var el=$('#'+id);ok=markInvalid(el,!el.value.trim())&&ok;});
    var email=$('#payEmail'); ok=markInvalid(email,!/^\S+@\S+\.\S+$/.test(email.value.trim()))&&ok;
    if(checkoutState.paymentMethod==='card'){
      ok=markInvalid($('#cardNumber'),!isTestCard($('#cardNumber').value))&&ok;
      ok=markInvalid($('#cardExpiry'),!isTestExpiry($('#cardExpiry').value))&&ok;
      ok=markInvalid($('#cardCvc'),$('#cardCvc').value !== '123')&&ok;
      ok=markInvalid($('#cardHolder'),!$('#cardHolder').value.trim())&&ok;
    } else if(checkoutState.paymentMethod==='upi'){
      ok=markInvalid($('#upiId'),$('#upiId').value.trim() !== 'demo@upi')&&ok;
    }
    if(!$('#termsConsent').checked){showToast('Accept the prototype terms to continue.');ok=false;}
    return ok;
  }

  function processCheckout(event){
    event.preventDefault();
    if(!validateCheckout()){showToast('Use the supplied test values and check the highlighted fields.');return;}
    var button=$('#checkoutSubmit');button.disabled=true;$('#checkoutSubmitText').textContent='Preparing demo result…';
    setTimeout(function(){
      var base=cycleAmount(checkoutState.plan,checkoutState.cycle), final=base-(base*checkoutState.discount);
      var now=new Date(), illustrativeDate=new Date(now); illustrativeDate.setDate(illustrativeDate.getDate()+14);
      var transaction='IG-DEMO-'+Date.now().toString().slice(-8);
      lastTransaction={
        id:transaction,plan:checkoutState.plan,cycle:checkoutState.cycle,amount:final,currency:'EUR',
        customer:$('#payName').value.trim(),email:$('#payEmail').value.trim(),company:$('#payCompany').value.trim(),
        method:checkoutState.paymentMethod,status:checkoutState.paymentMethod==='invoice'?'Demo invoice generated':'Prototype complete',
        created:now.toISOString(),illustrativeDate:illustrativeDate.toISOString()
      };
      storageSet('ig_prototype_checkout',JSON.stringify(lastTransaction));
      var state=readAppState();state.user=lastTransaction.customer;state.email=lastTransaction.email;state.org=lastTransaction.company;writeAppState(state);
      $('#successPlan').textContent=lastTransaction.plan+' · '+(lastTransaction.cycle==='annual'?'Annual':'Monthly');
      $('#successTransaction').textContent=lastTransaction.id;
      $('#successRenewal').textContent=illustrativeDate.toLocaleDateString('en-IE',{day:'numeric',month:'short',year:'numeric'});
      ['cardNumber','cardExpiry','cardCvc','cardHolder','upiId'].forEach(function(id){ var field=$('#'+id); if(field)field.value=''; });
      $('#cardBrand').textContent='TEST';
      button.disabled=false;updateCheckoutSummary();showOnly('paymentSuccess');
    },1250);
  }

  function downloadText(text,name,type){
    var blob=new Blob([text],{type:type||'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }

  function downloadReceipt(){
    var tx=lastTransaction;
    if(!tx){try{tx=JSON.parse(storageGet('ig_prototype_checkout'));}catch(e){}}
    if(!tx){showToast('No prototype checkout result found.');return;}
    var text=[
      'INSIGHTGUARD AI — PROTOTYPE RECEIPT (NOT A PAYMENT RECORD)','',
      'Demo reference: '+tx.id,'Status: '+tx.status,'Date: '+new Date(tx.created).toLocaleString('en-IE'),'',
      'Customer: '+tx.customer,'Company: '+tx.company,'Email: '+tx.email,'',
      'Scenario: '+tx.plan,'Illustrative cycle: '+tx.cycle,'Illustrative value: '+formatCurrency(tx.amount),'Amount charged: €0.00','',
      'This is a local prototype receipt. No payment, subscription, invoice, or account was created.'
    ].join('\n');
    downloadText(text,'InsightGuard_'+tx.id+'_Prototype_Receipt.txt');showToast('Prototype receipt downloaded.');
  }

  function applyCoupon(){
    var code=$('#couponInput').value.trim().toUpperCase();
    if(code==='FOUNDING20'){checkoutState.coupon=code;checkoutState.discount=.2;$('#couponMessage').textContent='Founding customer discount applied: 20% off.';}
    else if(code==='PILOT10'){checkoutState.coupon=code;checkoutState.discount=.1;$('#couponMessage').textContent='Pilot discount applied: 10% off.';}
    else{checkoutState.coupon='';checkoutState.discount=0;$('#couponMessage').textContent=code?'Coupon not recognised. Try FOUNDING20.':'';}
    updateCheckoutSummary();
  }

  function showPlanChooser(){
    openGeneric('<span class="modalKicker">Choose a demo scenario</span><h2>Select an illustrative plan</h2><p>You can switch scenarios before completing the local checkout simulation.</p><div class="modalForm">'+Object.keys(planPrices).map(function(p){return '<button class="planChoice" data-modal-plan="'+p+'"><b>'+p+'</b><span>'+formatCurrency(planPrices[p])+'/month</span></button>';}).join('')+'</div>');
    $$('[data-modal-plan]').forEach(function(btn){btn.onclick=function(){checkoutState.plan=btn.dataset.modalPlan;closeModal('genericModal');updateCheckoutSummary();};});
  }

  function showNotifications(){
    openGeneric('<span class="modalKicker">Workspace activity</span><h2>Notifications</h2><div class="notificationList"><div><span>✓</span><p><b>Quality scan completed</b>Two issues need review in the latest dataset.</p></div><div><span>✦</span><p><b>New AI insight available</b>Weekday route allocation is driving revenue growth.</p></div><div><span>▤</span><p><b>Monthly report ready</b>Your management report can be exported now.</p></div></div>');
  }

  function addCustomerModal(){
    openGeneric('<span class="modalKicker">Customer management</span><h2>Add a customer</h2><form id="newCustomerForm" class="modalForm"><label><span>Company name</span><input id="newCustomerName" required placeholder="New transport operator"></label><label><span>Type</span><select id="newCustomerType"><option>Taxi / fleet</option><option>Transport</option><option>Fleet / courier</option><option>Customer service</option></select></label><label><span>Status</span><select id="newCustomerStatus"><option>Prospect</option><option>Pilot</option><option>Active</option></select></label><div class="modalActions"><button type="button" data-close-modal="genericModal">Cancel</button><button class="primary" type="submit">Add customer</button></div></form>');
    $('#newCustomerForm').onsubmit=function(e){
      e.preventDefault();var name=$('#newCustomerName').value.trim();if(!name)return;
      var state=readAppState();state.customers=state.customers||[];state.customers.unshift({name:name,type:$('#newCustomerType').value,status:$('#newCustomerStatus').value,data:'No datasets',score:65});writeAppState(state);
      storageSet('ig_view','app');storageSet('ig_target_page','customers');location.reload();
    };
  }

  function addUseCaseModal(){
    openGeneric('<span class="modalKicker">AI governance</span><h2>Register an AI use case</h2><form id="newUseCaseForm" class="modalForm"><label><span>Use case</span><input id="newUseCaseName" required placeholder="Explain monthly KPI changes"></label><label><span>Risk level</span><select id="newUseCaseRisk"><option>Low</option><option>Medium</option><option>High</option></select></label><label><span>Human owner</span><input id="newUseCaseOwner" required placeholder="Operations Lead"></label><label><span>Purpose and limits</span><textarea id="newUseCasePurpose" rows="4" placeholder="Describe what the AI may and may not do."></textarea></label><div class="modalActions"><button type="button" data-close-modal="genericModal">Cancel</button><button class="primary" type="submit">Register use case</button></div></form>');
    $('#newUseCaseForm').onsubmit=function(e){
      e.preventDefault();var state=readAppState();state.checks=state.checks||[];state.checks.push({text:'Review registered use case: '+$('#newUseCaseName').value.trim()+' ('+$('#newUseCaseRisk').value+' risk)',done:false});writeAppState(state);
      storageSet('ig_view','app');storageSet('ig_target_page','governance');location.reload();
    };
  }

  function requestDemoSubmit(e){
    e.preventDefault();
    var requests=[];try{requests=JSON.parse(storageGet('ig_demo_requests')||'[]');}catch(err){}
    requests.unshift({name:$('#requestName').value.trim(),email:$('#requestEmail').value.trim(),useCase:$('#requestUseCase').value,message:$('#requestMessage').value.trim(),created:new Date().toISOString()});
    storageSet('ig_demo_requests',JSON.stringify(requests));closeModal('requestModal');
    openGeneric('<span class="successIcon" style="margin:0 0 15px">✓</span><h2>Demo request recorded</h2><p>For this prototype, the request has been saved locally in your browser. A production version would send it to the InsightGuard sales inbox and CRM.</p><div class="modalActions"><button class="primary" data-close-modal="genericModal">Done</button></div>');
  }

  function showLegal(type){
    var data={
      privacy:['Prototype privacy notice','Uploaded files are processed locally in this browser. The static prototype has no database and does not transmit your operational data to an InsightGuard server.'],
      terms:['Prototype terms','This website is an interactive product demonstration. Features, prices and transactions are illustrative and do not create a commercial contract.'],
      security:['Security approach','The production design should use managed authentication, tenant isolation, encrypted storage, audit logging and hosted payment processing. Secret payment keys must never be placed in frontend code.']
    }[type];
    openGeneric('<span class="modalKicker">InsightGuard AI</span><h2>'+data[0]+'</h2><p>'+data[1]+'</p><div class="modalActions"><button class="primary" data-close-modal="genericModal">Close</button></div>');
  }

  function parseCSV(text){
    var rows=[],row=[],cell='',quoted=false;
    for(var i=0;i<text.length;i++){
      var c=text[i],n=text[i+1];
      if(c==='"'&&quoted&&n==='"'){cell+='"';i++;}
      else if(c==='"')quoted=!quoted;
      else if(c===','&&!quoted){row.push(cell.trim());cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());cell='';if(row.some(function(v){return v!=='';}))rows.push(row);row=[];}
      else cell+=c;
    }
    if(cell||row.length){row.push(cell.trim());rows.push(row);}
    if(rows.length<2)return [];
    var headers=rows.shift().map(function(h){return h.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');});
    return rows.map(function(vals){var obj={};headers.forEach(function(h,j){obj[h]=vals[j]||'';});return obj;});
  }

  function normaliseRows(input){
    return input.map(function(r,i){
      var lower={};Object.keys(r).forEach(function(k){lower[k.toLowerCase().replace(/[^a-z0-9]+/g,'_')]=r[k];});
      return {
        date:lower.date||lower.month||('2026-05-'+String((i%28)+1).padStart(2,'0')),
        day:lower.day||['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i%7],
        hour:+(lower.hour||7+i%12),route:lower.route||lower.area||lower.region||'Unmapped route',
        driver:lower.driver||lower.staff||lower.agent||lower.owner||('Team member '+(i+1)),driver_id:lower.driver_id||lower.staff_id||'',
        vehicle:lower.vehicle||lower.vehicle_id||'',customer_email:lower.customer_email||lower.email||'',
        trips:+(lower.trips||lower.bookings||lower.jobs||lower.calls||lower.presented||1),
        revenue:+String(lower.revenue||lower.amount||lower.sales||lower.answered||0).replace(/[€$£,\s]/g,''),
        cancellations:+(lower.cancellations||lower.cancelled||lower.abandoned||0),complaints:+(lower.complaints||lower.issues||lower.errors||0)
      };
    });
  }

  async function processUploadedFile(file){
    if(!file)return;
    if(file.size>10*1024*1024){showToast('The prototype limit is 10 MB.');return;}
    var ext=(file.name.split('.').pop()||'').toLowerCase(),raw=[];
    try{
      if(ext==='csv'||ext==='txt') raw=parseCSV(await file.text());
      else if(ext==='xlsx'||ext==='xls'){
        if(typeof XLSX==='undefined')throw new Error('Excel reader unavailable. Check your internet connection or save as CSV.');
        var wb=XLSX.read(await file.arrayBuffer(),{type:'array'}),sheet=wb.Sheets[wb.SheetNames[0]];raw=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false});
      }else throw new Error('Choose a CSV or Excel file.');
      if(!raw.length)throw new Error('No usable data rows were found.');
      var state=readAppState();state.rows=normaliseRows(raw);state.uploads=state.uploads||[];state.uploads.unshift({file:file.name,type:ext.toUpperCase(),by:state.user||'Workspace user',date:new Date().toLocaleString('en-IE'),status:'Completed'});writeAppState(state);
      showToast(file.name+' analysed successfully.');storageSet('ig_view','app');storageSet('ig_target_page','dashboard');setTimeout(function(){location.reload();},450);
    }catch(error){showToast(error.message||'The file could not be processed.');}
  }

  function enhanceBillingPage(){
    var page=$('#page');if(!page||!document.querySelector('.navBtn[data-page="billing"].active'))return;
    var existing=$('#activeSubscriptionBanner');if(existing)return;
    var tx;try{tx=JSON.parse(storageGet('ig_prototype_checkout'));}catch(e){}
    if(!tx)return;
    var banner=document.createElement('div');banner.id='activeSubscriptionBanner';banner.className='subscriptionBanner';
    var content=document.createElement('div'),mark=document.createElement('span'),copy=document.createElement('p'),title=document.createElement('b'),details=document.createElement('span'),receipt=document.createElement('button');
    mark.textContent='✓';title.textContent=String(tx.plan||'Selected')+' prototype scenario complete';details.textContent=String(tx.status||'Local result')+' · Illustrative date '+new Date(tx.illustrativeDate||tx.created).toLocaleDateString('en-IE');
    copy.appendChild(title);copy.appendChild(document.createTextNode(' '));copy.appendChild(details);content.appendChild(mark);content.appendChild(copy);
    receipt.id='billingReceipt';receipt.textContent='Download demo receipt';banner.appendChild(content);banner.appendChild(receipt);
    var firstGrid=page.querySelector('.threeCol');if(firstGrid)firstGrid.parentNode.insertBefore(banner,firstGrid);
    receipt.onclick=downloadReceipt;
  }

  function setupCaptureInterceptors(){
    document.addEventListener('click',function(e){
      var close=e.target.closest('[data-close-modal]');
      if(close){e.preventDefault();closeModal(close.dataset.closeModal);return;}
      var plan=e.target.closest('[data-plan]');
      if(plan){e.preventDefault();e.stopImmediatePropagation();openCheckout(plan.dataset.plan);return;}
      if(e.target.closest('#addCustomer')){e.preventDefault();e.stopImmediatePropagation();addCustomerModal();return;}
      if(e.target.closest('#newUseCase')){e.preventDefault();e.stopImmediatePropagation();addUseCaseModal();return;}
      if(e.target.closest('#invoiceBtn')){e.preventDefault();e.stopImmediatePropagation();downloadReceipt();return;}
      if(e.target.closest('#docsBtn')){e.preventDefault();e.stopImmediatePropagation();downloadText('INSIGHTGUARD AI QUICK GUIDE\n\n1. Upload CSV or Excel data.\n2. Review dashboard KPIs and data quality.\n3. Ask the AI assistant questions.\n4. Complete governance checks.\n5. Export the monthly report.','InsightGuard_Quick_Guide.txt');showToast('Quick guide downloaded.');return;}
      var deadLink=e.target.closest('.applicationShell .link:not([data-go])');if(deadLink){e.preventDefault();showToast('Detail view opened in prototype mode.');}
    },true);

    document.addEventListener('change',function(e){
      if(e.target && e.target.id==='fileInput' && e.target.files && e.target.files[0]){e.stopImmediatePropagation();processUploadedFile(e.target.files[0]);}
    },true);
    document.addEventListener('drop',function(e){
      if(e.target.closest && e.target.closest('#uploadZone') && e.dataTransfer.files[0]){e.preventDefault();e.stopImmediatePropagation();processUploadedFile(e.dataTransfer.files[0]);}
    },true);
  }

  function bindEvents(){
    $$('[data-launch-demo]').forEach(function(b){b.onclick=function(){launchApp(b.dataset.targetPage||'dashboard');};});
    $$('[data-open-auth]').forEach(function(b){b.onclick=function(){openAuth(b.dataset.openAuth);};});
    $$('[data-request-demo]').forEach(function(b){b.onclick=function(){openModal('requestModal');};});
    $$('[data-legal]').forEach(function(b){b.onclick=function(){showLegal(b.dataset.legal);};});
    $$('[data-close-modal]').forEach(function(b){b.onclick=function(){closeModal(b.dataset.closeModal);};});
    $$('.modalOverlay').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)closeModal(m.id);});});
    $('#authForm').addEventListener('submit',handleAuthSubmit);$('#requestForm').addEventListener('submit',requestDemoSubmit);
    $('#mobileNavToggle').onclick=function(){$('.siteNav').classList.toggle('open');};
    $('#backToSite').onclick=returnToSite;
    $('#profileButton').onclick=function(){var b=document.querySelector('.navBtn[data-page="settings"]');if(b)b.click();};
    $('#notifyBtn').addEventListener('click',function(e){e.stopImmediatePropagation();showNotifications();},true);
    $('#globalSearch').addEventListener('keydown',function(e){
      if(e.key!=='Enter')return;var q=e.target.value.toLowerCase();var pages=['dashboard','upload','insights','reports','quality','governance','customers','settings','billing','support'];var found=pages.find(function(p){return p.indexOf(q)>-1||q.indexOf(p)>-1;});if(found){document.querySelector('.navBtn[data-page="'+found+'"]').click();e.target.value='';}else showToast('No matching workspace section found.');
    });

    $$('[data-home-cycle]').forEach(function(b){b.onclick=function(){
      $$('[data-home-cycle]').forEach(function(x){x.classList.remove('active');});b.classList.add('active');
      var annual=b.dataset.homeCycle==='annual';Object.keys(planPrices).forEach(function(p){var el=document.querySelector('[data-price-plan="'+p+'"]');if(el)el.innerHTML=(annual?formatCurrency(planPrices[p]*12*.8).replace('.00',''):formatCurrency(planPrices[p]).replace('.00',''))+'<small>/'+(annual?'yr':'mo')+'</small>';});
    };});

    $('#checkoutBack').onclick=function(){var source=storageGet('ig_view')==='app'?'applicationShell':'marketingSite';showOnly(source);};
    $$('[data-payment-method]').forEach(function(b){b.onclick=function(){selectPaymentMethod(b.dataset.paymentMethod);};});
    $$('[data-checkout-cycle]').forEach(function(b){b.onclick=function(){checkoutState.cycle=b.dataset.checkoutCycle;updateCheckoutSummary();};});
    $('#changePlan').onclick=showPlanChooser;$('#applyCoupon').onclick=applyCoupon;
    $('#couponInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();applyCoupon();}});
    $('#fillTestCard').onclick=function(){$('#cardNumber').value='4242 4242 4242 4242';$('#cardExpiry').value='12/30';$('#cardCvc').value='123';$('#cardHolder').value=$('#payName').value||'Aisha Khan';$('#cardBrand').textContent='VISA';};
    $('#fillTestUpi').onclick=function(){$('#upiId').value='demo@upi';};
    $('#cardNumber').addEventListener('input',function(){var digits=this.value.replace(/\D/g,'').slice(0,16);this.value=digits.replace(/(.{4})/g,'$1 ').trim();$('#cardBrand').textContent=digits.startsWith('4')?'VISA':digits.startsWith('5')?'MC':'CARD';this.classList.remove('invalid');});
    $('#cardExpiry').addEventListener('input',function(){var d=this.value.replace(/\D/g,'').slice(0,4);this.value=d.length>2?d.slice(0,2)+'/'+d.slice(2):d;this.classList.remove('invalid');});
    $('#cardCvc').addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').slice(0,4);this.classList.remove('invalid');});
    $('#checkoutForm').addEventListener('submit',processCheckout);
    $('#downloadReceipt').onclick=downloadReceipt;$('#enterWorkspace').onclick=function(){storageSet('ig_view','app');location.reload();};
  }

  function observeApp(){
    var page=$('#page');if(!page)return;new MutationObserver(function(){setTimeout(enhanceBillingPage,20);}).observe(page,{childList:true,subtree:true});
  }

  function init(){
    setupCaptureInterceptors();bindEvents();observeApp();
    var view=storageGet('ig_view');if(view==='app')showOnly('applicationShell');else showOnly('marketingSite');
    var target=storageGet('ig_target_page');if(view==='app'&&target){storageRemove('ig_target_page');setTimeout(function(){var b=document.querySelector('.navBtn[data-page="'+target+'"]');if(b)b.click();},120);}
    var state=readAppState();if(state.org){$('#workspaceOrg').textContent=state.org;$('#payCompany').value=state.org;}if(state.user){$('#payName').value=state.user;}if(state.email){$('#payEmail').value=state.email;}
    setTimeout(enhanceBillingPage,100);
  }

  window.downloadPrototypeReceipt=downloadReceipt;
  document.addEventListener('DOMContentLoaded',init);
})();
