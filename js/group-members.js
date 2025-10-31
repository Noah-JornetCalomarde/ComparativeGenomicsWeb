async function fetchMembers() {
    const response = await fetch('/data/members.json');
    const rawMembers = await response.json();
    // Filter out items without a title
    const members = rawMembers.filter(member => member.name && member.name.trim() !== '');
  
    // Sort alphabetically by name
    members.sort((a, b) => {return a.name.localeCompare(b.name)});
    // Sort by priority
    members.sort((a, b) => a.priority - b.priority);
    console.log(members);
  
    const container = document.getElementById('members');
    container.innerHTML = ''; // clear container
  
    members.forEach(member => {
        const div = document.createElement('div');
        div.className = 'member';
        div.innerHTML = `
            <div class="img-wrapper">
                <img src="${member.picture}" alt="${member.name}"> 
            </div>
            <div class="info-wrapper">
                <h2 class="green">${member.name}</h3>
                <p><em>${member.position}</em></p>
                <p>${member.education}</p>
                <p><a href="mailto:${member.contact}">${member.contact}</a></p>
            </div>
        `;
        container.appendChild(div);
        const hr = document.createElement('hr');
        hr.className = 'rp-hr';
        container.appendChild(hr);
    });
}

fetchMembers();