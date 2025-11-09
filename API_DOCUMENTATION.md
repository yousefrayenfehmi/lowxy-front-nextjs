# 📚 Documentation API Backend - Lowxy

**URL Base** : `http://37.59.126.29:5000`

## 🔐 Authentification

### Connexion (Login)
- **POST** `http://37.59.126.29:5000/api/touriste/login`
  - Body: `{email, password}`
  - Retourne: `{token, ...}`

- **POST** `http://37.59.126.29:5000/api/chauffeur/login`
  - Body: `{email, password}`
  - Retourne: `{token, ...}`

- **POST** `http://37.59.126.29:5000/api/partenaire/login`
  - Body: `{email, password}`
  - Retourne: `{token, ...}`

### Inscription (Register)
- **POST** `http://37.59.126.29:5000/api/touriste/register`
  - Body: `{email, password, ...}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/chauffeur/register`
  - Body: `{email, password, ...}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/partenaire/register`
  - Body: `{email, password, ...}`
  - Headers: `Authorization: Bearer {token}`

### Vérification Email
- **POST** `http://37.59.126.29:5000/api/touriste-verifier-email`
  - Body: `{code}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/chauffeur-verifier-email`
  - Body: `{code}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/partenaire-verifier-email`
  - Body: `{code}`
  - Headers: `Authorization: Bearer {token}`

### Renvoyer Code
- **GET** `http://37.59.126.29:5000/api/touriste-reenvoyercode`
  - Headers: `Authorization: Bearer {token}`

- **GET** `http://37.59.126.29:5000/api/chauffeur-reenvoyercode`
  - Headers: `Authorization: Bearer {token}`

- **GET** `http://37.59.126.29:5000/api/partenaire-reenvoyercode`
  - Headers: `Authorization: Bearer {token}`

### Mot de Passe Oublié
- **POST** `http://37.59.126.29:5000/api/touriste/forgetpassword`
  - Body: `{email}`

- **POST** `http://37.59.126.29:5000/api/chauffeur/forgetpassword`
  - Body: `{email}`

- **POST** `http://37.59.126.29:5000/api/partenaire/forgetpassword`
  - Body: `{email}`

### Profils Utilisateurs
- **GET** `http://37.59.126.29:5000/api/touriste-by-token`
  - Headers: `Authorization: Bearer {token}`

- **GET** `http://37.59.126.29:5000/api/chauffeur-by-token`
  - Headers: `Authorization: Bearer {token}`

- **GET** `http://37.59.126.29:5000/api/partenaire-by-token`
  - Headers: `Authorization: Bearer {token}`

### Compléter Profil
- **POST** `http://37.59.126.29:5000/api/completertouriste`
  - Body: `{profileData}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/completerchauffeur`
  - Body: `{profileData}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/completerpartenaire`
  - Body: `{profileData}`
  - Headers: `Authorization: Bearer {token}`

## 🎯 Tours (Circuits Touristiques)

### Créer un Tour
- **POST** `http://37.59.126.29:5000/api/tours`
  - Body: `{tour}`
  - Headers: `Authorization: Bearer {token}`

### Mes Tours
- **GET** `http://37.59.126.29:5000/api/mes-tours`
  - Headers: `Authorization: Bearer {token}`

### Tours par Ville
- **GET** `http://37.59.126.29:5000/api/tours/ville/{ville}`
  - Headers: `Authorization: Bearer {token}` (optionnel)

### Tour par ID
- **GET** `http://37.59.126.29:5000/api/tours/{id}`
  - Headers: `Authorization: Bearer {token}`

### Réservations Tours
- **POST** `http://37.59.126.29:5000/api/tours/{tourId}/reservations`
  - Body: `{reservation}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/reservations/create-payment-session`
  - Body: `{reservation}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/reservations/complete-reservation`
  - Body: `{_id, tour_info, jour_info}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/reservations/confirm-payment`
  - Body: `{reservation_id, tour_id, jour_id, client_id, payment_id?}`
  - Headers: `Authorization: Bearer {token}`

- **POST** `http://37.59.126.29:5000/api/reservations/annuler-reservation-touriste`
  - Body: `{reservationId, tourId, jourId}`
  - Headers: `Authorization: Bearer {token}`

### Mes Réservations
- **GET** `http://37.59.126.29:5000/api/mes-reservations`
  - Headers: `Authorization: Bearer {token}`

## 📢 Covering Ads (Publicités)

### Créer une Campagne
- **POST** `http://37.59.126.29:5000/api/save`
  - Body: `{data}`
  - Headers: `Authorization: Bearer {token}`

### Session de Paiement Covering
- **POST** `http://37.59.126.29:5000/api/create`
  - Body: `{data}`
  - Headers: `Authorization: Bearer {token}`

### Confirmer Paiement Covering
- **POST** `http://37.59.126.29:5000/api/campaigns/confirm-payment`
  - Body: `{data}`
  - Headers: `Authorization: Bearer {token}`

### Mes Campagnes (Créateur)
- **GET** `http://37.59.126.29:5000/api/creator-campaigns`
  - Headers: `Authorization: Bearer {token}`

### Campagnes Disponibles (Chauffeurs)
- **GET** `http://37.59.126.29:5000/api/available`
  - Headers: `Authorization: Bearer {token}`

### Assigner Taxi à Campagne
- **POST** `http://37.59.126.29:5000/api/join/{coveringId}`
  - Body: `{}`
  - Headers: `Authorization: Bearer {token}`

### Mes Campagnes Assignées (Taxi)
- **GET** `http://37.59.126.29:5000/api/my-campaigns`
  - Headers: `Authorization: Bearer {token}`

## 👨‍💼 Admin

### Créer Article Ville
- **POST** `http://37.59.126.29:5000/api/admins/villeArticle`
  - Body: `{data}`
  - Headers: `Authorization: Bearer {token}`

### Articles Ville
- **GET** `http://37.59.126.29:5000/api/admin/villeArticle`
  - Headers: `Authorization: Bearer {token}`

## 🧪 Tester l'API

### Avec curl
```bash
# Test de connexion
curl -X POST http://37.59.126.29:5000/api/touriste/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Avec Postman/Insomnia
1. Créez une nouvelle requête
2. Méthode: `POST`
3. URL: `http://37.59.126.29:5000/api/touriste/login`
4. Headers: `Content-Type: application/json`
5. Body (JSON): `{"email":"...", "password":"..."}`

### Vérifier que l'API est en ligne
```bash
curl http://37.59.126.29:5000/
# Devrait retourner: {"message":"API iso running rahoulena"}
```

## 📝 Notes

- Tous les endpoints nécessitent généralement un token d'authentification dans le header `Authorization: Bearer {token}`
- Les tokens sont stockés dans `localStorage` après connexion
- L'URL base peut être changée dans `next.config.ts` si nécessaire

