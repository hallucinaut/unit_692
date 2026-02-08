---
title: 'UX Mobile : Anatomie d''un Menu Burger Minimaliste'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: 'Implémentation d''une navigation mobile sans bibliothèque tierce, optimisée pour l''accessibilité et la performance.'
tags: ['ux', 'css', 'javascript', 'accessibilité']
---

La navigation mobile est souvent le premier point de friction sur un site technique. L'usage de bibliothèques lourdes pour un simple bouton de menu est une erreur de conception. Pour **UNIT_692**, nous avons opté pour une approche "Vanilla" : du CSS pur et un script minimaliste.

## L'Indicateur d'État : Aria-Expanded

Le véritable moteur du menu n'est pas une classe CSS arbitraire, mais l'attribut `aria-expanded`. 
-   **Accessibilité :** Il informe les lecteurs d'écran de l'état du menu.
-   **Style :** Il sert de sélecteur CSS unique pour déclencher les animations.

```css
/* Transformation du burger en X via l'attribut */
.mobile-toggle[aria-expanded="true"] .burger-icon {
  background: transparent;
}
```

## Performance et "No-Layout-Shift"

En utilisant un tiroir (`drawer`) positionné en `fixed` et animé via `transform: translateX()`, nous déchargeons le calcul sur le GPU. Contrairement à une modification de `height` ou `top`, le `transform` ne provoque pas de "reflow" (re-calcul du layout de la page), garantissant une fluidité de 60fps même sur des appareils mobiles anciens.

## Gestion du Contexte SPA

Dans un environnement comme Astro avec des transitions client, le script du menu doit être résilient.
1.  **Ré-initialisation :** Utilisation de `astro:page-load` pour s'assurer que les écouteurs d'événements sont ré-attachés après chaque navigation.
2.  **Prévention des doublons :** Une logique de nettoyage est nécessaire pour éviter que plusieurs instances du script ne s'empilent en mémoire.

## Conclusion

Un menu burger ne doit pas être une "boîte noire" issue d'un framework. C'est un composant critique qui mérite une attention chirurgicale sur son poids et son comportement. La simplicité est ici la forme ultime de la sophistication technique.

**STATUT : NAVIGATION_OPTIMISÉE**
