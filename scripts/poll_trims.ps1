# Poll all trim tasks and download audio files
$ErrorActionPreference = "Continue"
$tasksPath = "C:\Users\Lenovo\AppData\Local\Doubao\User Data\Default\.doubao\agent_mode\workspace\.sessions\38441794909294850\agents\m_0cwECkeUeAa\scratch\trim_tasks.json"
$audioDir = "E:\code\pte_doubao\assets\audio"
$logPath = "C:\Users\Lenovo\AppData\Local\Doubao\User Data\Default\.doubao\agent_mode\workspace\.sessions\38441794909294850\agents\m_0cwECkeUeAa\scratch\download_log.txt"

$tasks = Get-Content $tasksPath -Raw -Encoding UTF8 | ConvertFrom-Json
$ok = 0; $fail = 0
foreach ($t in $tasks) {
    $target = Join-Path $audioDir $t.audio
    if (Test-Path $target) { Write-Output ("skip {0} exists" -f $t.audio); $ok++; continue }
    $r = mediakit-cli shared query-task --task-id $t.task_id --poll-complete 2>$null | Out-String
    $obj = $null
    try { $obj = $r | ConvertFrom-Json } catch {}
    if ($null -eq $obj -or $obj.status -ne "completed" -or $null -eq $obj.audio_url) {
        Write-Output ("FAIL {0} {1}" -f $t.audio, $r.Substring(0, [Math]::Min(200, $r.Length)))
        $fail++
        continue
    }
    curl.exe -s -L -o $target $obj.audio_url
    if ((Get-Item $target).Length -gt 1000) { Write-Output ("OK {0} {1}B" -f $t.audio, (Get-Item $target).Length); $ok++ }
    else { Write-Output ("SMALL {0} {1}B" -f $t.audio, (Get-Item $target).Length); $fail++ }
}
Write-Output ("DONE ok={0} fail={1}" -f $ok, $fail)
