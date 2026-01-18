// PDF Generation for learn@shift Persona Generator V2
// Uses browser's print-to-PDF functionality

window.generatePDF = function(formData) {
    const pdfWindow = window.open('', '_blank', 'width=1000,height=800');
    
    // Determine image source
    let imageHTML = '';
    if (formData.imageType === 'upload' && formData.uploadedImage) {
        imageHTML = `<img src="${formData.uploadedImage}" alt="Persona" style="width: 120px; height: 120px; object-fit: cover; border-radius: 60px;">`;
    } else if (formData.imageType === 'avatar' && formData.selectedAvatar) {
        const avatars = [
            { id: 1, image: 'images/avatars/woman-1.png' },
            { id: 2, image: 'images/avatars/woman-2.png' },
            { id: 3, image: 'images/avatars/woman-3.png' },
            { id: 4, image: 'images/avatars/woman-4.png' },
            { id: 5, image: 'images/avatars/woman-5.png' },
            { id: 6, image: 'images/avatars/woman-6.png' },
            { id: 7, image: 'images/avatars/man-1.png' },
            { id: 8, image: 'images/avatars/man-2.png' },
            { id: 9, image: 'images/avatars/man-3.png' },
            { id: 10, image: 'images/avatars/man-4.png' },
            { id: 11, image: 'images/avatars/man-5.png' },
            { id: 12, image: 'images/avatars/man-6.png' }
        ];
        const avatar = avatars.find(a => a.id === formData.selectedAvatar);
        if (avatar) {
            imageHTML = `<img src="${avatar.image}" alt="Avatar" style="width: 120px; height: 120px; object-fit: cover; border-radius: 60px;">`;
        } else {
            imageHTML = `<div style="width: 120px; height: 120px; border-radius: 60px; background: #FFCF02; display: flex; align-items: center; justify-content: center; font-size: 60px; color: white;">👤</div>`;
        }
    } else {
        imageHTML = `<div style="width: 120px; height: 120px; border-radius: 60px; background: #FFCF02; display: flex; align-items: center; justify-content: center; font-size: 60px; color: white;">👤</div>`;
    }
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Persona: ${formData.name || 'Teilnehmer'}</title>
    <style>
        @page { 
            margin: 1.5cm;
            size: A4;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #304F5D;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        .page-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            background: #FFCF02 !important;
            padding: 30px;
            border-radius: 25px;
            margin-bottom: 30px;
            text-align: center;
            border: 3px solid #FFCF02;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            color: #304F5D !important;
            font-weight: 700;
        }
        
        .header .subtitle {
            margin: 8px 0 0 0;
            color: #6F868F !important;
            font-size: 13px;
        }
        
        .profile {
            display: flex;
            gap: 25px;
            margin-bottom: 35px;
            padding: 25px;
            background: #FFF5CC !important;
            border-radius: 20px;
            align-items: center;
            page-break-inside: avoid;
            border: 2px solid #FFE24D;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .profile-image {
            flex-shrink: 0;
        }
        
        .profile-info h2 {
            margin: 0 0 6px 0;
            color: #304F5D !important;
            font-size: 26px;
        }
        
        .profile-info .meta {
            margin: 0;
            color: #6F868F !important;
            font-size: 15px;
        }
        
        .section {
            margin-bottom: 28px;
            page-break-inside: avoid;
        }
        
        .section-header {
            background: #FFCF02 !important;
            padding: 12px 25px;
            border-radius: 50px;
            font-weight: 700;
            color: #304F5D !important;
            margin-bottom: 16px;
            font-size: 17px;
            border: 2px solid #FFCF02;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .section-content {
            padding: 0 25px;
            color: #304F5D !important;
        }
        
        .section-content p {
            margin: 10px 0;
            font-size: 14px;
            color: #304F5D !important;
        }
        
        .section-content strong {
            color: #304F5D !important;
            font-weight: 600;
        }
        
        .pill-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        
        .pill {
            background: white !important;
            border: 2px solid #FFE24D !important;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 12px;
            color: #304F5D !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 3px solid #FFE24D !important;
            text-align: center;
            color: #6F868F !important;
            font-size: 11px;
        }
        
        .footer .logo {
            font-size: 22px;
            font-weight: bold;
            color: #304F5D !important;
            margin-bottom: 8px;
        }
        
        .footer .logo .at {
            color: #FFCF02 !important;
        }
        
        .print-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #33A966, #33A966);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(51, 169, 102, 0.3);
            transition: all 0.3s;
            z-index: 1000;
        }
        
        .print-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(51, 169, 102, 0.4);
        }
        
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            body { 
                background: white;
                padding: 0;
            }
            
            .print-button { 
                display: none;
            }
            
            .page-container {
                max-width: 100%;
            }
            
            .header {
                background: #FFCF02 !important;
                box-shadow: none;
            }
            
            .profile {
                background: #FFF5CC !important;
            }
            
            .section-header {
                background: #FFCF02 !important;
                box-shadow: none;
            }
            
            .pill {
                background: white !important;
                border: 2px solid #FFE24D !important;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="header">
            <h1>Teilnehmer-Persona</h1>
            <p class="subtitle">learn@shift | BFW Dortmund</p>
        </div>
        
        <div class="profile">
            <div class="profile-image">
                ${imageHTML}
            </div>
            <div class="profile-info">
                <h2>${formData.name || 'Persona Name'}</h2>
                <p class="meta">
                    ${formData.alter ? formData.alter + (formData.alter.includes('Jahr') ? '' : ' Jahre') : 'Alter nicht angegeben'}
                    ${formData.beruf ? ' | ' + formData.beruf : ''}
                    ${formData.familiensituation ? ' | ' + formData.familiensituation : ''}
                </p>
            </div>
        </div>
        
        ${(formData.massnahme || formData.semester || formData.grundReha || formData.besonderheiten) ? `
        <div class="section">
            <div class="section-header">Im Berufsförderungswerk</div>
            <div class="section-content">
                ${formData.massnahme ? `<p><strong>Maßnahme:</strong> ${formData.massnahme}</p>` : ''}
                ${formData.semester ? `<p><strong>Semester/Phase:</strong> ${formData.semester}</p>` : ''}
                ${formData.grundReha ? `<p><strong>Grund für Reha:</strong> ${formData.grundReha}</p>` : ''}
                ${formData.besonderheiten ? `<p><strong>Besonderheiten:</strong> ${formData.besonderheiten}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        ${(formData.fachlichesVorwissen || formData.anwendungsbezogeneVorerfahrungen || formData.offenePunkte) ? `
        <div class="section">
            <div class="section-header">Vorwissen & Ausgangskompetenzen</div>
            <div class="section-content">
                ${formData.fachlichesVorwissen ? `<p><strong>Thematisches Vorwissen:</strong> ${formData.fachlichesVorwissen}</p>` : ''}
                ${formData.anwendungsbezogeneVorerfahrungen ? `<p><strong>Anwendungsbezogene Vorerfahrungen:</strong> ${formData.anwendungsbezogeneVorerfahrungen}</p>` : ''}
                ${formData.offenePunkte ? `<p><strong>Offene Punkte:</strong> ${formData.offenePunkte}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        ${(formData.warumTeilnahme || formData.haltungLernen || formData.aengsteVorbehalte || formData.wasMotiviert) ? `
        <div class="section">
            <div class="section-header">Motivation & Lernhaltung</div>
            <div class="section-content">
                ${formData.warumTeilnahme ? `<p><strong>Teilnahme-Grund:</strong> ${formData.warumTeilnahme}</p>` : ''}
                ${formData.haltungLernen ? `<p><strong>Haltung zum Lernen:</strong> ${formData.haltungLernen}</p>` : ''}
                ${formData.aengsteVorbehalte ? `<p><strong>Hemmnisse & Vorbehalte:</strong> ${formData.aengsteVorbehalte}</p>` : ''}
                ${formData.wasMotiviert ? `<p><strong>Was hält am Ball:</strong> ${formData.wasMotiviert}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        ${(formData.digitaleLernvoraussetzungen || formData.bewaehrteLernzugaenge || formData.lerntempo || formData.selbststaendigkeit || formData.technischeRahmenbedingungen) ? `
        <div class="section">
            <div class="section-header">Lernvoraussetzungen</div>
            <div class="section-content">
                ${formData.digitaleLernvoraussetzungen ? `<p><strong>Digitale Lernvoraussetzungen:</strong> ${formData.digitaleLernvoraussetzungen}</p>` : ''}
                ${formData.bewaehrteLernzugaenge ? `<p><strong>Bewährte Lernzugänge:</strong> ${formData.bewaehrteLernzugaenge}</p>` : ''}
                ${formData.lerntempo ? `<p><strong>Lerntempo:</strong> ${formData.lerntempo}</p>` : ''}
                ${formData.selbststaendigkeit ? `<p><strong>Selbstständigkeit:</strong> ${formData.selbststaendigkeit}</p>` : ''}
                ${formData.technischeRahmenbedingungen ? `<p><strong>Technische Rahmenbedingungen:</strong> ${formData.technischeRahmenbedingungen}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        ${(formData.persoenlicheZiele || formData.herausforderungen || formData.unterstuetzung) ? `
        <div class="section">
            <div class="section-header">Ziele & Unterstützungsbedarf</div>
            <div class="section-content">
                ${formData.persoenlicheZiele ? `<p><strong>Persönliche Ziele:</strong> ${formData.persoenlicheZiele}</p>` : ''}
                ${formData.herausforderungen ? `<p><strong>Herausforderungen:</strong> ${formData.herausforderungen}</p>` : ''}
                ${formData.unterstuetzung ? `<p><strong>Erforderliche Unterstützung:</strong> ${formData.unterstuetzung}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        ${formData.persoenliches ? `
        <div class="section">
            <div class="section-header">Persönliches</div>
            <div class="section-content">
                <p>${formData.persoenliches.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <div class="logo">learn<span class="at">@</span>shift</div>
            <p>Erstellt am ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
    </div>
    
    <button class="print-button" onclick="window.print()">
        📄 Als PDF speichern
    </button>
</body>
</html>`;
    
    pdfWindow.document.write(html);
    pdfWindow.document.close();
};
