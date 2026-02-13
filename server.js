<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smart Crowd Monitoring Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body{
    font-family: Arial, sans-serif;
    background:#0f172a;
    color:white;
    padding:20px;
}
h1{text-align:center;margin-bottom:20px;}
.dashboard{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
    gap:20px;
    margin-bottom:20px;
}
.card{
    background:#1e293b;
    padding:20px;
    border-radius:10px;
    text-align:center;
}
.status{color:#10b981;}
.warning{color:#f59e0b;}
.danger{color:#ef4444;}
table{
    width:100%;
    margin-top:20px;
    border-collapse:collapse;
}
th,td{
    padding:10px;
    border-bottom:1px solid #334155;
}
canvas{
    background:#1e293b;
    padding:15px;
    border-radius:10px;
    margin-top:20px;
}
.alert{
    padding:15px;
    margin:15px 0;
    border-radius:8px;
    display:none;
}
.alert.show{display:block;}
.alert-warning{background:#f59e0b;}
.alert-danger{background:#ef4444;}
.alert-success{background:#10b981;}
</style>
</head>

<body>

<h1>🎯 Smart Crowd Monitoring Dashboard</h1>

<div id="alertBox" class="alert">
    <span id="alertMessage"></span>
</div>

<div class="dashboard">
    <div class="card">
        <h3>Current Crowd</h3>
        <h2 id="crowdCount">0</h2>
    </div>
    <div class="card">
        <h3>Status</h3>
        <h2 id="crowdStatus" class="status">Normal</h2>
    </div>
    <div class="card">
        <h3>Peak Today</h3>
        <h2 id="peakCount">0</h2>
    </div>
    <div class="card">
        <h3>Average</h3>
        <h2 id="avgCount">0</h2>
    </div>
</div>

<canvas id="crowdChart"></canvas>

<h2>Recent Activity</h2>
<table>
<thead>
<tr>
<th>Time</th>
<th>Count</th>
<th>Status</th>
<th>Entries</th>
<th>Exits</th>
<th>Change</th>
</tr>
</thead>
<tbody id="activityTable"></tbody>
</table>

<script>

let crowdData = [];
let labels = [];
let previousCount = 0;
let peakCount = 0;
let allCounts = [];
const maxCapacity = 100;
const moderateThreshold = 50;
const crowdedThreshold = 80;

const ctx = document.getElementById('crowdChart').getContext('2d');

const crowdChart = new Chart(ctx,{
    type:'line',
    data:{
        labels:labels,
        datasets:[{
            label:'Crowd Count',
            data:crowdData,
            borderColor:'#667eea',
            backgroundColor:'rgba(102,126,234,0.2)',
            fill:true,
            tension:0.3
        }]
    },
    options:{
        scales:{
            y:{beginAtZero:true}
        }
    }
});

function getStatus(count){
    if(count < moderateThreshold)
        return {text:'Normal',class:'status'};
    if(count < crowdedThreshold)
        return {text:'Moderate',class:'warning'};
    return {text:'Crowded',class:'danger'};
}

function getEntryExit(current, previous){
    const diff = current - previous;
    if(diff>0) return {entries:diff,exits:0};
    if(diff<0) return {entries:0,exits:Math.abs(diff)};
    return {entries:0,exits:0};
}

function showAlert(message,type){
    const box=document.getElementById('alertBox');
    const msg=document.getElementById('alertMessage');
    box.className=`alert alert-${type} show`;
    msg.textContent=message;
    setTimeout(()=>box.classList.remove('show'),4000);
}

function updateDashboard(){

    const newCount=Math.floor(Math.random()* (maxCapacity+1));
    const time=new Date().toLocaleTimeString();
    const entryExit=getEntryExit(newCount,previousCount);

    document.getElementById('crowdCount').textContent=newCount;

    const status=getStatus(newCount);
    const statusEl=document.getElementById('crowdStatus');
    statusEl.textContent=status.text;
    statusEl.className=status.class;

    if(newCount>peakCount){
        peakCount=newCount;
        document.getElementById('peakCount').textContent=peakCount;
    }

    allCounts.push(newCount);
    const avg=Math.round(allCounts.reduce((a,b)=>a+b,0)/allCounts.length);
    document.getElementById('avgCount').textContent=avg;

    if(status.text==='Crowded' && previousCount < crowdedThreshold){
        showAlert(`🚨 Crowd level is CROWDED (${newCount})`,'danger');
    }
    else if(status.text==='Moderate' && previousCount < moderateThreshold){
        showAlert(`⚠️ Crowd level is MODERATE (${newCount})`,'warning');
    }

    crowdData.push(newCount);
    labels.push(time);

    if(crowdData.length>20){
        crowdData.shift();
        labels.shift();
    }

    crowdChart.update();

    updateTable(time,newCount,status.text,entryExit);

    previousCount=newCount;
}

function updateTable(time,count,status,entryExit){
    const table=document.getElementById('activityTable');
    const change=entryExit.entries-entryExit.exits;

    const row=document.createElement('tr');
    row.innerHTML=`
        <td>${time}</td>
        <td>${count}</td>
        <td>${status}</td>
        <td style="color:#10b981;">↑ ${entryExit.entries}</td>
        <td style="color:#ef4444;">↓ ${entryExit.exits}</td>
        <td>${change>=0?'+':''}${change}</td>
    `;
    table.insertBefore(row,table.firstChild);

    if(table.children.length>15)
        table.removeChild(table.lastChild);
}

setInterval(updateDashboard,5000);
updateDashboard();

</script>

</body>
</html>
