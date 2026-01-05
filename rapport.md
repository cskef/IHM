# Rapport de Conception : Compteur de Personnes IA

Ce document détaille les phases d'analyse, de conception et de développement de l'application "Compteur de Personnes IA".

## 1. La phase d'Analyse

Cette étape initiale a permis de définir précisément le périmètre du projet et les besoins des utilisateurs finaux.

### L'utilisatrice / L'utilisateur (Personas)
Nous avons identifié deux personas principaux :
*   **Marc, Responsable de Sécurité :** Doit estimer rapidement la foule lors d'un événement public pour assurer le respect des jauges de sécurité. Il privilégie la rapidité et la mobilité.
*   **Julie, Analyste Retail :** Souhaite compter les clients dans une file d'attente à partir de photos prises sur le terrain pour optimiser les plannings. Elle a besoin de précision et d'une brève description du contexte.

### La tâche (Analyse de l'activité)
L'objectif principal est de **transformer une image visuelle en une donnée chiffrée exploitable**.
En utilisant la méthode **HTA (Hierarchical Task Analysis)**, la tâche se décompose ainsi :
1.  **Saisie de l'image**
    *   1.1. Ouvrir la galerie et sélectionner une photo.
    *   1.2. OU Activer la caméra et prendre un cliché en temps réel.
2.  **Lancement de l'analyse**
    *   2.1. Envoyer les données à l'IA (Gemini).
    *   2.2. Attendre le retour du serveur (Gestion de l'état d'attente).
3.  **Consultation des résultats**
    *   3.1. Lire le chiffre global.
    *   3.2. Consulter la description textuelle pour vérification contextuelle.
4.  **Action corrective / Suivante**
    *   4.1. Réessayer si l'image est floue.
    *   4.2. Passer à une nouvelle analyse.

### Critères d'ergonomie de Bastien et Scapin
L'analyse de l'interface a été guidée par les critères de référence pour assurer une expérience utilisateur optimale :
*   **Guidage :** L'application utilise des incitations claires ("Importer une photo", "Lancer le comptage") et des feedbacks immédiats (indicateur de chargement animé) pour orienter l'utilisateur.
*   **Charge de travail :** La densité informationnelle est réduite au strict nécessaire. Le processus est minimaliste pour réduire l'effort mémoriel (Action -> Résultat).
*   **Contrôle explicite :** L'utilisateur a toujours la possibilité de revenir en arrière ou d'annuler une capture via des boutons "X" ou "Retour" bien visibles.
*   **Gestion des erreurs :** En cas d'échec de l'IA ou d'accès caméra, un message explicite est affiché avec une solution de récupération immédiate (bouton "Réessayer").
*   **Homogénéité / Cohérence :** Les codes couleurs (Indigo pour l'action, Rouge pour l'erreur) et l'iconographie sont constants à travers tous les écrans.
*   **Signifiance des codes :** Utilisation d'icônes standards (appareil photo, nuage d'import) facilitant la reconnaissance immédiate des fonctions.

### Le contexte
*   **Mobilité :** L'application est conçue pour être "Mobile First" car le comptage se fait souvent sur le terrain.
*   **Environnement :** Utilisation possible en extérieur (besoin de contrastes élevés) ou dans des zones à connexion variable (nécessité de retours visuels clairs lors du chargement).

---

## 2. La phase de Conception et de Développement

### Prototypage (Fidélité croissante)
Le développement a suivi un cycle itératif :
1.  **Croquis (Sketch) :** Dessins initiaux sur papier pour définir l'emplacement du bouton central de capture et de la zone de résultat.
2.  **Maquette (Wireframe) :** Utilisation de Tailwind CSS pour structurer les blocs (Hero section, Input Grid, Result Card) sans logique métier, validant l'ergonomie visuelle.
3.  **Prototype :** Intégration de React pour gérer les transitions d'états (IDLE -> CAMERA -> ANALYZING -> RESULT). C'est la version actuelle où les interactions avec l'API Gemini sont fonctionnelles.

### Architecture Logicielle
L'application repose sur une séparation stricte des responsabilités pour garantir la maintenance et l'évolution :

*   **Noyau Fonctionnel (Abstraction) :** Le service `geminiService.ts` encapsule toute la logique de communication avec l'IA. Il traite les données brutes (base64) et retourne un objet structuré selon le schéma JSON défini.
*   **Interface Utilisateur (Présentation) :** Les composants React (`App.tsx`, `CameraCapture.tsx`, `Button.tsx`) gèrent uniquement l'affichage et les interactions. 
*   **Modèle de données :** Défini dans `types.ts`, il sert de contrat entre la logique métier et l'interface (Patterns proches du **MVC**).

L'utilisation de **React** permet une synchronisation fluide entre l'état de l'application (le "Modèle") et ce que l'utilisateur voit (la "Vue"), tandis que les services agissent comme des "Contrôleurs" traitant les entrées avant de mettre à jour l'état.
