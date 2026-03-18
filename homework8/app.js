const name = 'James Camery';
console.log('Hello World!');

function showGreeting(name) {
  return 'Hello, my name is ' + name + '! Welcome to my portfolio!';
}


const greetingElement = document.getElementById('greeting');

if (greetingElement) {
  greetingElement.textContent = showGreeting(name);
}


const skillInput = document.getElementById('skillInput');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsList = document.getElementById('skillsList');

if (addSkillBtn) {                                               /*new*/
  addSkillBtn.addEventListener('click', function() {
    const skill = skillInput.value.trim();
    if (skill) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = skill;
      skillsList.appendChild(li);
      skillInput.value = '';
    }
  });
}


const projectTitles = ["International Space Station", "Saturn's Rings", "Murder in Monterey Manor"];               /*new*/
const projectDescriptions = [
  "I was the sole creator, architect, and engineer of the international space station. There is no need to look it up, just trust me.",
  "I also accidentally made Saturn's rings when I threw a rock into space really hard.",
  "I made murder in Monterey Manor in 9th grade when I got bored. It's a game played entirely in a console. It was made in python."
];
const projectDeadlines = ["2028-01-01", "2026-03-17", "2024-11-21"];
const projectImages = ["spacestation1.png", "saturn1.png", "montery1.png"];

const projectsContainer = document.getElementById('projectsContainer');

for (let i = 0; i < projectTitles.length; i++) {
  const col = document.createElement('div');
  col.className = 'col-md-4';
  
  const card = document.createElement('div');
  card.className = 'card';
  card.style.width = '100%';
  
  const img = document.createElement('img');
  img.src = projectImages[i];
  img.className = 'card-img-top';
  img.alt = projectTitles[i];
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  const title = document.createElement('h5');
  title.className = 'card-title h5 font-weight-bold';
  title.textContent = projectTitles[i];
  
  const desc = document.createElement('p');
  desc.className = 'card-text text-muted';
  desc.textContent = projectDescriptions[i];
  





   /*new*/
  const today = moment().startOf('day');
  const deadline = moment(projectDeadlines[i], 'YYYY-MM-DD').startOf('day');
  const status = deadline.isAfter(today) ? 'Ongoing' : 'Completed';
  
  const statusP = document.createElement('p');
  statusP.className = 'card-text';
  statusP.innerHTML = `<strong>Status:</strong> ${status}`;
  
  card.appendChild(img);
  cardBody.appendChild(title);
  cardBody.appendChild(desc);
  cardBody.appendChild(statusP);
  
  card.appendChild(cardBody);
  col.appendChild(card);
  projectsContainer.appendChild(col);
}



const downloadbutton = document.getElementById('downloadResume');
const downloadCountEl = document.getElementById('downloadCount');

let downloadCount = 0;

if (downloadbutton) {
  downloadbutton.addEventListener('click', function(event) {
    event.preventDefault();  
    downloadCount++;                                                  /*new*/
    downloadCountEl.textContent = `Downloads: ${downloadCount}`;
    alert('Your resume is downloaded successfully!');
    window.location.href = downloadbutton.href;
  });
}


const educationData = [
  ["Griffith High School", "2020-2022", "Griffith, IN", "Junior"],
  ["Arcadia High School", "2022-2023", "Arcadia, AZ", "Junior"],
  ["Saguaro High School", "2023-2024", "Scottsdale, AZ", "Graduated"],
  ["NAU", "2024-", "Flagstaff, AZ", "Sophomore"]
];

const experienceData = [
  ["Great Wolf Lodge", "2024", "Scottsdale, AZ", "Lifeguard"],
  ["Area 51", "2028", "[REDACTED]", "ET Researcher"]
];

function createTable(data, headers) {
  const table = document.createElement('table');
  table.className = 'table table-striped table-bordered table-hover';
  
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  return table;
}

const educationTableContainer = document.getElementById('educationTableContainer');
const experienceTableContainer = document.getElementById('experienceTableContainer');

if (educationTableContainer) {
  const educationTable = createTable(educationData, ["School", "Years", "Location", "Status"]);
  educationTableContainer.appendChild(educationTable);
}

if (experienceTableContainer) {
  const experienceTable = createTable(experienceData, ["Company", "Years", "Location", "Position"]);
  experienceTableContainer.appendChild(experienceTable);
}

