// learn@shift Persona Generator V2 - Vanilla JavaScript
// SCORM-compatible version with improved UX

const PersonaApp = {
    currentStep: 0,
    totalSteps: 8,

    // HTML Escaping for XSS protection
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // LocalStorage key
    storageKey: 'learnshift_persona_data',

    formData: {
        // Step 1: Basics
        name: '',
        alter: '',
        beruf: '',
        familiensituation: '',
        
        // Step 2: Bild
        imageType: 'avatar',
        selectedAvatar: null,
        uploadedImage: null,
        
        // Step 3: Im BFW
        massnahme: '',
        semester: '',
        grundReha: '',
        besonderheiten: '',
        
        // Step 4: Vorwissen
        fachlichesVorwissen: '',
        anwendungsbezogeneVorerfahrungen: '',
        offenePunkte: '',
        
        // Step 5: Motivation
        warumTeilnahme: '',
        haltungLernen: '',
        aengsteVorbehalte: '',
        wasMotiviert: '',
        
        // Step 6: Lernvoraussetzungen
        digitaleLernvoraussetzungen: '',
        bewaehrteLernzugaenge: '',
        lerntempo: '',
        selbststaendigkeit: '',
        technischeRahmenbedingungen: '',
        
        // Step 7: Ziele
        persoenlicheZiele: '',
        herausforderungen: '',
        unterstuetzung: '',
        
        // Step 8: Persönliches
        persoenliches: ''
    },
    
    avatars: [
        { id: 1, image: 'images/avatars/woman-1.png', name: 'Frau 1' },
        { id: 2, image: 'images/avatars/woman-2.png', name: 'Frau 2' },
        { id: 3, image: 'images/avatars/woman-3.png', name: 'Frau 3' },
        { id: 4, image: 'images/avatars/woman-4.png', name: 'Frau 4' },
        { id: 5, image: 'images/avatars/woman-5.png', name: 'Frau 5' },
        { id: 6, image: 'images/avatars/woman-6.png', name: 'Frau 6' },
        { id: 7, image: 'images/avatars/man-1.png', name: 'Mann 1' },
        { id: 8, image: 'images/avatars/man-2.png', name: 'Mann 2' },
        { id: 9, image: 'images/avatars/man-3.png', name: 'Mann 3' },
        { id: 10, image: 'images/avatars/man-4.png', name: 'Mann 4' },
        { id: 11, image: 'images/avatars/man-5.png', name: 'Mann 5' },
        { id: 12, image: 'images/avatars/man-6.png', name: 'Mann 6' },
    ],
    
    init() {
        try {
            this.loadFromStorage();
            this.renderStep();
            this.updateProgress();
            this.attachEventListeners();
            this.startAutoSave();
        } catch (error) {
            console.error('Fehler bei der Initialisierung:', error);
            this.showError('Die Anwendung konnte nicht vollständig geladen werden. Bitte Seite neu laden.');
        }
    },

    // LocalStorage: Load data
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.formData = { ...this.formData, ...data.formData };
                this.currentStep = data.currentStep || 0;
            }
        } catch (error) {
            console.warn('Konnte gespeicherte Daten nicht laden:', error);
        }
    },

    // LocalStorage: Save data
    saveToStorage() {
        try {
            const dataToSave = {
                formData: this.formData,
                currentStep: this.currentStep,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Konnte Daten nicht speichern:', error);
        }
    },

    // LocalStorage: Clear data
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Konnte Daten nicht löschen:', error);
        }
    },

    // Auto-save every 10 seconds
    startAutoSave() {
        setInterval(() => {
            this.saveCurrentStep();
            this.saveToStorage();
        }, 10000);
    },

    // Error display
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 1rem 1.5rem; border-radius: 10px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    },
    
    attachEventListeners() {
        document.getElementById('btn-back').addEventListener('click', () => this.prevStep());
        document.getElementById('btn-next').addEventListener('click', () => this.nextStep());
        document.getElementById('btn-download').addEventListener('click', () => this.downloadPDF());
    },
    
    prevStep() {
        if (this.currentStep > 0) {
            this.saveCurrentStep();
            this.currentStep--;
            this.renderStep();
            this.updateProgress();
            this.saveToStorage();
        }
    },

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.saveCurrentStep();
            this.currentStep++;
            this.renderStep();
            this.updateProgress();
            this.saveToStorage();
        }
    },
    
    saveCurrentStep() {
        const stepContent = document.getElementById('step-content');
        if (!stepContent) return;
        
        const inputs = stepContent.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'file') {
                // Skip file inputs - handled separately
            } else if (input.name) {
                this.formData[input.name] = input.value;
            }
        });
    },
    
    updateProgress() {
        const percentage = Math.round((this.currentStep / this.totalSteps) * 100);
        const stepText = this.currentStep === 0 ? 'Einstieg' : `Schritt ${this.currentStep} von ${this.totalSteps}`;
        
        document.getElementById('progress-text').textContent = stepText;
        document.getElementById('progress-percentage').textContent = `${percentage}%`;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        
        document.getElementById('btn-back').disabled = this.currentStep === 0;
        
        if (this.currentStep === this.totalSteps) {
            document.getElementById('btn-next').classList.add('hidden');
            document.getElementById('btn-download').classList.remove('hidden');
        } else {
            document.getElementById('btn-next').classList.remove('hidden');
            document.getElementById('btn-download').classList.add('hidden');
        }
    },
    
    renderStep() {
        const content = document.getElementById('step-content');
        
        switch(this.currentStep) {
            case 0: content.innerHTML = this.renderStep0(); break;
            case 1: content.innerHTML = this.renderStep1(); break;
            case 2: content.innerHTML = this.renderStep2(); this.attachStep2Listeners(); break;
            case 3: content.innerHTML = this.renderStep3(); break;
            case 4: content.innerHTML = this.renderStep4(); break;
            case 5: content.innerHTML = this.renderStep5(); break;
            case 6: content.innerHTML = this.renderStep6(); this.attachStep6Listeners(); break;
            case 7: content.innerHTML = this.renderStep7(); break;
            case 8: content.innerHTML = this.renderStep8(); break;
        }
        
        // Attach collapsible hint listeners
        this.attachHintListeners();
    },
    
    // STEP 0: Einstieg / Kontext
    renderStep0() {
        return `
            <div style="max-width: 700px; margin: 0 auto;">
                <h2 class="step-title" style="text-align: center;">Willkommen zum Persona-Generator</h2>
                
                <div class="info-box">
                    <h3>🎯 Worum geht es hier?</h3>
                    <p style="margin-bottom: 1rem;">
                        In diesem Tool beschreiben Sie eine <strong>typische teilnehmende Person</strong> aus Ihrem Arbeitsalltag im Berufsförderungswerk.
                    </p>
                    <p style="margin-bottom: 1rem;">
                        Die Persona dient als <strong>Arbeitsgrundlage für didaktische Entscheidungen</strong> – 
                        nicht zur Diagnose, Bewertung oder Dokumentation einzelner Personen.
                    </p>
                    <p>
                        Nutzen Sie dafür Ihr <strong>Erfahrungswissen aus der Praxis</strong>.
                    </p>
                </div>
                
                <div style="background: white; border: 2px solid var(--ideengelb-75); padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
                    <h3 style="color: var(--jetblau); margin-bottom: 1rem; font-size: 1.1rem;">💡 Wichtige Hinweise:</h3>
                    <ul style="color: var(--jetblau); line-height: 1.8;">
                        <li><strong>Stichworte und kurze Notizen reichen völlig aus.</strong></li>
                        <li>Sie müssen <strong>nicht alle Felder ausfüllen.</strong></li>
                        <li>Ziel ist eine übersichtliche Persona als PDF für Planung und Reflexion.</li>
                    </ul>
                </div>
                
                <div style="background: white; border: 2px solid var(--jetblau-25); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="color: var(--jetblau); margin-bottom: 0.75rem; font-size: 1rem;">ℹ️ Hinweis zur Speicherung</h3>
                    <p style="color: var(--jetblau); margin: 0; line-height: 1.6;">
                        Die Eingaben werden nicht dauerhaft gespeichert. Bitte erstellen Sie die Persona in einem Durchgang.
                    </p>
                </div>
            </div>
        `;
    },
    
    // STEP 1: Basics
    renderStep1() {
        return `
            <h2 class="step-title">1. Basics 👤</h2>
            
            <div class="info-box" style="margin-bottom: 2rem;">
                <p style="margin: 0;">
                    <strong>💡 Hinweis: Typisierend, nicht real</strong><br>
                    Bitte keine echten Klarnamen verwenden. Die Persona soll eine typische Person darstellen, 
                    nicht eine konkrete reale Person dokumentieren.
                </p>
            </div>
            
            <div class="form-group">
                <label for="persona-name">Persona-Name</label>
                <input type="text" id="persona-name" name="name" value="${this.escapeHtml(this.formData.name)}" placeholder="z.B. Uwe K." aria-describedby="name-helper">
                <div class="field-helper" id="name-helper">Fiktiver Name zur besseren Vorstellung</div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label for="persona-alter">Alter</label>
                    <input type="text" id="persona-alter" name="alter" value="${this.escapeHtml(this.formData.alter)}" placeholder="z.B. Mitte 30, Anfang 40">
                </div>

                <div class="form-group">
                    <label for="persona-beruf">Vor-Beruf</label>
                    <input type="text" id="persona-beruf" name="beruf" value="${this.escapeHtml(this.formData.beruf)}" placeholder="z.B. Metallbauer">
                </div>
            </div>

            <div class="form-group">
                <label for="persona-familie">Familiensituation</label>
                <input type="text" id="persona-familie" name="familiensituation" value="${this.escapeHtml(this.formData.familiensituation)}"
                       placeholder="z.B. verheiratet, 2 Kinder" aria-describedby="familie-helper">
                <div class="field-helper" id="familie-helper">Optional: Relevant für zeitliche Verfügbarkeit o.ä.</div>
            </div>
        `;
    },
    
    // STEP 2: Bild
    renderStep2() {
        // Check if image is uploaded or avatar selected
        const hasUploadedImage = this.formData.uploadedImage;
        const hasSelectedAvatar = this.formData.selectedAvatar;
        
        return `
            <h2 class="step-title">2. Bild auswählen 🖼️</h2>
            
            <p style="color: var(--jetblau-75); margin-bottom: 1.5rem;">
                Ein Bild macht die Persona greifbarer. Symbolbilder reichen völlig aus.
            </p>
            
            ${hasUploadedImage || hasSelectedAvatar ? `
                <div style="background: linear-gradient(to right, #e8f5e9, #c8e6c9); padding: 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2rem;">✅</div>
                    <div>
                        <strong style="color: #2e7d32;">Bild ausgewählt!</strong>
                        <p style="color: #558b2f; margin: 0.25rem 0 0 0; font-size: 0.9rem;">
                            ${hasUploadedImage ? 'Eigenes Bild hochgeladen' : 'Avatar ausgewählt'}
                        </p>
                    </div>
                </div>
            ` : ''}
            
            <div class="btn-group">
                <button class="btn btn-avatar ${this.formData.imageType === 'avatar' ? 'btn-active' : 'btn-inactive'}" type="button">
                    Avatar wählen
                </button>
                <button class="btn btn-upload ${this.formData.imageType === 'upload' ? 'btn-active' : 'btn-inactive'}" type="button">
                    Eigenes Bild hochladen
                </button>
            </div>
            
            <div id="avatar-section" class="${this.formData.imageType === 'avatar' ? '' : 'hidden'}">
                <div class="avatar-grid">
                    ${this.avatars.map(avatar => `
                        <div class="avatar-option ${this.formData.selectedAvatar === avatar.id ? 'selected' : ''}" data-avatar="${avatar.id}">
                            <img src="${avatar.image}" alt="${avatar.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50px;">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="upload-section" class="${this.formData.imageType === 'upload' ? '' : 'hidden'}">
                <div class="upload-area" id="upload-area">
                    <input type="file" id="image-upload" accept="image/*" style="display: none;">
                    ${this.formData.uploadedImage ? `
                        <div id="upload-preview">
                            <img src="${this.formData.uploadedImage}" class="upload-preview" alt="Hochgeladenes Bild" 
                                 style="max-width: 300px; border-radius: 20px; margin: 0 auto; display: block; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <p style="font-size: 0.875rem; color: var(--jetblau-75); margin-top: 1rem; text-align: center;">
                                ✓ Bild hochgeladen - Klicken zum Ändern
                            </p>
                        </div>
                    ` : `
                        <div id="upload-placeholder">
                            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p style="font-weight: 600; color: var(--jetblau); margin-top: 1rem;">
                                Klicken oder Bild hierher ziehen
                            </p>
                            <p style="font-size: 0.875rem; color: var(--jetblau-75); margin-top: 0.5rem;">
                                JPG, PNG, GIF bis 5MB
                            </p>
                        </div>
                    `}
                </div>
            </div>
        `;
    },
    
    attachStep2Listeners() {
        // Event delegation instead of individual listeners (prevents memory leaks)
        const container = document.getElementById('step-content');
        if (!container) return;

        // Handle button clicks via delegation
        container.addEventListener('click', (e) => {
            if (e.target.closest('.btn-avatar')) {
                this.formData.imageType = 'avatar';
                this.updateImageTypeUI();
            } else if (e.target.closest('.btn-upload')) {
                this.formData.imageType = 'upload';
                this.updateImageTypeUI();
            } else if (e.target.closest('.avatar-option')) {
                const avatarId = parseInt(e.target.closest('.avatar-option').dataset.avatar);
                this.formData.selectedAvatar = avatarId;
                this.formData.imageType = 'avatar';
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                e.target.closest('.avatar-option').classList.add('selected');
            }
        });

        // Handle keyboard navigation for avatars
        document.querySelectorAll('.avatar-option').forEach((option, index) => {
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'button');
            option.setAttribute('aria-label', `Avatar ${index + 1} auswählen`);
            option.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });

        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('image-upload');

        if (uploadArea && fileInput) {
            // Validate file size and type
            const validateFile = (file) => {
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

                if (!file) return { valid: false, error: 'Keine Datei ausgewählt' };
                if (!allowedTypes.includes(file.type)) {
                    return { valid: false, error: 'Ungültiger Dateityp. Nur JPG, PNG und GIF erlaubt.' };
                }
                if (file.size > maxSize) {
                    return { valid: false, error: 'Datei zu groß. Maximal 5MB erlaubt.' };
                }
                return { valid: true };
            };

            const handleFile = (file) => {
                const validation = validateFile(file);
                if (!validation.valid) {
                    this.showError(validation.error);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    this.formData.uploadedImage = event.target.result;
                    this.formData.imageType = 'upload';
                    this.renderStep();
                };
                reader.onerror = () => {
                    this.showError('Fehler beim Laden der Datei');
                };
                reader.readAsDataURL(file);
            };

            // Click to upload
            uploadArea.addEventListener('click', (e) => {
                if (e.target.tagName !== 'IMG') {
                    fileInput.click();
                }
            });

            // File selection
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) handleFile(file);
            });

            // Drag & Drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ideengelb)';
                uploadArea.style.background = '#FFF5CC';
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ideengelb-75)';
                uploadArea.style.background = 'white';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ideengelb-75)';
                uploadArea.style.background = 'white';

                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
            });
        }
    },
    
    updateImageTypeUI() {
        const avatarSection = document.getElementById('avatar-section');
        const uploadSection = document.getElementById('upload-section');
        const btnAvatar = document.querySelector('.btn-avatar');
        const btnUpload = document.querySelector('.btn-upload');
        
        if (this.formData.imageType === 'avatar') {
            avatarSection?.classList.remove('hidden');
            uploadSection?.classList.add('hidden');
            btnAvatar?.classList.add('btn-active');
            btnAvatar?.classList.remove('btn-inactive');
            btnUpload?.classList.remove('btn-active');
            btnUpload?.classList.add('btn-inactive');
        } else {
            avatarSection?.classList.add('hidden');
            uploadSection?.classList.remove('hidden');
            btnAvatar?.classList.remove('btn-active');
            btnAvatar?.classList.add('btn-inactive');
            btnUpload?.classList.add('btn-active');
            btnUpload?.classList.remove('btn-inactive');
        }
    },
    
    // STEP 3: Im BFW
    renderStep3() {
        return `
            <h2 class="step-title">3. Im Berufsförderungswerk – Reha- und Maßnahmenkontext 🏥</h2>
            
            <p style="color: var(--jetblau-75); margin-bottom: 1.5rem; line-height: 1.7;">
                Gemeint sind lernrelevante Aspekte, die sich aus Reha, Maßnahme und organisatorischen Rahmenbedingungen im Berufsförderungswerk ergeben.
            </p>
            
            <div class="info-box" style="margin-bottom: 2rem;">
                <p style="margin: 0;">
                    Fokus auf lernrelevante Informationen aus dem Reha- und Maßnahmenkontext – nicht auf medizinische Details. Was ist wichtig für die didaktische Planung?
                </p>
            </div>
            
            <div class="form-group">
                <label for="massnahme">Maßnahme / Bildungsgang</label>
                <input type="text" id="massnahme" name="massnahme" value="${this.escapeHtml(this.formData.massnahme)}"
                       placeholder="z.B. Umschulung Fachinformatiker/in">
            </div>

            <div class="form-group">
                <label for="semester">Semester / Phase</label>
                <input type="text" id="semester" name="semester" value="${this.escapeHtml(this.formData.semester)}"
                       placeholder="z.B. 2. Semester, Eingangsphase">
            </div>

            <div class="form-group">
                <label for="grundReha">Grund für berufliche Reha</label>
                <textarea id="grundReha" name="grundReha" placeholder="Förderbedarfe, Einschränkungen – bitte allgemein halten"
                          style="min-height: 100px;" aria-describedby="reha-helper">${this.escapeHtml(this.formData.grundReha)}</textarea>
                <div class="field-helper" id="reha-helper">Lernrelevante Aspekte, nicht medizinisch</div>
            </div>

            <div class="form-group">
                <label for="besonderheiten">Weitere lernrelevante Besonderheiten</label>
                <textarea id="besonderheiten" name="besonderheiten" placeholder="z.B. feste Tagesstruktur, wechselnde Belastbarkeit, zusätzliche Reha-Termine, erhöhter Unterstützungsbedarf, eingeschränkte zeitliche Flexibilität"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.besonderheiten)}</textarea>
            </div>
        `;
    },
    
    // STEP 4: Vorwissen
    renderStep4() {
        return `
            <h2 class="step-title">4. Vorwissen & Ausgangskompetenzen 🧠</h2>
            
            <div class="leitfrage">Was bringt die Person in Bezug auf Ihr gewähltes Thema bereits mit?</div>
            
            <div class="form-group">
                <label for="fachlichesVorwissen">Thematisches Vorwissen</label>
                <textarea id="fachlichesVorwissen" name="fachlichesVorwissen" placeholder="z.B. bekannte Begriffe, Grundlagen oder Zusammenhänge aus Ausbildung, Praxis oder früheren Schulungen – bezogen auf das Thema"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.fachlichesVorwissen || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="anwendungsbezogeneVorerfahrungen">Anwendungsbezogene Vorerfahrungen</label>
                <textarea id="anwendungsbezogeneVorerfahrungen" name="anwendungsbezogeneVorerfahrungen" placeholder="Hat die Person das Thema bereits in der Praxis angewendet? In welchem Kontext?"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.anwendungsbezogeneVorerfahrungen || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="offenePunkte">Offene Punkte im Vorwissen (optional)</label>
                <textarea id="offenePunkte" name="offenePunkte" placeholder="Welche Inhalte, Grundlagen oder Anwendungen fehlen der Person noch, um das Thema gut bearbeiten zu können?"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.offenePunkte || '')}</textarea>
            </div>
        `;
    },
    
    // STEP 5: Motivation
    renderStep5() {
        return `
            <h2 class="step-title">5. Motivation & Lernhaltung 💪</h2>
            
            <div class="leitfrage">Was motiviert die Person – und was beeinflusst ihr Lernverhalten?</div>
            
            <div class="form-group">
                <label for="warumTeilnahme">Warum nimmt die Person an der Maßnahme teil?</label>
                <textarea id="warumTeilnahme" name="warumTeilnahme" placeholder="z.B. berufliche Perspektive, Vorgabe durch Kostenträger, Wunsch nach Stabilität, Neustart, Absicherung"
                          style="min-height: 100px;">${this.escapeHtml(this.formData.warumTeilnahme || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="haltungLernen">Haltung zum Lernen</label>
                <textarea id="haltungLernen" name="haltungLernen" placeholder="z.B. eher vorsichtig, skeptisch, neugierig, aktiv, offen für Neues, vermeidend"
                          style="min-height: 100px;">${this.escapeHtml(this.formData.haltungLernen || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="aengsteVorbehalte">Hemmnisse und Vorbehalte beim Lernen</label>
                <textarea id="aengsteVorbehalte" name="aengsteVorbehalte" placeholder="z.B. Technik, Überforderung, Angst vor Bewertung, frühere Lernerfahrungen"
                          style="min-height: 100px;">${this.escapeHtml(this.formData.aengsteVorbehalte || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="wasMotiviert">Was hält die Person beim Lernen konkret am Ball?</label>
                <textarea id="wasMotiviert" name="wasMotiviert" placeholder="z.B. sichtbare Fortschritte, klare Struktur, Praxisbezug, Anerkennung, Sicherheit"
                          style="min-height: 100px;">${this.escapeHtml(this.formData.wasMotiviert || '')}</textarea>
            </div>
        `;
    },
    
    // STEP 6: Lernvoraussetzungen
    renderStep6() {
        return `
            <h2 class="step-title">6. Lernvoraussetzungen 🏠</h2>
            
            <div class="leitfrage">Wie lernt die Person gut?</div>
            
            <div class="form-group">
                <label for="digitaleLernvoraussetzungen">Digitale Lernvoraussetzungen im BFW-Kontext</label>
                <p style="color: var(--jetblau-75); font-size: 0.9rem; margin-bottom: 0.75rem;">
                    Lernrelevante digitale Fähigkeiten und Erfahrungen für das Arbeiten im Lernangebot.
                </p>
                <textarea id="digitaleLernvoraussetzungen" name="digitaleLernvoraussetzungen" placeholder="z.B. Arbeiten am PC/Laptop, Nutzung von Lernplattformen, Umgang mit digitalen Materialien, Teilnahme an Online-Meetings, Arbeiten mit Fachsoftware"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.digitaleLernvoraussetzungen || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="bewaehrteLernzugaenge">Bewährte Lernzugänge</label>
                <textarea id="bewaehrteLernzugaenge" name="bewaehrteLernzugaenge" placeholder="In welchen Lernformen kommt die Person gut ins Lernen? z.B. durch praktische Übungen, anschauliche Beispiele, klare Schritt-für-Schritt-Anleitungen, Austausch in der Gruppe, kurze Erklärinputs"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.bewaehrteLernzugaenge || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="lerntempo">Bevorzugtes Lerntempo</label>
                <textarea id="lerntempo" name="lerntempo" placeholder="z.B. eher langsam mit Wiederholungen, gleichmäßiges Tempo, schneller Einstieg möglich, zusätzlicher Pausenbedarf"
                          style="min-height: 80px;">${this.escapeHtml(this.formData.lerntempo || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="selbststaendigkeit">Selbstständigkeit beim Lernen</label>
                <textarea id="selbststaendigkeit" name="selbststaendigkeit" placeholder="Wie viel Begleitung braucht die Person beim Lernen? z.B. enge Anleitung nötig, regelmäßige Rückmeldung hilfreich, weitgehend selbstständig"
                          style="min-height: 80px;">${this.escapeHtml(this.formData.selbststaendigkeit || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="technischeRahmenbedingungen">Technische Rahmenbedingungen für das Lernen</label>
                <textarea id="technischeRahmenbedingungen" name="technischeRahmenbedingungen" placeholder="z.B. eigener Laptop oder nur BFW-Rechner, Internetzugang zu Hause, Nutzung von Lernplattformen möglich, Lernen außerhalb der BFW-Zeiten möglich"
                          style="min-height: 100px;">${this.escapeHtml(this.formData.technischeRahmenbedingungen || '')}</textarea>
            </div>
        `;
    },
    
    attachStep6Listeners() {
        // No special listeners needed anymore - removed tag selection
    },
    
    // STEP 7: Ziele & Unterstützung
    renderStep7() {
        return `
            <h2 class="step-title">7. Ziele & Unterstützungsbedarf 🎯</h2>
            
            <div class="leitfrage">Was soll durch das Lernen besser werden?</div>
            
            <div class="form-group">
                <label for="persoenlicheZiele">Persönliche Ziele</label>
                <textarea id="persoenlicheZiele" name="persoenlicheZiele" placeholder="Was möchte die Person erreichen? z.B. berufliche Handlungssicherheit, fachliche Kompetenz, mehr Selbstvertrauen im Umgang mit dem Thema"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.persoenlicheZiele || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="herausforderungen">Herausforderungen & Hürden</label>
                <textarea id="herausforderungen" name="herausforderungen" placeholder="Was erschwert das Lernen? Welche Hürden gibt es?"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.herausforderungen || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="unterstuetzung">Erforderliche Unterstützung zur Zielerreichung</label>
                <textarea id="unterstuetzung" name="unterstuetzung" placeholder="Welche Hilfestellungen sind nötig, damit die Person die Ziele erreichen kann? z.B. zusätzliche Erklärungen, mehr Zeit, kleinschrittige Anleitungen, Feedback, technische Unterstützung"
                          style="min-height: 120px;">${this.escapeHtml(this.formData.unterstuetzung || '')}</textarea>
            </div>
        `;
    },
    
    // STEP 8: Persönliches
    renderStep8() {
        return `
            <h2 class="step-title">8. Persönliches ✨</h2>
            
            <div class="leitfrage">Was macht die Person als Lernende greifbar?</div>
            
            <p style="color: var(--jetblau-75); margin-bottom: 1.5rem; line-height: 1.7;">
                Hobbys, Mediennutzung, typische Aussagen oder Gewohnheiten – was hilft, die Person als Lernende lebendig vorzustellen?
            </p>
            
            <div class="form-group">
                <label for="persoenliches">Persönliches (freiwillig)</label>
                <textarea id="persoenliches" name="persoenliches" placeholder="z.B. • typisches Zitat oder häufige Aussage („Kann ich das auch praktisch ausprobieren?") • Hobbys oder Interessen, die Lernbeispiele anschlussfähig machen • bevorzugte Medien oder Kanäle (z.B. YouTube, Podcasts, Austausch) • kleine Eigenheiten im Lernverhalten"
                          style="min-height: 200px;">${this.escapeHtml(this.formData.persoenliches || '')}</textarea>
                <div class="field-helper">Dieses Feld ist optional, hilft aber dabei, Lernangebote lebensnah und anschlussfähig zu gestalten.</div>
            </div>
            
            <div class="success-box">
                <div class="success-icon">💡</div>
                <div class="success-content">
                    <h3>Persona vollständig!</h3>
                    <p>Sie können jetzt die Persona als PDF im learn@shift Design herunterladen.</p>
                    <p style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--jetblau-75);">
                        <strong>Hinweis:</strong> Die Persona wird während der Erstellung nicht gespeichert. Bitte laden Sie die PDF am Ende herunter.
                    </p>
                </div>
            </div>
        `;
    },
    
    // Helper Functions
    toggleHint(hintId) {
        const content = document.getElementById(hintId);
        const icon = document.getElementById('icon-' + hintId);
        
        if (content && icon) {
            content.classList.toggle('hidden');
            icon.classList.toggle('open');
        }
    },
    
    attachHintListeners() {
        // Hints are handled via onclick in HTML
    },
    
    downloadPDF() {
        this.saveCurrentStep();
        window.generatePDF(this.formData);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PersonaApp.init();
});
