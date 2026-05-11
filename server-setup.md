# Server Setup Masterclass — Fresh VPS Checklist

> Headless, lightweight, production-ready. Run this top to bottom on every new server.

---

## Before you start — generate an SSH key (on your Mac)

One key per server. Run this on your local machine:

```bash
ssh-keygen -t ed25519 -C "client year" -f ~/.ssh/client_provider-servername
```

Real example for this server:

```bash
ssh-keygen -t ed25519 -C "boholz 2026" -f ~/.ssh/boholz_hetzner-vps1
```

The `-C` comment is just a label — it shows up at the end of the public key so you can identify it at a glance in `authorized_keys`. Use it to record what the key is for and when you made it.

Upload the **public** key to Hetzner during server creation (SSH Keys section), or add it manually via the Hetzner console. Never share the private key (the one without `.pub`).

---

## 0. First login

```bash
ssh root@your-server-ip
```

Update everything before touching anything else:

```bash
apt update && apt upgrade -y
```

---

## 1. Create a non-root user

Never run your server as root day-to-day.

```bash
adduser m                        # creates user + home dir, prompts for password
usermod -aG sudo m               # give sudo access

# Copy your SSH key to the new user
mkdir -p /home/m/.ssh
cp /root/.ssh/authorized_keys /home/m/.ssh/authorized_keys
chown -R m:m /home/m/.ssh
chmod 700 /home/m/.ssh
chmod 600 /home/m/.ssh/authorized_keys
```

Now test in a new terminal before closing root:

```bash
ssh m@your-server-ip
sudo whoami   # should print: root
```

---

## 2. Disable password login forever

Once your SSH key is on the server and working, lock the door.

```bash
sudo vim /etc/ssh/sshd_config
```

Find and set these lines (add them if missing):

```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

Apply:

```bash
sudo systemctl restart ssh
```

**Test in a new terminal before closing your current session.** If you lock yourself out you'll need console access.

> **Ubuntu/cloud-init gotcha:** Hetzner (and most cloud providers) inject a drop-in file that overrides your main config. Always check after editing:
>
> ```bash
> grep -r "PasswordAuthentication" /etc/ssh/
> ```
>
> If you see `yes` in `/etc/ssh/sshd_config.d/50-cloud-init.conf`, override it:
>
> ```bash
> echo "PasswordAuthentication no" | sudo tee /etc/ssh/sshd_config.d/50-cloud-init.conf
> sudo systemctl restart ssh
> ```

To verify it's actually off:

```bash
ssh -o PubkeyAuthentication=no m@your-server-ip
# Should immediately say: Permission denied (publickey)
```

---

## 3. Install everything

Two steps: apt packages (one command), then tools that need their own repos (Docker, cloudflared).

### 3a. Apt packages — one shot

```bash
sudo apt install -y \
  ufw \
  fail2ban \
  git \
  vim \
  curl \
  jq \
  unzip \
  ripgrep \
  htop \
  ncdu \
  bat \
  fd-find \
  logrotate \
  unattended-upgrades \
  cron \
  build-essential \
  ca-certificates \
  gnupg \
  lsb-release
```

| Package               | What it is                                  |
| --------------------- | ------------------------------------------- |
| `ufw`                 | Firewall — wraps iptables                   |
| `fail2ban`            | Bans IPs that brute-force SSH               |
| `git`                 | Version control                             |
| `vim`                 | Terminal text editor                        |
| `curl`                | HTTP requests from the terminal             |
| `jq`                  | Parse/query JSON in the terminal            |
| `unzip`               | Archive extraction                          |
| `ripgrep`             | `grep` but 10× faster                       |
| `htop`                | Interactive process viewer                  |
| `ncdu`                | Visual disk usage explorer                  |
| `bat`                 | `cat` with syntax highlighting              |
| `fd-find`             | `find` but fast and ergonomic               |
| `logrotate`           | Prevents logs from eating your disk         |
| `unattended-upgrades` | Auto-applies security patches               |
| `cron`                | Scheduled tasks                             |
| `build-essential`     | gcc, make — required to compile from source |

### 3b. Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
```

That's the official convenience script — handles the repo, GPG key, and install in one shot.

---

## 4. Configure everything

### UFW — firewall rules

Since all web traffic is routed through Cloudflare Tunnel, the server never needs to accept inbound HTTP/HTTPS. The tunnel dials _out_ from the server to Cloudflare — no open ports required for web traffic.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh                   # do this BEFORE enabling or you lock yourself out

sudo ufw enable
sudo ufw status verbose
```

### Fail2ban

Fail2ban watches `/var/log/auth.log` in real time. If any IP fails SSH login too many times in a short window, it automatically adds an iptables rule to block that IP temporarily. Without it, bots will hammer your SSH port thousands of times a day.

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Edit `/etc/fail2ban/jail.local`, find `[sshd]` and set:

```ini
[sshd]
enabled  = true
port     = ssh
maxretry = 5
bantime  = 1h
findtime = 10m
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo fail2ban-client status sshd
```

### Docker — let your user run it without sudo

```bash
sudo usermod -aG docker m
# Log out and back in for this to take effect
docker run hello-world
```

### bat and fd — fix Ubuntu binary names

Ubuntu ships these with different binary names than the tools expect:

```bash
mkdir -p ~/.local/bin
ln -s /usr/bin/batcat ~/.local/bin/bat
ln -s $(which fdfind) ~/.local/bin/fd
```

Add `~/.local/bin` to PATH if not already (add to `~/.bashrc` or `~/.zshrc`):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### unattended-upgrades

```bash
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Interactive — just say yes
```

Security patches now apply automatically. Still manually run `apt upgrade` for everything else.

### Ghostty — terminfo on the server

Run this **on your local Mac** — it reads your local ghostty terminfo and installs it on the server in one shot:

```bash
infocmp -x xterm-ghostty | ssh m@your-server-ip -- tic -x -
```

If you're on macOS before Sonoma, the bundled `infocmp` is too old. Install a newer one first:

```bash
brew install ncurses
/opt/homebrew/opt/ncurses/bin/infocmp -x xterm-ghostty | ssh m@your-server-ip -- tic -x -
```

Add to `~/.ssh/config`:

```
Host boholz-vps
  HostName your-server-ip
  User m
  IdentityFile ~/.ssh/boholz_hetzner_vps1
```

### SSH — harden further

Add to `/etc/ssh/sshd_config`:

```
MaxAuthTries 3
LoginGraceTime 20
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers m
```

```bash
sudo systemctl restart ssh
```

---

## 5. Quick verification checklist

After setup, confirm everything:

```bash
sudo ufw status verbose                               # firewall active
sudo systemctl status fail2ban                        # fail2ban running
sudo systemctl status docker                          # docker running
ssh -o PubkeyAuthentication=no m@YOUR_IP         # password login refused
docker run hello-world                                # docker works without sudo
bat ~/.bashrc                                         # bat works (syntax highlighted)
fd --version                                          # fd works
```

---

## Quick reference

```bash
# Firewall
sudo ufw status
sudo ufw allow 8080
sudo ufw delete allow 8080

# Fail2ban
sudo fail2ban-client status sshd
sudo fail2ban-client unban IP_ADDRESS

# Disk usage
ncdu /                  # interactive explorer
df -h                   # disk free summary
du -sh /var/log         # size of a specific dir
```
