// STIVO DEVX - script.js
const pages = ['page1','page2','page3','page4'];
const required = ['wa_channel','wa_group','tg_channel','giveaway','tg_group','yt','script_wa'];
const sound = document.getElementById('joinSound');

function next(n){
  document.querySelector('.page.active').classList.remove('active');
  document.getElementById(pages[n-1]).classList.add('active');
  if(n===1) setTimeout(showBoxes,200);
}

function showBoxes(){
  document.querySelectorAll('.box').forEach((b,i)=>{
    setTimeout(()=> b.classList.add('show'), i*180);
  });
}

window.addEventListener('load', ()=>{
  showBoxes();
  updateJoinStatus();
});

// JOIN LOGIC
document.querySelectorAll('.channel-btn').forEach(btn=>{
  const id = btn.dataset.id;
  try{
    const stored = JSON.parse(localStorage.getItem('sunset_joined') || '[]');
    if(stored.includes(id)) btn.classList.add('joined');
  }catch(e){ /* ignore */ }

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(btn.classList.contains('joined')) return;

    btn.classList.add('joining');
    sound.currentTime = 0;
    sound.play().catch(()=>{});

    let joined = JSON.parse(localStorage.getItem('sunset_joined') || '[]');
    if(!joined.includes(id)) joined.push(id);
    localStorage.setItem('sunset_joined', JSON.stringify(joined));

    setTimeout(()=>{
      btn.classList.remove('joining');
      btn.classList.add('joined');
      updateJoinStatus();
      setTimeout(()=> window.open(btn.href, '_blank'), 250);
    }, 700);
  });
});

function updateJoinStatus(){
  const joined = JSON.parse(localStorage.getItem('sunset_joined') || '[]');
  const count = joined.filter(id => required.includes(id)).length;
  document.getElementById('count').textContent = count;

  if(count === required.length){
    document.getElementById('warn').style.display = 'none';
    const btn = document.getElementById('joinAllBtn');
    btn.textContent = 'CONTINUE →';
    btn.onclick = () => next(3);
  }
}

function verifyChannels(){
  const joined = JSON.parse(localStorage.getItem('sunset_joined') || '[]');
  if(required.every(id => joined.includes(id))) next(3);
  else document.getElementById('warn').style.display = 'block';
}

function saveNumber(){
  const num = document.getElementById('number').value.trim();
  if(!/^\+\d{8,15}$/.test(num)){
    alert('Enter valid number: +countrycode + number (example: +2349016993902)');
    return;
  }
  localStorage.setItem('sunset_number', num);
  document.getElementById('confirmNum').innerHTML = `<strong>${num}</strong><br>Ready to unban?`;
  next(4);
}

function sendUnbanEmail(){
  const num = localStorage.getItem('sunset_number') || '[unknown]';
  const appeal = `Dear WhatsApp Support Team,

I am writing to request the unbanning of my WhatsApp number ${num} which was banned due to the violation of WhatsApp terms of service.

I acknowledge the mistake and sincerely apologize for any inconveniences caused.

I assure you that I understand the importance of adhering to the platform's guidelines and I am committed to using WhatsApp responsibly in the future.

I kindly ask for your understanding and consideration in granting me a second chance to regain access to my account.

Thank you for your attention to this matter.`;

  const subject = `WhatsApp Unban Request - ${num}`;
  // Use encodeURIComponent to safely include line breaks and special chars
  window.location.href = `mailto:support@whatsapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(appeal)}`;

  document.getElementById('sentMsg').style.display = 'block';
}

document.getElementById('unbanBtn').addEventListener('click', sendUnbanEmail);
