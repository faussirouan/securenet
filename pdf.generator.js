// Rapport simple, destiné au technicien (ce qu'il envoie/garde après une intervention)
function genererPdfRapport(infos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(1, 62, 55);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('SecureNet', 14, 18);
    doc.setFontSize(11);
    doc.text("Rapport d'audit réseau", 14, 25);

    doc.setTextColor(20, 20, 20);
    let y = 42;
    const ligne = (label, valeur) => {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text(label, 14, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        y += 6;
        const texte = doc.splitTextToSize(valeur || '-', 180);
        doc.text(texte, 14, y);
        y += (texte.length * 6) + 6;
    };

    ligne('Client', infos.nomClient);
    ligne('Téléphone', infos.telephone);
    ligne('Ville / Type de local', `${infos.ville || '-'} / ${infos.typeLocal || '-'}`);
    ligne('Date de la demande', infos.date);
    ligne('Message initial du client', infos.message);
    ligne('Technicien en charge', infos.nomTechnicien);
    ligne('Diagnostic et recommandations', infos.reponse);

    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text('Généré automatiquement par SecureNet — Incub\'Challenge', 14, 285);

    doc.save(`rapport-audit-${(infos.nomClient || 'client').replace(/\s+/g, '-')}.pdf`);
}

// Rapport détaillé, destiné à l'admin/superviseur (contient les infos client ET technicien)
function genererPdfRapportAdmin(infos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(1, 62, 55);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('SecureNet', 14, 18);
    doc.setFontSize(11);
    doc.text('Rapport de supervision — Intervention technique', 14, 25);

    doc.setTextColor(20, 20, 20);
    let y = 42;
    const ligne = (label, valeur) => {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text(label, 14, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        y += 6;
        const texte = doc.splitTextToSize(valeur || '-', 180);
        doc.text(texte, 14, y);
        y += (texte.length * 6) + 6;
    };

    const sousTitre = (texte) => {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.setTextColor(1, 62, 55);
        doc.text(texte, 14, y);
        y += 8;
        doc.setTextColor(20, 20, 20);
    };

    sousTitre('— Informations client —');
    ligne('Nom / Entreprise', infos.nomClient);
    ligne('Téléphone', infos.telephone);
    ligne('Ville / Type de local', `${infos.ville || '-'} / ${infos.typeLocal || '-'}`);
    ligne('Date de la demande', infos.date);
    ligne('Message initial du client', infos.message);

    y += 2;
    sousTitre('— Informations technicien —');
    ligne('Technicien assigné', infos.nomTechnicien);
    ligne("Diagnostic et recommandations fournis", infos.reponse);

    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text('Rapport de supervision généré par SecureNet — Incub\'Challenge', 14, 285);

    doc.save(`supervision-${(infos.nomClient || 'client').replace(/\s+/g, '-')}.pdf`);
}