const name = 'James Camery';
console.log('Hello World!');
let hasDownloadedResume = false;

function showGreeting(name) {
  return 'Hello, my name is ' + name + '! Welcome to my portfolio!';
}


const greetingElement = document.getElementById('greeting');

if (greetingElement) {
  greetingElement.textContent = showGreeting(name);
}



const downloadbutton = document.getElementById('downloadResume');

function daysUntilDeadline(deadlineStr) {
  const today = moment().startOf('day');
  const deadline = moment(deadlineStr, 'YYYY-MM-DD').startOf('day');
  const diffDays = deadline.diff(today, 'days');
  console.log('The number of days between the two dates is:', diffDays);
  return diffDays;
}

const deadlineEl = document.getElementById('projectDeadline');
const daysEl = document.getElementById('deadlineDays');
if (deadlineEl && daysEl) {
  const remaining = daysUntilDeadline(deadlineEl.textContent.trim());
  daysEl.textContent = remaining >= 0 ? remaining : 0;
}

if (downloadbutton) {
  
    downloadbutton.addEventListener('click', function() {
    
    if (!hasDownloadedResume) {
      hasDownloadedResume = true;
      alert('Your resume is downloaded successfully!');
    }

  });

}

