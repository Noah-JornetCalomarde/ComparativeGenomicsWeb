function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

let allPublicationsData = []; // Store all publications globally

async function fetchAllPublications() {
    const response = await fetch('data/publications.json');

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const rawPublications = await response.json();
    // Filter out items without a title
    allPublicationsData = rawPublications.filter(pub => pub.title && pub.title.trim() !== '');
    // Sort by date descending
    allPublicationsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    renderPublications(allPublicationsData);
}

function renderPublications(publications) {
    // Group publications by year
    const publicationsByYear = {};
    publications.forEach(pub => {
        const year = new Date(pub.date).getFullYear();
        if (!publicationsByYear[year]) {
            publicationsByYear[year] = [];
        }
        publicationsByYear[year].push(pub);
    });
    
    const container = document.getElementById('all-publications');
    container.innerHTML = ''; // clear container
    
    if (publications.length === 0) {
        container.innerHTML = '<p class="no-results">No publications found matching your search.</p>';
        return;
    }
    
    let globalIndex = 0;
    
    // Iterate through years in descending order
    Object.keys(publicationsByYear)
        .sort((a, b) => b - a)
        .forEach(year => {
            // Create year section container
            const yearSection = document.createElement('div');
            yearSection.className = 'year-section';
            yearSection.innerHTML = `
                <div class="year-label">
                    <h2>${year}</h2>
                </div>
                <div class="publications-list"></div>
            `;
            
            // Add yearSection to DOM first
            container.appendChild(yearSection);
            
            const publicationsList = yearSection.querySelector('.publications-list');
            
            // Add publications for this year
            publicationsByYear[year].forEach(pub => {
                const div = document.createElement('div');
                const abstractArray = pub.abstract.split(' ').map(a => a.trim());
                const displayedAbstract = abstractArray.slice(0, 50).join(' ');
                const hiddenAbstract = abstractArray.slice(50).join(' ');
                const uniqueId = `pub-${globalIndex}`;
                globalIndex++;
                
                // Format date
                const formattedDate = formatDate(pub.date);
                div.className = 'publication-item';
                div.innerHTML = `
                    <h2 class="green">${pub.title}</h3>
                    <p>${pub.author}. <span class="pub-journal">${pub.journal}</span>, ${formattedDate}. <a class="doi-link" href="${pub.doi}">${pub.doi}</a></p>
                    <span class="grey" id="${uniqueId}-visible">${displayedAbstract}</span><!--
                    --><span class="grey" id="${uniqueId}-ellipsis">...</span><!--
                    --><span class="grey" id="${uniqueId}-hidden" style="display: none;"> ${hiddenAbstract}</span>
                    <a href="#" id="${uniqueId}-toggle">⮟</a>
                `;
                
                // Append to publications list
                publicationsList.appendChild(div);
                
                // Now query for elements (they're in the DOM)
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
                        toggleLink.textContent = '⮝';
                    } else {
                        visibleSpan.style.display = 'inline';
                        ellipsisSpan.style.display = 'inline';
                        hiddenSpan.style.display = 'none';
                        toggleLink.textContent = '⮟';
                    }
                });
            });
        });
}

function searchPublications(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderPublications(allPublicationsData);
        return;
    }
    
    const filtered = allPublicationsData.filter(pub => {
        return (
            pub.title.toLowerCase().includes(searchTerm) ||
            pub.author.toLowerCase().includes(searchTerm) ||
            pub.journal.toLowerCase().includes(searchTerm) ||
            pub.abstract.toLowerCase().includes(searchTerm)
        );
    });
    
    renderPublications(filtered);
}

// Initialize
fetchAllPublications();

// Set up search listener
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('publication-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchPublications(e.target.value);
        });
    }
});