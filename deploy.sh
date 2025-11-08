#!/bin/bash

# Script de déploiement Lowxy sur OVH
# Usage: ./deploy.sh [vps_ip] [domain]

set -e

VPS_IP=$1
DOMAIN=$2

if [ -z "$VPS_IP" ]; then
    echo "Usage: ./deploy.sh <vps_ip> [domain]"
    exit 1
fi

echo "🚀 Déploiement de Lowxy sur OVH VPS: $VPS_IP"

# Créer le répertoire de déploiement
echo "📁 Création du répertoire de déploiement..."
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp package*.json deploy/
cp next.config.ts deploy/

# Créer le fichier .env.production si nécessaire
if [ -f ".env.local" ]; then
    echo "⚙️ Copie des variables d'environnement..."
    cp .env.local deploy/.env.local
fi

# Créer le script de démarrage sur le serveur
cat > deploy/start.sh << 'EOF'
#!/bin/bash
cd /var/www/lowxy
npm install --production
npm run build
pm2 delete lowxy 2>/dev/null || true
pm2 start npm --name "lowxy" -- start
pm2 startup
pm2 save
EOF

chmod +x deploy/start.sh

echo "📤 Transfert des fichiers vers le serveur..."
rsync -avz --delete deploy/ root@$VPS_IP:/var/www/lowxy/

echo "🔧 Configuration du serveur..."
ssh root@$VPS_IP << EOF
    # Installer Node.js si pas déjà fait
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi

    # Installer PM2 si pas déjà fait
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi

    # Créer le répertoire si nécessaire
    mkdir -p /var/www/lowxy

    # Démarrer l'application
    cd /var/www/lowxy
    chmod +x start.sh
    ./start.sh
EOF

if [ -n "$DOMAIN" ]; then
    echo "🌐 Configuration du domaine $DOMAIN..."

    # Créer la configuration Nginx
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    scp nginx.conf root@$VPS_IP:/etc/nginx/sites-available/lowxy
    ssh root@$VPS_IP << EOF
        ln -sf /etc/nginx/sites-available/lowxy /etc/nginx/sites-enabled/
        nginx -t && systemctl reload nginx

        # Installer certbot pour SSL
        apt-get install -y certbot python3-certbot-nginx
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
EOF

    rm nginx.conf
fi

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est accessible sur: http://$VPS_IP"
if [ -n "$DOMAIN" ]; then
    echo "🔒 Et en HTTPS sur: https://$DOMAIN"
fi

# Nettoyer
rm -rf deploy
