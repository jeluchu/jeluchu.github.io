const companyLinks = {
    facebook: "https://www.facebook.com/MelonesLiderVillaconejos",
    instagram: "https://www.instagram.com/lidervillaconejos/",
    website: "https://satfrutasmargui.com/",
    location: "https://maps.app.goo.gl/4UdfgBWSVwbVXuTXA"
};

const profiles = {
    martin: {
        name: "Martín Pérez Mesas",
        role: "Jefe de Ventas",
        email: "mailto:martin@satfrutasmargui.com",
        phone: "tel:+34618759614",
        linkedin: "https://www.linkedin.com/in/mart%C3%ADn-p%C3%A9rez-mesas-a88a26178/"
    }
};

const socialActions = [
    { key: "facebook", label: "Facebook", icon: "fa-brands fa-facebook-f" },
    { key: "instagram", label: "Instagram", icon: "fa-brands fa-instagram" },
    { key: "linkedin", label: "LinkedIn", icon: "fa-brands fa-linkedin-in" },
    { key: "email", label: "Correo electrónico", icon: "fa-solid fa-envelope" },
    { key: "phone", label: "Teléfono", icon: "fa-solid fa-phone" },
    { key: "website", label: "Sitio web", icon: "fa-solid fa-globe" },
    { key: "location", label: "Ubicación", icon: "fa-solid fa-location-dot" }
];

const getActions = (keys) => keys.map((key) => socialActions.find((action) => action.key === key));
const quickActions = getActions(["facebook", "instagram", "website", "location"]);
const contactActions = getActions(["email", "phone", "linkedin"]);

const app = document.querySelector("#profile-app");
const profile = profiles[document.body.dataset.profile] || profiles.martin;
const links = { ...companyLinks, ...profile, linkedin: profile.linkedin };
const newTabAttributes = 'target="_blank" rel="noopener noreferrer"';

document.title = `${profile.name} | Líder Villaconejos`;

app.innerHTML = `
    <article class="profile-card">
        <header class="brand-header">
            <img class="brand-logo" src="assets/Logoblanco.png" alt="Líder Villaconejos" decoding="async">
        </header>

        <nav class="quick-links" aria-label="Redes sociales y contacto">
            ${quickActions.map((action) => `
                <a class="quick-link" href="${links[action.key]}" aria-label="${action.label}" title="${action.label}" ${newTabAttributes}>
                    <i class="${action.icon}" aria-hidden="true"></i>
                </a>
            `).join("")}
        </nav>

        <div class="profile-visual-frame">
            <img class="profile-visual" src="assets/Bodegon2.png" alt="Selección de productos Líder Villaconejos" decoding="async">
        </div>

        <section class="profile-content" aria-labelledby="profile-name">
            <h1 class="profile-name" id="profile-name">${profile.name}</h1>
            <p class="profile-role">${profile.role}</p>

            <div class="contact-divider" aria-label="Contacto directo">
                <span>Contacto directo</span>
            </div>
            <div class="contact-links">
                ${contactActions.map((action) => `
                    <a class="contact-link" href="${links[action.key]}" ${newTabAttributes}>
                        <i class="${action.icon}" aria-hidden="true"></i>
                        <span>${action.label}</span>
                    </a>
                `).join("")}
            </div>
        </section>

        <footer class="profile-footer">
            <p><a class="footer-link" href="${companyLinks.website}" target="_blank" rel="noopener noreferrer">Líder Villaconejos</a> · El melón por excelencia</p>
        </footer>
    </article>
`;
