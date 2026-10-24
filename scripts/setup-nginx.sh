#!/bin/bash
set -e

# ==============================================================================
# Enterprise ATS - Nginx Setup & Test Helper Script
# ==============================================================================

echo "===================================================="
echo "🌐 Enterprise ATS: Nginx Reverse Proxy Setup"
echo "===================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
CONF_SOURCE="$DIR/nginx/ats.conf"

echo "Checking Nginx installation..."
if ! command -v nginx >/dev/null 2>&1; then
    echo "⚠️ Nginx is not installed on this system."
    echo "  To install Nginx:"
    echo "    macOS:       brew install nginx"
    echo "    Ubuntu/Debian: sudo apt update && sudo apt install -y nginx"
    echo "    CentOS/RHEL:   sudo yum install -y nginx"
    echo "    Docker:        docker compose up -d nginx"
    exit 0
fi

NGINX_VERSION=$(nginx -v 2>&1)
echo "✅ Found $NGINX_VERSION"

# Determine target conf directory
if [ -d "/etc/nginx/sites-available" ]; then
    TARGET_DIR="/etc/nginx/sites-available"
    LINK_DIR="/etc/nginx/sites-enabled"
    echo "Detected Debian/Ubuntu Linux structure."
    echo "Copying/Linking configuration..."
    echo "sudo ln -sf \"$CONF_SOURCE\" $TARGET_DIR/ats.conf"
    echo "sudo ln -sf $TARGET_DIR/ats.conf $LINK_DIR/ats.conf"
elif [ -d "/etc/nginx/conf.d" ]; then
    TARGET_DIR="/etc/nginx/conf.d"
    echo "Detected RHEL/Docker structure ($TARGET_DIR)."
    echo "sudo ln -sf \"$CONF_SOURCE\" $TARGET_DIR/ats.conf"
elif [ -d "/usr/local/etc/nginx/servers" ]; then
    TARGET_DIR="/usr/local/etc/nginx/servers"
    echo "Detected macOS Homebrew Intel structure ($TARGET_DIR)."
    ln -sf "$CONF_SOURCE" "$TARGET_DIR/ats.conf"
    echo "✅ Linked $CONF_SOURCE -> $TARGET_DIR/ats.conf"
elif [ -d "/opt/homebrew/etc/nginx/servers" ]; then
    TARGET_DIR="/opt/homebrew/etc/nginx/servers"
    echo "Detected macOS Homebrew Apple Silicon structure ($TARGET_DIR)."
    ln -sf "$CONF_SOURCE" "$TARGET_DIR/ats.conf"
    echo "✅ Linked $CONF_SOURCE -> $TARGET_DIR/ats.conf"
else
    echo "Notice: Standard Nginx conf directory not auto-detected."
    echo "You can link '$CONF_SOURCE' into your Nginx conf.d directory manually."
fi

echo ""
echo "Testing Nginx syntax..."
nginx -t 2>/dev/null && echo "✅ Nginx syntax check passed!" || echo "ℹ️ Run 'sudo nginx -t' with elevated privileges to verify."

echo ""
echo "Reload command:"
echo "  sudo nginx -s reload"
echo "===================================================="
