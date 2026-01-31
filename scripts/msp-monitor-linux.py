#!/usr/bin/env python3
import platform
import subprocess
import json
import datetime
import os
import sys
import socket
import argparse

def get_os_info(client_id, site_id, machine_id):
    """
    Recopila información básica del sistema operativo.
    """
    try:
        # Intentar obtener info de distro
        if os.path.exists("/etc/os-release"):
            with open("/etc/os-release") as f:
                distro_info = {}
                for line in f:
                    if "=" in line:
                        k, v = line.strip().split("=", 1)
                        distro_info[k] = v.strip('"')
                os_name = distro_info.get("PRETTY_NAME", "Linux")
                os_version = distro_info.get("VERSION_ID", "")
        else:
            os_name = platform.system()
            os_version = platform.release()
            
        # Uptime
        uptime_seconds = 0
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
            
        last_boot = datetime.datetime.now() - datetime.timedelta(seconds=uptime_seconds)
        
        return {
            "MachineId": machine_id,
            "ComputerName": socket.gethostname(),
            "Domain": "", # Linux doesn't standardly have domains like Windows
            "Manufacturer": "", # Hard to get without root/dmidecode
            "Model": "", # Hard to get without root/dmidecode
            "OsName": os_name,
            "OsVersion": os_version,
            "Kernel": platform.release(),
            "LastBootUp": last_boot.isoformat(),
            "ClientId": client_id,
            "SiteId": site_id,
            "TimestampUtc": datetime.datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        return {"Error": str(e)}

def get_updates_summary():
    """
    Intenta detectar el gestor de paquetes y contar actualizaciones pendientes.
    Soporta apt (Debian/Ubuntu) y dnf/yum (RHEL/CentOS).
    """
    try:
        if os.path.exists("/usr/bin/apt"):
            # Debian/Ubuntu
            # apt-get -s upgrade
            # Se requiere que 'apt update' se corra externamente o via cron para tener datos frescos
            cmd = "apt-get -s -o Debug::NoLocking=true upgrade | grep -c '^Inst'"
            output = subprocess.check_output(cmd, shell=True).decode('utf-8').strip()
            total = int(output)
            # Dificil distinguir seguridad vs critico sin parseo complejo
            return {
                "TotalPending": total,
                "CriticalPending": 0, # Placeholder
                "SecurityPending": 0, # Placeholder
                "OtherPending": total,
                "Status": "OK",
                "PackageManager": "apt"
            }
        elif os.path.exists("/usr/bin/dnf") or os.path.exists("/usr/bin/yum"):
            # RHEL/CentOS
            cmd = "dnf check-update --security | grep -c 'Security'"
            # Este es un comando pesado, simplificamos con check-update -q
            # check-update devuelve codigo 100 si hay updates
            try:
                subprocess.check_call(["dnf", "check-update", "-q"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                total = 0
            except subprocess.CalledProcessError as e:
                if e.returncode == 100:
                    # Contar lineas
                    output = subprocess.check_output("dnf check-update -q | wc -l", shell=True).decode('utf-8').strip()
                    total = int(output)
                else:
                    total = 0
            
            return {
                "TotalPending": total,
                "CriticalPending": 0, 
                "SecurityPending": 0,
                "OtherPending": total,
                "Status": "OK",
                "PackageManager": "dnf/yum"
            }
        else:
            return {
                "TotalPending": None,
                "Status": "UnsupportedPackageManager"
            }
            
    except Exception as e:
        return {
            "Status": "Error",
            "ErrorMessage": str(e)
        }

def get_security_status():
    """
    Revisa estado básico de seguridad (Firewall, SELinux/AppArmor).
    Equivalente flexible a AntivirusStatus.
    """
    status = []
    
    # Check UFW
    if os.path.exists("/usr/sbin/ufw"):
        try:
            output = subprocess.check_output("ufw status", shell=True).decode('utf-8')
            active = "active" in output
            status.append({
                "Name": "UFW Firewall",
                "Enabled": active,
                "UpToDate": True,
                "ProductState": "Active" if active else "Inactive"
            })
        except:
            pass

    # Check AppArmor
    if os.path.exists("/sys/kernel/security/apparmor"):
        status.append({
            "Name": "AppArmor",
            "Enabled": True,
            "UpToDate": True,
            "ProductState": "Kernel Module Loaded"
        })
        
    # Check SELinux
    if os.path.exists("/usr/sbin/sestatus"):
        try:
            output = subprocess.check_output("sestatus", shell=True).decode('utf-8')
            enabled = "enabled" in output
            status.append({
                "Name": "SELinux",
                "Enabled": enabled,
                "UpToDate": True,
                "ProductState": output.split('\n')[0]
            })
        except:
            pass
            
    if not status:
        status.append({
            "Name": None,
            "Status": "NotDetected"
        })
        
    return status

def get_listening_ports():
    """
    Usa ss o netstat para ver puertos TCP escuchando.
    """
    ports = []
    try:
        # Prefer ss
        cmd = "ss -tulnH | awk '{print $5}'"
        output = subprocess.check_output(cmd, shell=True).decode('utf-8').splitlines()
        
        grouped_ports = {}
        
        for line in output:
            # line example: 127.0.0.1:53 or [::]:22 or *:80
            if not line: continue
            
            parts = line.rsplit(':', 1)
            if len(parts) == 2:
                ip = parts[0]
                port = parts[1]
                
                if port not in grouped_ports:
                    grouped_ports[port] = {"count": 0, "ips": set()}
                
                grouped_ports[port]["count"] += 1
                grouped_ports[port]["ips"].add(ip)

        for port, data in grouped_ports.items():
            ports.append({
                "Port": port,
                "Protocol": "TCP/UDP", # ss -tuln mixes both usually, mostly TCP
                "Count": data["count"],
                "LocalIPs": list(data["ips"]),
                "Processes": [] # Requires root usually to map to process
            })
            
    except Exception as e:
        pass
        
    return ports

def get_disk_status():
    """
    Usa df -h para ver espacio en disco.
    """
    disks = []
    try:
        # df -B1 --output=source,target,used,avail,size
        cmd = "df -B1 --output=source,target,used,avail,size | tail -n +2"
        output = subprocess.check_output(cmd, shell=True).decode('utf-8').splitlines()
        
        for line in output:
            parts = line.split()
            if len(parts) >= 5:
                # Filtrar loop devices y tmpfs si se desea
                source = parts[0]
                if source.startswith("/dev/loop") or source == "tmpfs":
                    continue
                    
                used = int(parts[2])
                free = int(parts[3])
                total = int(parts[4])
                
                if total > 0:
                    percent_free = round((free / total) * 100, 2)
                    
                    disks.append({
                        "Name": parts[1], # Mount point
                        "Device": source,
                        "UsedBytes": used,
                        "FreeBytes": free,
                        "TotalBytes": total,
                        "PercentFree": percent_free
                    })
    except Exception as e:
        pass
        
    return disks

def main():
    parser = argparse.ArgumentParser(description='MSP Ligero Linux Monitor Agent')
    parser.add_argument('--client-id', default='', help='ID del Cliente')
    parser.add_argument('--site-id', default='', help='ID de la Sede')
    parser.add_argument('--machine-id', default=socket.gethostname(), help='ID de la Máquina')
    
    args = parser.parse_args()
    
    result = {
        "Metadata": get_os_info(args.client_id, args.site_id, args.machine_id),
        "Updates": get_updates_summary(),
        "Security": get_security_status(),
        "ListeningPorts": get_listening_ports(),
        "Disks": get_disk_status()
    }
    
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    main()
