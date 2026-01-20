// Полный JavaScript для script.js
// =====================================================

// Обновление часов
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
}

// Запуск часов
updateTime();
setInterval(updateTime, 1000);

// Работа с сайтами
const sitesBlock = document.getElementById('sitesBlock');
const addSiteBtn = document.querySelector('.add-site');

// Клик по плюсику = добавление сайта
addSiteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
});

// Обработка кликов по иконкам сайтов
sitesBlock.addEventListener('click', (e) => {
    const siteIcon = e.target.closest('.site-icon:not(.add-site)');
    
    if (!siteIcon) return;
    
    // Координаты клика относительно иконки
    const rect = siteIcon.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const crossSize = 24;
    
    // Клик по области крестика (правый верхний угол 24x24px)
    if (x > rect.width - crossSize && y < crossSize) {
        e.preventDefault();
        if (confirm('Удалить этот сайт?')) {
            siteIcon.style.animation = 'removeShake 0.5s ease-in-out';
            setTimeout(() => {
                siteIcon.remove();
                saveSites();
            }, 250);
        }
        return;
    }
    
    // Обычный клик = открытие сайта (ссылка работает естественно)
});

// Модальное окно добавления сайта
function showModal() {
    let modalHTML = `
        <div class="modal" id="addSiteModal">
            <div class="modal-content">
                <h3>Добавить сайт</h3>
                <div class="modal-input-wrapper">
                    <input type="url" id="siteUrl" placeholder="https://example.com">
                </div>
                <div class="modal-buttons">
                    <button onclick="closeModal()">Отмена</button>
                    <button onclick="addSite()">Добавить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('addSiteModal').style.display = 'block';
    
    setTimeout(() => {
        const modal = document.getElementById('addSiteModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }, 100);
}


function closeModal() {
    const modal = document.getElementById('addSiteModal');
    if (modal) modal.remove();
}

function addSite() {
    const urlInput = document.getElementById('siteUrl');
    const url = urlInput.value.trim();
    
    if (url && isValidUrl(url)) {
        const faviconUrl = getFaviconUrl(url);
        createSiteIcon(url, faviconUrl);
        closeModal();
        saveSites();
    } else {
        alert('Введите корректный URL (например: https://google.com)');
    }
}

function isValidUrl(string) {
    try {
        new URL(string.startsWith('http') ? string : 'https://' + string);
        return true;
    } catch {
        return false;
    }
}

function getFaviconUrl(url) {
    const domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

function createSiteIcon(url, faviconUrl) {
    const siteIcon = document.createElement('a');
    siteIcon.href = url;
    siteIcon.className = 'site-icon';
    siteIcon.title = `Кликните для открытия\nПравый верхний угол для удаления`;
    siteIcon.innerHTML = `
        <img src="${faviconUrl}" alt="Favicon" 
             onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjE2IiB5PSIxOSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTA5MDkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5+</dGV4dD4KPC9zdmc+';">
    `;
    sitesBlock.insertBefore(siteIcon, addSiteBtn);
}

// Сохранение и загрузка сайтов
function saveSites() {
    const sites = Array.from(sitesBlock.querySelectorAll('.site-icon:not(.add-site)')).map(icon => icon.href);
    localStorage.setItem('customSites', JSON.stringify(sites));
}

function loadSites() {
    const savedSites = JSON.parse(localStorage.getItem('customSites') || '[]');
    savedSites.forEach(url => {
        const faviconUrl = getFaviconUrl(url);
        createSiteIcon(url, faviconUrl);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSites);

// Discord сервер статус (замени YOUR_GUILD_ID на свой ID)
async function updateDiscordStats() {
    try {
        const response = await fetch('https://discord.com/api/guilds/1255913433803653161/widget.json');
        const data = await response.json();
        
        if (data.presence_count !== undefined) {
            // Новые селекторы для твоей структуры
            document.getElementById('onlineCount').textContent = data.presence_count;
            document.getElementById('totalCount').textContent = data.member_count || '—';
            document.getElementById('voiceCount').textContent = Math.round(data.presence_count * 0.15) || '0';
        }
    } catch (error) {
        console.log('Discord API недоступен');
        document.getElementById('onlineCount').textContent = '—';
        document.getElementById('totalCount').textContent = '—';
        document.getElementById('voiceCount').textContent = '—';
    }
}

updateDiscordStats();
setInterval(updateDiscordStats, 5000);
