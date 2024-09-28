const apiKey = "te3UIjW4hkkAFeNfLl5FNBkTsAO1oRtX"; 

const blogContainer = document.getElementById("bolg-container");
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const topicList = document.getElementById('topic-list');

async function fetchRandomNews() {
    try {
        const apiURL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;
        const response = await fetch(apiURL);
        const data = await response.json();
        if (data.results) {
            return data.results;
        } else {
            console.error("Error: No articles found");
            return [];
        }
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.response && data.response.docs) {
            return data.response.docs;
        } else {
            console.error("Error: No articles found for this query");
            return [];
        }
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

async function fetchNewsByTopic(topic) {
    try {
        const apiUrl = `https://api.nytimes.com/svc/topstories/v2/${topic}.json?api-key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results) {
            return data.results;
        } else {
            console.error("Error: No articles found for this topic");
            return [];
        }
    } catch (error) {
        console.error("Error fetching news by topic", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = ""; 

    if (!articles || articles.length === 0) {
        blogContainer.innerHTML = "<p>No articles available at the moment.</p>";
        return;
    }

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("bolg-card");

        const img = document.createElement("img");
        img.src = article.multimedia && article.multimedia[0]
            ? article.multimedia[0].url
            : ""; 
        img.alt = article.title || article.headline?.main || "No title available";

        const title = document.createElement("h2");
        const truncatedTitle = (article.title || article.headline?.main) && (article.title || article.headline?.main).length > 30
            ? (article.title || article.headline.main).slice(0, 30) + "..."
            : article.title || article.headline?.main || "No title available";
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const abstract = article.abstract || article.lead_paragraph || "No description available";
        const truncatedDes = abstract.length > 120
            ? abstract.slice(0, 120) + "..."
            : abstract;
        description.textContent = truncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        blogCard.addEventListener("click", () => {
            window.open(article.url || article.web_url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});

if (topicList) {
    topicList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', async () => {
            const topic = item.getAttribute('data-topic');
            try {
                const articles = await fetchNewsByTopic(topic);
                displayBlogs(articles);
            } catch (error) {
                console.log(`Error fetching news for topic ${topic}`, error);
            }
        });
    });
}

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();