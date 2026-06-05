// ==========================================
// GESTION DES SESSIONS ET DE L'AUTHENTIFICATION
// ==========================================

const formLogin = document.getElementById("form-login");
const erreurConnexion = document.getElementById("erreur-connexion");

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const mdp = document.getElementById("mdp").value;

        // Récupérer la liste des utilisateurs de notre DB locale
        const utilisateurs = DB.get("users");

        // Chercher si un utilisateur correspond
        const userTrouve = utilisateurs.find(u => u.email === email && u.mdp === mdp);

        if (userTrouve) {
            // Créer une session active dans le navigateur
            localStorage.setItem("session_active", JSON.stringify(userTrouve));
            
            // REDIRECTION CORRIGÉE : Chemin relatif pour GitHub Pages
            window.location.href = "dashboard.html";
        } else {
            // Afficher le message d'erreur
            erreurConnexion.style.display = "block";
        }
    });
}

// Fonction de protection des pages (À appeler sur les autres écrans)
function verifierSecuritePage() {
    const session = JSON.parse(localStorage.getItem("session_active"));
    if (!session) {
        // REDIRECTION CORRIGÉE : Retour relatif à l'écran de login
        window.location.href = "index.html";
    }
    return session;
}

// Fonction de déconnexion
function deconnexion() {
    localStorage.removeItem("session_active");
    window.location.href = "index.html";
}
