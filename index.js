const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;
const pdfDirectory = path.join(__dirname, "pdf");

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Servir les fichiers PDF et forcer le téléchargement
app.use("/pdf", express.static(pdfDirectory, {
    setHeaders: (res, filePath) => {
        const fileName = path.basename(filePath);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    }
}));

// Route GET pour rechercher un fichier PDF
app.post("/recherche", (req, res) => {
    const pdfName = req.query.pdf;

    if (!pdfName) {
        return res.status(400).json({ message: "Veuillez fournir le paramètre 'pdf'." });
    }

    // Convertir les espaces en underscores (_), ignorer la casse
    const sanitizedPdfName = pdfName.trim().toLowerCase().replace(/\s+/g, "_");
    const pdfPath = path.join(pdfDirectory, `${sanitizedPdfName}.pdf`);

    if (fs.existsSync(pdfPath)) {
        // Construire l'URL pour télécharger le fichier
        const fileUrl = `http://localhost:${port}/pdf/${sanitizedPdfName}.pdf`;
        res.json({ message: "Fichier trouvé.", url: fileUrl });
    } else {
        res.status(404).json({ message: `Le fichier '${sanitizedPdfName}.pdf' n'existe pas.` });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${port}`);
});
