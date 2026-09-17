# Submit 61 trim-audio tasks, save task ids to JSON
$ErrorActionPreference = "Stop"
$fullUrl = "https://2130825428-amk-2130605177-default-534849.vod.cn-north-1.volcvideo.com/3bf654e2-a774-4ad3-8bac-2eeb6a39231a.mp3?preview=1&auth_key=1789716588-r0-u0-6b632a65dd0b86147a549f2256647060"
$qsPath = "E:\code\pte_doubao\server\data\wfd-questions.json"
$outPath = "C:\Users\Lenovo\AppData\Local\Doubao\User Data\Default\.doubao\agent_mode\workspace\.sessions\38441794909294850\agents\m_0cwECkeUeAa\scratch\trim_tasks.json"

$qs = Get-Content $qsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$tasks = @()
foreach ($q in $qs.questions) {
    $r = mediakit-cli editing trim-audio --audio-url $fullUrl --start-time $q.start --end-time $q.end --format mp3 2>$null
    $obj = $r | ConvertFrom-Json
    $tasks += [PSCustomObject]@{ id = $q.id; audio = $q.audio; task_id = $obj.task_id; success = $obj.success }
    Write-Output ("submitted {0} -> {1}" -f $q.id, $obj.task_id)
}
$tasks | ConvertTo-Json | Set-Content $outPath -Encoding UTF8
Write-Output "DONE total=$($tasks.Count)"
