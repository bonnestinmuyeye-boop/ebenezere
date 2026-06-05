// ==========================================
// LOGIQUE ET AFFICHAGE DU DASHBOARD PRINCIPAL
// ==========================================

// 1. Sécuriser la page : vérifier que l'utilisateur est connecté
const utilisateurConnecte = verifierSecuritePage();

// 2. Éléments HTML à manipuler
const listeTravaux = document.getElementById("liste-travaux");
const countAttente = document.getElementById("count-attente");
const countCours = document.getElementById("count-cours");
const countTermine = document.getElementById("count-termine");

// 3. Personnaliser l'interface selon l'utilisateur connecté
function appliquerDroitsEtProfil() {
    document.getElementById("nav-user-nom").innerText = utilisateurConnecte.nom;
    document.getElementById("nav-user-role").innerText = utilisateurConnecte.role;
    document.getElementById("avatar-initiales").innerText = utilisateurConnecte.nom.substring(0, 2).toUpperCase();

    const zoneAction = document.getElementById("zone-action-rapide");
    
    // Restriction d'affichage : Seuls Admin et Planificateur peuvent créer des projets
    if (utilisateurConnecte.role === "Administrateur" || utilisateurConnecte.role === "Planificateur") {
        zoneAction.innerHTML = `
            <a href="planification.html" class="btn-primary" style="text-decoration: none;">
                <i class="fa-solid fa-plus"></i> Planifier un travail
            </a>
        `;
    }
}

// 4. Charger et compiler les données de production
function construireTableauProduction() {
    const planifications = DB.get("planifications");
    const commandes = DB.get("commandes");
    const clients = DB.get("clients");

    listeTravaux.innerHTML = "";

    let attente = 0;
    let cours = 0;
    let termine = 0;

    if (planifications.length === 0) {
        listeTravaux.innerHTML = `
            <tr>
                <td colspan="7" class="table-vide">
                    <i class="fa-solid fa-folder-open"></i> Aucun travail d'impression planifié.
                </td>
            </tr>
        `;
        return;
    }

    // Parcourir les planifications pour fabriquer les lignes
    planifications.forEach((plan, index) => {
        // JOINTURE LOCALE : Trouver la commande associée
        const commandeAssociee = commandes.find(c => c.id === plan.commandeId);
        // JOINTURE LOCALE : Trouver le client associé
        const clientAssocie = commandeAssociee ? clients.find(cl => cl.id === commandeAssociee.clientId) : null;

        const titreProjet = commandeAssociee ? commandeAssociee.titre : "Projet Inconnu";
        const nomClient = clientAssocie ? clientAssocie.nomEntreprise : "Client Anonyme";
        const quantite = commandeAssociee ? commandeAssociee.quantite : 0;

        // Incrémentation des compteurs statistiques
        if (plan.statut === "En attente") attente++;
        if (plan.statut === "En impression") cours++;
        if (plan.statut === "Terminé") termine++;

        // Gestion des styles des Badges de Statut et Priorité
        const badgeStatut = plan.statut === "En attente" ? "badge-orange" : (plan.statut === "En impression" ? "badge-bleu" : "badge-vert");
        const badgePriorite = plan.priorite === "Haute" ? "badge-rouge" : "badge-gris";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="projet-titre">${titreProjet}</div>
                <div class="projet-client">${nomClient}</div>
            </td>
            <td class="text-dark">${quantite} ex</td>
            <td class="text-dark"><i class="fa-solid fa-charging-station icon-small"></i> ${plan.machine}</td>
            <td><span class="badge ${badgePriorite}">${plan.priorite}</span></td>
            <td><span class="badge ${badgeStatut}">${plan.statut}</span></td>
            <td class="text-dark"><i class="fa-solid fa-calendar-day icon-small"></i> ${plan.dateLivraison}</td>
            <td>
                <button onclick="avancerStatutTravail(${index})" class="btn-action-status" title="Changer le statut">
                    <i class="fa-solid fa-rotate"></i>
                </button>
            </td>
        `;
        listeTravaux.appendChild(tr);
    });

    // Mettre à jour l'affichage des compteurs globaux
    countAttente.innerText = attente;
    countCours.innerText = cours;
    countTermine.innerText = termine;
}

// 5. Action : Modifier le statut au clic (Cycle : En attente -> En impression -> Terminé)
window.avancerStatutTravail = function(index) {
    let planifications = DB.get("planifications");
    let statutActuel = planifications[index].statut;

    if (statutActuel === "En attente") {
        planifications[index].statut = "En impression";
    } else if (statutActuel === "En impression") {
        planifications[index].statut = "Terminé";
    } else {
        planifications[index].statut = "En attente";
    }

    // Sauvegarder dans le localStorage et rafraîchir l'écran instantanément
    DB.save("planifications", planifications);
    construireTableauProduction();
}

// Initialisation au chargement de l'écran
window.onload = function() {
    appliquerDroitsEtProfil();
    construireTableauProduction();
};