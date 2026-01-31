param(
    [string]$ClientId = "",
    [string]$SiteId = "",
    [string]$MachineId = $env:COMPUTERNAME
)

function Get-OsInfo {
    $os = Get-CimInstance -ClassName Win32_OperatingSystem
    $cs = Get-CimInstance -ClassName Win32_ComputerSystem
    [pscustomobject]@{
        MachineId     = $MachineId
        ComputerName  = $env:COMPUTERNAME
        Domain        = $cs.Domain
        Manufacturer  = $cs.Manufacturer
        Model         = $cs.Model
        OsName        = $os.Caption
        OsVersion     = $os.Version
        LastBootUp    = $os.LastBootUpTime
        ClientId      = $ClientId
        SiteId        = $SiteId
        TimestampUtc  = (Get-Date).ToUniversalTime()
    }
}

function Get-PendingUpdatesSummary {
    try {
        $session = New-Object -ComObject Microsoft.Update.Session
        $searcher = $session.CreateUpdateSearcher()
        $result = $searcher.Search("IsInstalled=0 and Type='Software'")
        $total = $result.Updates.Count
        $critical = 0
        $security = 0
        $other = 0
        foreach ($update in $result.Updates) {
            $isCritical = $false
            $isSecurity = $false
            foreach ($cat in $update.Categories) {
                if ($cat.Name -like "*Critical*") {
                    $isCritical = $true
                }
                if ($cat.Name -like "*Security*") {
                    $isSecurity = $true
                }
            }
            if ($isCritical) {
                $critical++
            } elseif ($isSecurity) {
                $security++
            } else {
                $other++
            }
        }
        [pscustomobject]@{
            TotalPending    = $total
            CriticalPending = $critical
            SecurityPending = $security
            OtherPending    = $other
            Status          = "OK"
        }
    } catch {
        [pscustomobject]@{
            TotalPending    = $null
            CriticalPending = $null
            SecurityPending = $null
            OtherPending    = $null
            Status          = "Error"
            ErrorMessage    = $_.Exception.Message
        }
    }
}

function Get-AntivirusStatus {
    $products = @()
    try {
        $products = Get-CimInstance -Namespace "root/SecurityCenter2" -ClassName "AntiVirusProduct" -ErrorAction Stop
    } catch {
        try {
            $products = Get-WmiObject -Namespace "root/SecurityCenter2" -Class "AntiVirusProduct" -ErrorAction Stop
        } catch {
            return ,([pscustomobject]@{
                    Name         = $null
                    ProductState = $null
                    PathToExe    = $null
                    UpToDate     = $null
                    Enabled      = $null
                    Status       = "Error"
                    ErrorMessage = $_.Exception.Message
                })
        }
    }
    $output = @()
    foreach ($p in $products) {
        $state = [int]$p.productState
        $enabled = ($state -band 0x10) -ne 0
        $uptodate = ($state -band 0x10000) -ne 0
        $output += [pscustomobject]@{
            Name         = $p.displayName
            ProductState = $p.productState
            PathToExe    = $p.pathToSignedProductExe
            UpToDate     = $uptodate
            Enabled      = $enabled
            Status       = "OK"
            ErrorMessage = $null
        }
    }
    if ($output.Count -eq 0) {
        $output += [pscustomobject]@{
            Name         = $null
            ProductState = $null
            PathToExe    = $null
            UpToDate     = $null
            Enabled      = $null
            Status       = "NotDetected"
            ErrorMessage = $null
        }
    }
    $output
}

function Get-ListeningPorts {
    $connections = @()
    try {
        $connections = Get-NetTCPConnection -State Listen -ErrorAction Stop
    } catch {
        return @()
    }
    $grouped = $connections | Group-Object -Property LocalPort
    $output = @()
    foreach ($g in $grouped) {
        $output += [pscustomobject]@{
            Port        = $g.Name
            Protocol    = "TCP"
            Count       = $g.Count
            LocalIPs    = ($g.Group | Select-Object -ExpandProperty LocalAddress -Unique)
            Processes   = ($g.Group | ForEach-Object { $_.OwningProcess } | Select-Object -Unique)
        }
    }
    $output
}

function Get-AdminAccounts {
    $members = @()
    try {
        $members = Get-LocalGroupMember -Group "Administrators" -ErrorAction Stop
    } catch {
        return @()
    }
    $output = @()
    foreach ($m in $members) {
        $output += [pscustomobject]@{
            Name      = $m.Name
            ObjectClass = $m.ObjectClass
            PrincipalSource = $m.PrincipalSource
        }
    }
    $output
}

function Get-DiskStatus {
    $drives = Get-PSDrive -PSProvider FileSystem
    $output = @()
    foreach ($d in $drives) {
        if ($d.Used -eq $null -or $d.Free -eq $null) {
            continue
        }
        $total = $d.Used + $d.Free
        if ($total -le 0) {
            continue
        }
        $percentFree = [math]::Round(($d.Free / $total) * 100, 2)
        $output += [pscustomobject]@{
            Name        = $d.Name
            UsedBytes   = $d.Used
            FreeBytes   = $d.Free
            TotalBytes  = $total
            PercentFree = $percentFree
        }
    }
    $output
}

$result = [pscustomobject]@{
    Metadata        = Get-OsInfo
    Updates         = Get-PendingUpdatesSummary
    Antivirus       = Get-AntivirusStatus
    ListeningPorts  = Get-ListeningPorts
    AdminAccounts   = Get-AdminAccounts
    Disks           = Get-DiskStatus
}

$result | ConvertTo-Json -Depth 6

