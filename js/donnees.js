// ==========================================
// MOTEUR DE LA BASE DE DONNÉES LOCALE (EBENEZER)
// ==========================================

// 1. Initialisation des tables par défaut si le localStorage est vide
function initialiserBaseDeDonnees() {
    // Table Utilisateurs
    if (!localStorage.getItem("users")) {
        const utilisateursParDefaut = [
            { id: "u1", nom: "Bonnestin Admin", email: "admin@ebenezer.com", mdp: "1234", role: "Administrateur" },
            { id: "u2", nom: "Sarah Planif", email: "planif@ebenezer.com", mdp: "1234", role: "Planificateur" },
            { id: "u3", nom: "Atlas Opérateur", email: "op@ebenezer.com", mdp: "1234", role: "Opérateur" }
        ];
        localStorage.setItem("users", JSON.stringify(utilisateursParDefaut));
    }

    // Table Clients
    if (!localStorage.getItem("clients")) {
        const clientsParDefaut = [
            { id: "c1", nom: "Université de Kamina", contact: "Prof Ilinga", tel: "+243 812 345 678", email: "unikam@gmail.com" },
            { id: "c2", nom: "Boulangerie Pain Naza", contact: "Gérant Mbuyu", tel: "+243 998 765 432", email: "naza@gmail.com" }
        ];
        localStorage.setItem("clients", JSON.stringify(clientsParDefaut));
    }

    // Table Commandes
    if (!localStorage.getItem("commandes")) {
        const commandesParDefaut = [
            { id: "cmd1", clientId: "c1", titre: "Syllabus Génie Logiciel L3", quantite: 120, date: "2026-06-01" },
            { id: "cmd2", clientId: "c2", titre: "Affiches Publicitaires A3", quantite: 500, date: "2026-06-03" }
        ];
        localStorage.setItem("commandes", JSON.stringify(commandesParDefaut));
    }

    // Table Planification (Suivi de production)
    if (!localStorage.getItem("planifications")) {
        const planificationsParDefaut = [
            { 
                id: "p1", 
                commandeId: "cmd1", 
                machine: "Presse Numérique 01", 
                operateurId: "u3", 
                priorite: "Haute", 
                statut: "En impression", 
                dateLivraison: "2026-06-10" 
            },
            { 
                id: "p2", 
                commandeId: "cmd2", 
                machine: "Offset KBA", 
                operateurId: "u3", 
                priorite: "Normale", 
                statut: "En attente", 
                dateLivraison: "2026-06-15" 
            }
        ];
        localStorage.setItem("planifications", JSON.stringify(planificationsParDefaut));
    }
}

// Lancer l'initialisation dès le chargement du script
initialiserBaseDeDonnees();

// 2. Fonctions utilitaires d'accès aux données (Pour les réutiliser partout)
const DB = {
    get: (table) => JSON.parse(localStorage.getItem(table)) || [],
    save: (table, data) => localStorage.setItem(table, JSON.stringify(data)),
    
    // Trouver un élément par son ID dans une table
    trouverParId: (table, id) => {
        return DB.get(table).find(item => item.id === id);
    }
};