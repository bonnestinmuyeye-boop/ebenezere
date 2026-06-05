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
            
            // REDIRECTION VERS LE BON NOM DE FICHIER
            window.location.href = "dashboard.html";
        } else {
            // Afficher le message d'erreur
            if (erreurConnexion) {
                erreurConnexion.style.display = "block";
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        }
    });
}

// Fonction de protection des pages
function verifierSecuritePage() {
    const session = JSON.parse(localStorage.getItem("session_active"));
    if (!session) {
        window.location.href = "index.html";
    }
    return session;
}

// Fonction de déconnexion
function deconnexion() {
    localStorage.removeItem("session_active");
    window.location.href = "index.html";
}