
(function(){
const KEY='teacher_pro_detail_records_v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function money(n){return (Number(n)||0).toLocaleString('ar-EG',{minimumFractionDigits:2,maximumFractionDigits:2})}
function today(){return new Date().toISOString().slice(0,10)}
function makePanel(){
 if(document.getElementById('studentFinancialDetail'))return;
 const host=document.querySelector('main')||document.body;
 const p=document.createElement('section'); p.id='studentFinancialDetail'; p.className='detail-panel';
 p.innerHTML=`
 <h3>📊 التفاصيل الشاملة — المجموعات والطلاب والمالية</h3>
 <div class="detail-filters">
   <label>النطاق
    <select id="dfScope"><option value="all">جميع الطلاب</option><option value="student">طالب محدد</option><option value="group">مجموعة محددة</option><option value="day">يوم محدد</option></select>
   </label>
   <label>الطالب <select id="dfStudent"><option value="">الكل</option></select></label>
   <label>المجموعة <select id="dfGroup"><option value="">الكل</option></select></label>
   <label>اليوم <input id="dfDay" type="date" value="${today()}"></label>
   <label>ثمن الحصة <input id="dfPrice" type="number" min="0" step="0.01" placeholder="مثال: 100"></label>
 </div>
 <div class="detail-actions">
   <button class="primary" id="dfAdd">➕ إضافة حضور/حصة مالية</button>
   <button class="money" id="dfAll">💰 احتساب الإجمالي</button>
   <button class="pdf" id="dfPDF">📄 تقرير PDF</button>
   <button class="excel" id="dfExcel">📊 تقرير Excel</button>
   <button class="print" id="dfPrint">🖨️ طباعة</button>
 </div>
 <div class="detail-summary">
  <div class="detail-stat">عدد الطلاب<b id="dfCount">0</b></div>
  <div class="detail-stat">عدد الحصص<b id="dfLessons">0</b></div>
  <div class="detail-stat">سعر الحصة<b id="dfUnit">0</b></div>
  <div class="detail-stat">الإجمالي<b id="dfTotal">0</b></div>
  <div class="detail-stat">آخر تحديث<b id="dfUpdated">-</b></div>
 </div>
 <div style="overflow:auto">
 <table class="detail-table" id="dfTable">
  <thead><tr><th>التاريخ</th><th>الوقت</th><th>الطالب</th><th>المجموعة</th><th>الحالة</th><th>ثمن الحصة</th><th>الإجمالي</th></tr></thead>
  <tbody></tbody>
 </table>
 </div>`;
 host.prepend(p);

 const student=document.getElementById('dfStudent'), group=document.getElementById('dfGroup');
 function options(){
   let rs=load(), ss=[...new Set(rs.map(x=>x.student).filter(Boolean))], gs=[...new Set(rs.map(x=>x.group).filter(Boolean))];
   student.innerHTML='<option value="">الكل</option>'+ss.map(x=>`<option>${esc(x)}</option>`).join('');
   group.innerHTML='<option value="">الكل</option>'+gs.map(x=>`<option>${esc(x)}</option>`).join('');
 }
 function filtered(){
   let rs=load(), scope=document.getElementById('dfScope').value, s=student.value,g=group.value,d=document.getElementById('dfDay').value;
   return rs.filter(x=>{
     if(scope==='student' && s && x.student!==s)return false;
     if(scope==='group' && g && x.group!==g)return false;
     if(scope==='day' && d && x.date!==d)return false;
     if(scope==='all')return true;
     if(scope==='student' && s)return x.student===s;
     if(scope==='group' && g)return x.group===g;
     if(scope==='day')return x.date===d;
     return true;
   });
 }
 function render(){
   options();
   let rs=filtered(), price=Number(document.getElementById('dfPrice').value)||0;
   let total=rs.reduce((a,x)=>a+(Number(x.price)||price),0);
   let students=new Set(rs.map(x=>x.student).filter(Boolean)).size;
   document.getElementById('dfCount').textContent=students;
   document.getElementById('dfLessons').textContent=rs.length;
   document.getElementById('dfUnit').textContent=money(price||rs[0]?.price||0);
   document.getElementById('dfTotal').textContent=money(total);
   document.getElementById('dfUpdated').textContent=new Date().toLocaleString('ar-EG');
   document.querySelector('#dfTable tbody').innerHTML=rs.map(x=>`<tr>
    <td>${esc(x.date)}</td><td>${esc(x.time)}</td><td>${esc(x.student)}</td><td>${esc(x.group)}</td>
    <td>${esc(x.status)}</td><td>${money(x.price||price)}</td><td>${money(x.price||price)}</td></tr>`).join('');
 }
 document.getElementById('dfAdd').onclick=()=>{
   let s=prompt('اسم الطالب:'); if(!s)return;
   let g=prompt('اسم المجموعة:')||'بدون مجموعة';
   let status=prompt('الحالة (حاضر/غائب/مدفوع/غير مدفوع):')||'حاضر';
   let price=Number(document.getElementById('dfPrice').value)||Number(prompt('ثمن الحصة:')||0);
   let now=new Date();
   let rs=load(); rs.push({student:s,group:g,status,price,date:now.toISOString().slice(0,10),time:now.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),createdAt:now.toISOString()}); save(rs); render();
 };
 document.getElementById('dfAll').onclick=render;
 document.getElementById('dfPDF').onclick=()=>window.print(); 
 document.getElementById('dfPrint').onclick=()=>window.print();
 document.getElementById('dfExcel').onclick=()=>{
   if(!window.XLSX)return alert('مكتبة Excel غير متاحة حالياً.');
   let rows=filtered(), data=[['التاريخ','الوقت','الطالب','المجموعة','الحالة','ثمن الحصة','الإجمالي']];
   rows.forEach(x=>data.push([x.date,x.time,x.student,x.group,x.status,Number(x.price)||0,Number(x.price)||0]));
   let wb=XLSX.utils.book_new(), ws=XLSX.utils.aoa_to_sheet(data); XLSX.utils.book_append_sheet(wb,ws,'التقرير');
   XLSX.writeFile(wb,'تقرير_الطلاب_والمالية_'+today()+'.xlsx');
 };
 ['dfScope','dfStudent','dfGroup','dfDay','dfPrice'].forEach(id=>document.getElementById(id).addEventListener('change',render));
 render();
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(makePanel,500));
})();
