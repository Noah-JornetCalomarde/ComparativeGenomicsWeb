async function fetchRecentPublications() {
    const response = await fetch('/data/publications.json');
    const rawPublications = await response.json();
    // Filter out items without a title
    const publications = rawPublications.filter(pub => pub.title && pub.title.trim() !== '');
    // Sort by date descending and take the 5 most recent
    const recent = publications
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    const container = document.getElementById('recent-publications');
    container.innerHTML = ''; // clear container
    
    recent.forEach((pub, index) => {
        const year = pub.date.substring(0, 4);
        const authorsArray = pub.author.split(',').map(a => a.trim());
        
        const div = document.createElement('div');
        div.className = 'recent-publications';
        
        // Check if we need to truncate authors
        if (authorsArray.length > 10) {
            const displayedAuthors = authorsArray.slice(0, 10).join(', ');
            const hiddenAuthors = authorsArray.slice(10).join(', ');
            const uniqueId = `pub-${index}`;
            
            div.innerHTML = `
                <h3 class="green">${pub.title}</h3>
                <p>
                    <span id="${uniqueId}-visible">${displayedAuthors},</span>
                    <span id="${uniqueId}-ellipsis">...</span>
                    <span id="${uniqueId}-hidden" style="display: none;">${hiddenAuthors}</span>
                    <a href="#" id="${uniqueId}-toggle"">[Show all].</a>
                    <em>${pub.journal}</em> (${year})
                </p>
                <a href="${pub.doi}" target="_blank">[View paper]</a>
                <hr class="rp-hr">
            `;
            
            container.appendChild(div);
            
            // Add click event for toggle
            const toggleLink = document.getElementById(`${uniqueId}-toggle`);
            const visibleSpan = document.getElementById(`${uniqueId}-visible`);
            const ellipsisSpan = document.getElementById(`${uniqueId}-ellipsis`);
            const hiddenSpan = document.getElementById(`${uniqueId}-hidden`);
            
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (hiddenSpan.style.display === 'none') {
                    visibleSpan.style.display = 'inline';
                    ellipsisSpan.style.display = 'none';
                    hiddenSpan.style.display = 'inline';
                    toggleLink.textContent = '[Show less].';
                } else {
                    visibleSpan.style.display = 'inline';
                    ellipsisSpan.style.display = 'inline';
                    hiddenSpan.style.display = 'none';
                    toggleLink.textContent = '[Show all].';
                }
            });
        } else {
            // If 10 or fewer authors, just display them all
            const allAuthors = authorsArray.join(', ');
            div.innerHTML = `
                <h3 class="green">${pub.title}</h3>
                <p>${allAuthors}. <em>${pub.journal}</em> (${year})</p>
                <a href="${pub.doi}" target="_blank">[View paper]</a>
                <hr class="rp-hr">
            `;
            container.appendChild(div);
        }
    });
}
fetchRecentPublications();